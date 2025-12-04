import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

/**
 * ✅ ترتيب السيرفرات:
 * 1. Local (Primary)
 * 2. Railway (Backup)
 */
const SERVERS = [
  "ws://10.10.10.19:3000",
  "wss://smartchairserver-production.up.railway.app",
];

// ⏱️ debounce لإطفاء الكاميرا
let cameraTimeout = null;

export function DataProvider({ children }) {
  const [camActive, setCamActive] = useState(false);
  const [attention, setAttention] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  const [drowsy, setDrowsy] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);

  const wsRef = useRef(null);
  const serverIndexRef = useRef(0);
  const retryTimeoutRef = useRef(null);

  // ==========================
  // WebSocket Connect Logic
  // ==========================
  const connectWS = () => {
    const url = SERVERS[serverIndexRef.current];
    console.log(`🔌 Connecting to ${url}`);

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log(`✅ Connected to ${url}`);
      };

      wsRef.current.onclose = () => {
        console.log(`❌ WS closed: ${url}`);

        resetData();

        // 🔁 انتقل للسيرفر التالي
        serverIndexRef.current =
          (serverIndexRef.current + 1) % SERVERS.length;

        retryTimeoutRef.current = setTimeout(() => {
          connectWS();
        }, 5000);
      };

      wsRef.current.onerror = (err) => {
        console.log("⚠️ WS Error", err.message);
        wsRef.current.close();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // ===============================
          // Camera Status (Heartbeat)
          // ===============================
          if (data.type === "camera_status") {
            if (data.active) {
              if (cameraTimeout) {
                clearTimeout(cameraTimeout);
                cameraTimeout = null;
              }
              setCamActive(true);
            } else {
              if (!cameraTimeout) {
                cameraTimeout = setTimeout(() => {
                  resetData();
                  cameraTimeout = null;
                }, 3000);
              }
            }
            return;
          }

          // ===============================
          // Camera Data
          // ===============================
          setCamActive(true);
          setAttention(data.attention_level);
          setIsPresent(data.is_present);
          setDrowsy(data.drowsy);
          setWorkSeconds(data.working_duration_seconds);

        } catch (e) {
          console.log("❌ Parse error:", e);
        }
      };
    } catch (e) {
      console.log("❌ WS init error:", e);

      serverIndexRef.current =
        (serverIndexRef.current + 1) % SERVERS.length;

      retryTimeoutRef.current = setTimeout(() => {
        connectWS();
      }, 5000);
    }
  };

  // ==========================
  // Reset UI State
  // ==========================
  const resetData = () => {
    setCamActive(false);
    setAttention(null);
    setIsPresent(false);
    setDrowsy(false);
    setWorkSeconds(0);
  };

  // ==========================
  // Init on Mount
  // ==========================
  useEffect(() => {
    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
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
