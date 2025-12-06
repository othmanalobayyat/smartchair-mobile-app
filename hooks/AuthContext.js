// hooks/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// غيّر هذا لاحقاً حسب بيئتك (محلي / Railway)
const API_BASE = "https://smartchairserver-production.up.railway.app"; // نفس السيرفر المحلي

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // { id, name, email }
  const [token, setToken] = useState(null);    // JWT
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("userInfo");
        const savedToken = await AsyncStorage.getItem("authToken");
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch {}
      setLoading(false);
    };
    loadAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "خطأ في تسجيل الدخول");
    }

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);

    await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));
    await AsyncStorage.setItem("authToken", data.token);
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "فشل إنشاء الحساب");
    }

    // بعد النجاح، يمكن إما:
    // 1) ترجيع success ونخلي المستخدم يروح لشاشة login
    // أو 2) نعمل login تلقائي
    // حالياً: نخليه يرجع لـ login
    return true;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("userInfo");
    await AsyncStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}