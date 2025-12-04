import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// ترتيب الاتصال فقط عند الفشل
const SERVERS = [
  "ws://10.10.10.19:3000", // LOCAL
  "wss://smartchairserver-production.up.railway.app", // BACKUP
];

let cameraTimeout = null;

export function DataProvider({ children }) {
  const [camActive, setCamActive] = useState(false);
  const [attention, setAttention] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  const [drowsy, setDrowsy] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);

  const wsRef = useRef(null);
  const serverIndexRef = useRef(0);
  const reconnectTimer = useRef(null);

  const resetData = () => {
    setCamActive(false);
    setAttention(null);
    setIsPresent(false);
    setDrowsy(false);
    setWorkSeconds(0);
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

        if (data.type === "camera_status") {
          if (data.active) {
            if (cameraTimeout) clearTimeout(cameraTimeout);
            setCamActive(true);
          } else {
            cameraTimeout = setTimeout(() => {
              resetData();
            }, 3000);
          }
          return;
        }

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

      serverIndexRef.current =
        (serverIndexRef.current + 1) % SERVERS.length;

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
