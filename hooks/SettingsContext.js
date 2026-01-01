// hooks/SettingsContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage keys (centralized, no magic strings)
 */
const STORAGE_KEYS = {
  SOUND: "SETTINGS_SOUND_ENABLED",
  VIBRATION: "SETTINGS_VIBRATION_ENABLED",

  ALERT_ENABLED: "SETTINGS_ALERT_ENABLED",
  ALERT_INTERVAL: "SETTINGS_ALERT_INTERVAL",
  ALERT_TYPES: "SETTINGS_ALERT_TYPES",
};

/**
 * Default values
 */
const DEFAULT_SETTINGS = {
  soundEnabled: true,
  vibrationEnabled: true,

  alertEnabled: true,
  alertIntervalMinutes: 5,
  alertTypes: {
    BAD_POSTURE: true,
    NO_MOVEMENT: true,
    DROWSINESS: false,
    CAMERA_DISCONNECTED: true,
  },
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
  // ===============================
  // States
  // ===============================
  const [soundEnabled, setSoundEnabled] = useState(
    DEFAULT_SETTINGS.soundEnabled
  );
  const [vibrationEnabled, setVibrationEnabled] = useState(
    DEFAULT_SETTINGS.vibrationEnabled
  );

  const [alertEnabled, setAlertEnabled] = useState(
    DEFAULT_SETTINGS.alertEnabled
  );
  const [alertIntervalMinutes, setAlertIntervalMinutes] = useState(
    DEFAULT_SETTINGS.alertIntervalMinutes
  );
  const [alertTypes, setAlertTypes] = useState(
    DEFAULT_SETTINGS.alertTypes
  );

  const [ready, setReady] = useState(false);

  // ===============================
  // Load settings once
  // ===============================
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const entries = await AsyncStorage.multiGet([
          STORAGE_KEYS.SOUND,
          STORAGE_KEYS.VIBRATION,
          STORAGE_KEYS.ALERT_ENABLED,
          STORAGE_KEYS.ALERT_INTERVAL,
          STORAGE_KEYS.ALERT_TYPES,
        ]);

        const soundValue = entries[0][1];
        const vibrationValue = entries[1][1];
        const alertEnabledValue = entries[2][1];
        const alertIntervalValue = entries[3][1];
        const alertTypesValue = entries[4][1];

        if (soundValue !== null)
          setSoundEnabled(soundValue === "true");

        if (vibrationValue !== null)
          setVibrationEnabled(vibrationValue === "true");

        if (alertEnabledValue !== null)
          setAlertEnabled(alertEnabledValue === "true");

        if (alertIntervalValue !== null)
          setAlertIntervalMinutes(Number(alertIntervalValue));

        if (alertTypesValue !== null)
          setAlertTypes(JSON.parse(alertTypesValue));

      } catch (error) {
        console.warn("Failed to load settings:", error);
      } finally {
        setReady(true);
      }
    };

    loadSettings();
  }, []);

  // ===============================
  // Persist settings
  // ===============================
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(
      STORAGE_KEYS.SOUND,
      String(soundEnabled)
    );
  }, [soundEnabled, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(
      STORAGE_KEYS.VIBRATION,
      String(vibrationEnabled)
    );
  }, [vibrationEnabled, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(
      STORAGE_KEYS.ALERT_ENABLED,
      String(alertEnabled)
    );
  }, [alertEnabled, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(
      STORAGE_KEYS.ALERT_INTERVAL,
      String(alertIntervalMinutes)
    );
  }, [alertIntervalMinutes, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(
      STORAGE_KEYS.ALERT_TYPES,
      JSON.stringify(alertTypes)
    );
  }, [alertTypes, ready]);

  // ===============================
  // Context value
  // ===============================
  const value = {
    soundEnabled,
    setSoundEnabled,

    vibrationEnabled,
    setVibrationEnabled,

    alertEnabled,
    setAlertEnabled,

    alertIntervalMinutes,
    setAlertIntervalMinutes,

    alertTypes,
    setAlertTypes,

    ready,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
