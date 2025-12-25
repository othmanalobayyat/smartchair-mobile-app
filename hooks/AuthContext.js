// hooks/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, avatar }
  const [token, setToken] = useState(null); // JWT
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

  const updateProfile = async (name, email, avatar) => {
    const res = await fetch(`${API_BASE}/auth/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, avatar }),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "حدث خطأ أثناء تعديل البيانات");

    setUser(data.user);
    await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));
  };

  const changePassword = async (oldPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "خطأ في تغيير كلمة المرور");

    return true;
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
        updateProfile, // ← جديد
        changePassword, // ← جديد
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
