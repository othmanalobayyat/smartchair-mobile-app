// hooks/SettingsContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage keys (centralized, no magic strings)
 */
const STORAGE_KEYS = {
  SOUND: "SETTINGS_SOUND_ENABLED",
  VIBRATION: "SETTINGS_VIBRATION_ENABLED",
};

/**
 * Default values
 */
const DEFAULT_SETTINGS = {
  soundEnabled: true,
  vibrationEnabled: true,
};

const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

export function SettingsProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(
    DEFAULT_SETTINGS.soundEnabled
  );
  const [vibrationEnabled, setVibrationEnabled] = useState(
    DEFAULT_SETTINGS.vibrationEnabled
  );
  const [ready, setReady] = useState(false);

  /**
   * Load settings from storage once
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const entries = await AsyncStorage.multiGet([
          STORAGE_KEYS.SOUND,
          STORAGE_KEYS.VIBRATION,
        ]);

        const soundValue = entries[0][1];
        const vibrationValue = entries[1][1];

        if (soundValue !== null) {
          setSoundEnabled(soundValue === "true");
        }

        if (vibrationValue !== null) {
          setVibrationEnabled(vibrationValue === "true");
        }
      } catch (error) {
        console.warn("Failed to load settings:", error);
      } finally {
        setReady(true);
      }
    };

    loadSettings();
  }, []);

  /**
   * Persist sound setting
   */
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
  }, [soundEnabled, ready]);

  /**
   * Persist vibration setting
   */
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEYS.VIBRATION, String(vibrationEnabled));
  }, [vibrationEnabled, ready]);

  const value = {
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    ready,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
