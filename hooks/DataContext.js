// hooks/DataContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings } from "./SettingsContext";
import { playAlertSound, vibrateAlert } from "../services/NotificationService";
import { sendLocalNotification } from "../services/NotificationService";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// ترتيب السيرفرات حسب الأولوية
const SERVERS = [
  "wss://smartchair.posturic.online", // PRIMARY (Cloudflare)
  "wss://smartchairserver-production.up.railway.app", // BACKUP
];

let cameraTimeout = null;

export function DataProvider({ children }) {
  // ===================== SETTINGS =====================
  const {
    alertEnabled,
    alertIntervalMinutes,
    alertTypes,
    soundEnabled,
    vibrationEnabled,
  } = useSettings();

  const lastAlertRef = useRef(0);

  const triggerAlert = async (type) => {
    if (!alertEnabled) return;
    if (!alertTypes[type]) return;

    const now = Date.now();
    const cooldown = alertIntervalMinutes * 60 * 1000;

    if (now - lastAlertRef.current < cooldown) return;
    lastAlertRef.current = now;

    // إشعار فعلي
    await sendLocalNotification({
      title: "Posturic Alert",
      body:
        type === "BAD_POSTURE"
          ? "Please correct your sitting posture"
          : type === "DROWSINESS"
          ? "You look drowsy. Take a short break"
          : "Attention required",
    });
  };
  // ===================== CAMERA STATES =====================
  const [camOnline, setCamOnline] = useState(false);
  const [attention, setAttention] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  const [drowsy, setDrowsy] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);

  // PRIVACY (زر toggle)
  const [cameraEnabled, setCameraEnabled] = useState(true);

  // PAIRING
  const [cameraPaired, setCameraPaired] = useState(false);

  const normalizePosture = (raw) => {
    if (!raw) return "correct";
    if (raw === "no_user") return "no_user";

    if (raw.includes("Right")) return "right";
    if (raw.includes("Left")) return "left";
    if (raw.includes("Forward")) return "forward";
    if (raw.includes("Back")) return "back";

    return "correct";
  };

  useEffect(() => {
    AsyncStorage.getItem("CAMERA_PAIRED").then((v) => {
      setCameraPaired(v === "true");
    });
  }, []);

  // ===================== CHAIR STATES =====================
  const [chairOnline, setChairOnline] = useState(false);
  const chairTimeoutRef = useRef(null);
  const [chairPressures, setChairPressures] = useState(null);
  const [chairPosture, setChairPosture] = useState("correct");
  const [chairBattery, setChairBattery] = useState(null);

  // ===================== WS =====================
  const wsRef = useRef(null);
  const serverIndexRef = useRef(0);
  const reconnectTimer = useRef(null);

  // RESET EVERYTHING WHEN DEVICE DISCONNECTS
  const resetData = () => {
    // camera
    setAttention(null);
    setIsPresent(false);
    setDrowsy(false);
    setWorkSeconds(0);

    // chair
    setChairPressures(null);
    setChairPosture("no_user"); // ✅ ثابتة وواضحة
    setChairBattery(null);
  };

  const connect = () => {
    const url = SERVERS[serverIndexRef.current];
    console.log(`🔌 Connecting to ${url}`);

    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log(`✅ Connected to ${url}`);

      wsRef.current.send(
        JSON.stringify({
          type: "camera_control",
          action: cameraEnabled ? "start" : "stop",
        })
      );
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // ================================
        //  🪑  CHAIR LIVE DATA
        // ================================
        if (data.type === "chair_data") {
          setChairOnline(true);

          if (chairTimeoutRef.current) clearTimeout(chairTimeoutRef.current);

          chairTimeoutRef.current = setTimeout(() => {
            setChairOnline(false);
            setChairPressures(null);
            setChairBattery(null);

            triggerAlert("NO_MOVEMENT");
          }, 6000);

          setChairPressures(
            Array.isArray(data.pressures) && data.pressures.length === 4
              ? data.pressures
              : null
          );

          setChairPosture(normalizePosture(data.posture));

          setChairBattery(
            typeof data.battery === "number" ? data.battery : null
          );

          return;
        }

        // ================================
        //  🎥 CAMERA STATUS
        // ================================
        if (data.type === "camera_status") {
          if (data.active) {
            setCamOnline(true);
            if (cameraTimeout) clearTimeout(cameraTimeout);
          } else {
            cameraTimeout = setTimeout(() => {
              setCamOnline(false);
              resetData();
              triggerAlert("CAMERA_DISCONNECTED");
            }, 6000);
          }
          return;
        }

        // ================================
        //  🎥 CAMERA FULL DATA STREAM
        // ================================
        if (data.type === "camera_frame") {
          setCamOnline(true);
          setAttention(data.attention_level);
          setIsPresent(data.is_present);
          setDrowsy(data.drowsy);
          setWorkSeconds(data.working_duration_seconds);
        }
      } catch (e) {
        console.log("❌ JSON error", e);
      }
    };

    wsRef.current.onerror = () => {
      wsRef.current.close();
    };

    wsRef.current.onclose = () => {
      console.log("❌ WS closed");

      resetData();

      serverIndexRef.current = (serverIndexRef.current + 1) % SERVERS.length;

      reconnectTimer.current = setTimeout(connect, 6000);
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (cameraTimeout) clearTimeout(cameraTimeout);
    };
  }, []);

  // FINAL CAMERA STATE (derived)
  const camActive = cameraPaired && camOnline && cameraEnabled;

  useEffect(() => {
    if (!cameraPaired || !camOnline) return;
    if (!wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: "camera_control",
        action: cameraEnabled ? "start" : "stop",
      })
    );
  }, [cameraEnabled, cameraPaired, camOnline]);

  // ===================== ALERT CONDITIONS =====================

  // BAD POSTURE
  useEffect(() => {
    if (chairPosture === "right" || chairPosture === "left") {
      triggerAlert("BAD_POSTURE");
    }
  }, [chairPosture]);

  // DROWSINESS
  useEffect(() => {
    if (drowsy) {
      triggerAlert("DROWSINESS");
    }
  }, [drowsy]);

  return (
    <DataContext.Provider
      value={{
        camActive,
        camOnline,
        cameraEnabled,
        setCameraEnabled,
        setCameraPaired,
        attention,
        isPresent,
        drowsy,
        workSeconds,
        chairOnline,
        chairPressures,
        chairPosture,
        chairBattery,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
