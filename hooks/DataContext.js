// hooks/DataContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// ترتيب السيرفرات حسب الأولوية
const SERVERS = [
  "ws://10.10.10.19:3000", // LOCAL
  "wss://smartchairserver-production.up.railway.app", // BACKUP
];

let cameraTimeout = null;

export function DataProvider({ children }) {
  // CAMERA STATES
  const [camOnline, setCamOnline] = useState(false);
  const [attention, setAttention] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  const [drowsy, setDrowsy] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);

  // PRIVACY (زر toggle)
  const [cameraEnabled, setCameraEnabled] = useState(true);

  // PAIRING (مؤقت)
  const [cameraPaired, setCameraPaired] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("CAMERA_PAIRED").then((v) => {
      setCameraPaired(v === "true");
    });
  }, []);

  // CHAIR STATES (NEW)
  const [chairOnline, setChairOnline] = useState(false);
  const chairTimeoutRef = useRef(null);
  const [chairPressures, setChairPressures] = useState(null);
  const [chairPosture, setChairPosture] = useState(null);
  const [chairBattery, setChairBattery] = useState(null);

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
    setChairPosture(null);
    setChairBattery(null);
  };

  const connect = () => {
    const url = SERVERS[serverIndexRef.current];
    console.log(`🔌 Connecting to ${url}`);

    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log(`✅ Connected to ${url}`);

      // أرسل حالة الخصوصية الحالية فور الاتصال
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
            setChairPosture(null);
            setChairBattery(null);
          }, 3000);

          setChairPressures(data.pressures || null);
          setChairPosture(data.posture || null);
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
            }, 3000);
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

      reconnectTimer.current = setTimeout(connect, 3000);
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
  // FINAL CAMERA STATE (derived, NOT a state)
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
