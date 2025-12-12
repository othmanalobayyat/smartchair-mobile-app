// hooks/DataContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [camActive, setCamActive] = useState(false);
  const [attention, setAttention] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  const [drowsy, setDrowsy] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);

  // CHAIR STATES (NEW)
  const [chairPressures, setChairPressures] = useState(null);
  const [chairPosture, setChairPosture] = useState(null);
  const [chairBattery, setChairBattery] = useState(null);

  const wsRef = useRef(null);
  const serverIndexRef = useRef(0);
  const reconnectTimer = useRef(null);

  // RESET EVERYTHING WHEN DEVICE DISCONNECTS
  const resetData = () => {
    // camera
    setCamActive(false);
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
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // ================================
        //  🪑  CHAIR LIVE DATA
        // ================================
        if (data.type === "chair_data") {
          if (Array.isArray(data.pressures)) {
            setChairPressures(data.pressures);
          }

          if (data.posture) {
            setChairPosture(data.posture);
          }

          if (typeof data.battery === "number") {
            setChairBattery(data.battery);
          }

          return; // مهم جدًا
        }

        // ================================
        //  🎥 CAMERA STATUS
        // ================================
        if (data.type === "camera_status") {
          if (data.active) {
            if (cameraTimeout) clearTimeout(cameraTimeout);
            setCamActive(true);
          } else {
            cameraTimeout = setTimeout(() => resetData(), 3000);
          }
          return;
        }

        // ================================
        //  🎥 CAMERA FULL DATA STREAM
        // ================================
        setCamActive(true);
        setAttention(data.attention_level);
        setIsPresent(data.is_present);
        setDrowsy(data.drowsy);
        setWorkSeconds(data.working_duration_seconds);
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

  return (
    <DataContext.Provider
      value={{
        camActive,
        attention,
        isPresent,
        drowsy,
        workSeconds,

        // CHAIR DATA (NEW)
        chairPressures,
        chairPosture,
        chairBattery,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
