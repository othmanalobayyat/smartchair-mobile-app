// screens/SmartChair.js
import React, { useState, useEffect, useRef } from "react";
import i18n from "../../hooks/i18n";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/ThemeContext";
import { useData } from "../../hooks/DataContext";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Header from "./components/Header";
import ChairGraphic from "./components/ChairGraphic";
import SensorsCard from "./components/SensorsCard";
import SessionStatusCard from "./components/SessionStatusCard";
import Controls from "./components/Controls";

export default function SmartChairScreen() {
  const { theme, isDark } = useTheme();

  // 🟢 NEW: جلب بيانات الكرسي الحقيقية من DataContext
  const {
    attention,
    camActive,
    camOnline,
    isPresent,
    drowsy,
    workSeconds,
    chairPressures,
    chairPosture,
  } = useData();

  // إذا ما وصلت بيانات من السيرفر → fallback حتى ما يضرب UI
  const pressures = chairPressures || [0.25, 0.25, 0.25, 0.25];

  const posture = chairPosture || "correct";

  const [chairActive] = useState(true);
  const [monitoring, setMonitoring] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // أنيميشن الكرسي كما هو
  useEffect(() => {
    const id = setInterval(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    return () => clearInterval(id);
  }, []);

  const statusBg = (active) =>
    active ? theme.statusSuccessBg : theme.statusErrorBg;

  const statusColor = (active) => (active ? theme.success : theme.error);

  const getColor = (v) => {
    if (!monitoring) return theme.disabled;
    if (v > 0.35) return theme.error; // حمل زائد
    if (v > 0.28) return theme.warning; // ميل
    return theme.success; // توزيع جيد
  };

  const attentionText =
    attention == null ? "—" : attention > 60 ? "مركز" : "مشتت";

  let timeLabel = "00:00";

  if (workSeconds > 0) {
    if (workSeconds < 3600) {
      // أقل من ساعة → دقائق : ثواني
      const minutes = Math.floor(workSeconds / 60);
      const seconds = workSeconds % 60;
      timeLabel = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    } else {
      // ساعة أو أكثر → ساعات : دقائق
      const hours = Math.floor(workSeconds / 3600);
      const minutes = Math.floor((workSeconds % 3600) / 60);
      timeLabel = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }
  }

  return (
    <LinearGradient colors={theme.gradient} style={s.container}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <Header theme={theme} />

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* STATUS ROW */}
        <View style={s.headerStatusRow}>
          <View
            style={[s.statusBox, { backgroundColor: statusBg(chairActive) }]}
          >
            <MaterialCommunityIcons
              name="power-plug"
              size={18}
              color={statusColor(chairActive)}
            />
            <Text style={[s.statusText, { color: theme.text }]}>
              {chairActive ? i18n.t("chairConnected") : i18n.t("chairInactive")}
            </Text>
          </View>

          <View style={[s.statusBox, { backgroundColor: statusBg(camActive) }]}>
            <MaterialCommunityIcons
              name="video"
              size={18}
              color={statusColor(camActive)}
            />
            <Text style={[s.statusText, { color: theme.text }]}>
              {!camOnline
                ? i18n.t("camDisconnected")
                : camActive
                ? i18n.t("camActive")
                : i18n.t("camDisabled")}
            </Text>
          </View>
        </View>

        {/* CHAIR SVG */}
        <View style={s.chairOnly}>
          <ChairGraphic
            pressures={pressures}
            monitoring={monitoring}
            scaleAnim={scaleAnim}
            theme={theme}
            isDark={isDark}
            getColor={getColor}
          />
        </View>

        {/* SENSOR READINGS */}
        <SensorsCard pressures={pressures} theme={theme} isDark={isDark} />

        {/* SESSION STATUS */}
        <SessionStatusCard
          posture={posture}
          attentionText={attentionText}
          timeLabel={timeLabel}
          isPresent={isPresent}
          drowsy={drowsy}
          theme={theme}
          isDark={isDark}
        />

        {/* CONTROLS */}
        <Controls
          monitoring={monitoring}
          setMonitoring={setMonitoring}
          theme={theme}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  headerStatusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 15,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chairOnly: { marginTop: 25, alignItems: "center", justifyContent: "center" },
});
