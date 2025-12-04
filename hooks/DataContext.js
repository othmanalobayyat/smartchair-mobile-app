// context/DataContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// ⏱️ Timeout لعمل debounce على حالة الكاميرا
let cameraTimeout = null;

export function DataProvider({ children }) {
  const [camActive, setCamActive] = useState(false);
  const [attention, setAttention] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  const [drowsy, setDrowsy] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://10.10.10.19:3000");

    ws.onopen = () => {
      console.log("📡 Mobile connected to WS");
    };

    ws.onclose = () => {
      console.log("❌ WS Disconnected");

      // نعتبر الانقطاع حقيقي مباشرة فقط عند إغلاق الـ WS بالكامل
      setCamActive(false);
      setAttention(null);
      setIsPresent(false);
      setDrowsy(false);
      setWorkSeconds(0);
    };

    ws.onerror = (err) => {
      console.log("⚠️ WS Error:", err.message);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // ============================================
        // حالة الكاميرا (مع debounce)
        // ============================================
        if (data.type === "camera_status") {
          if (data.active) {
            // ✅ الكاميرا فعالة → نلغي أي إطفاء مؤجل
            if (cameraTimeout) {
              clearTimeout(cameraTimeout);
              cameraTimeout = null;
            }
            setCamActive(true);
          } else {
            // ⏳ ننتظر 3 ثواني قبل اعتبارها مطفأة
            if (!cameraTimeout) {
              cameraTimeout = setTimeout(() => {
                setCamActive(false);
                setAttention(null);
                setIsPresent(false);
                setDrowsy(false);
                setWorkSeconds(0);
                cameraTimeout = null;
              }, 3000);
            }
          }
          return;
        }

        // ============================================
        // بيانات الكاميرا نفسها
        // ============================================
        setCamActive(true); // وصول بيانات يعني الكاميرا فعالة
        setAttention(data.attention_level);
        setIsPresent(data.is_present);
        setDrowsy(data.drowsy);
        setWorkSeconds(data.working_duration_seconds);

      } catch (e) {
        console.log("❌ Parse error:", e);
      }
    };

    return () => ws.close();
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
