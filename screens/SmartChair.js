// screens/SmartChair.js
import React, { useState, useEffect, useRef } from "react";
import i18n from "../hooks/i18n";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import Svg, { Path, Rect, G, Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/ThemeContext";
import { useData } from "../hooks/DataContext"; //Data
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Header from "./SmartChairScreens/Header";
import ChairGraphic from "./SmartChairScreens/ChairGraphic";
import SensorsCard from "./SmartChairScreens/SensorsCard";
import SessionStatusCard from "./SmartChairScreens/SessionStatusCard";
import Controls from "./SmartChairScreens/Controls";

export default function SmartChair() {
  const { theme, isDark } = useTheme();
  const { attention, camActive, isPresent, drowsy, workSeconds } = useData();
  const [chairActive] = useState(true);
  const [pressures, setPressures] = useState([5, 8, 6, 10, 7, 9]);
  const [posture, setPosture] = useState("صحيحة");
  const [monitoring, setMonitoring] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => {
      setPressures((prev) =>
        prev.map((v) =>
          Math.max(0, Math.min(15, v + (Math.random() - 0.5) * 2))
        )
      );
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

  const statusBg = (active) => {
    if (!isDark) return active ? "#D4EDDA" : "#F5C6CB";
    return active ? "rgba(46, 204, 113, 0.18)" : "rgba(231, 76, 60, 0.18)";
  };

  const statusColor = (active) => (active ? theme.success : theme.error);

  const getColor = (v) => {
    if (!monitoring) return "#BDC3C7";
    if (v > 10) return theme.error;
    if (v > 6) return theme.warning;
    return theme.success;
  };

  const attentionText =
    attention == null ? "—" : attention > 60 ? "مركز" : "مشتت";

  const hours = Math.floor(workSeconds / 3600);
  const minutes = Math.floor((workSeconds % 3600) / 60);

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
              {camActive ? i18n.t("camActive") : i18n.t("camOff")}
            </Text>
          </View>
        </View>

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

        {/* قراءة الحساسات */}
        <SensorsCard pressures={pressures} theme={theme} isDark={isDark} />

        {/* STATUS CARD */}
        <SessionStatusCard
          posture={posture}
          attentionText={attentionText}
          hours={hours}
          minutes={minutes}
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
  headerContainer: {
    backgroundColor: "#2B4C7E",
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "800" },
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
  card: {
    borderRadius: 22,
    paddingVertical: 26, // ⬅️ أكبر
    paddingHorizontal: 22,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  equalCard: { minHeight: 160, justifyContent: "center" },
  cardDark: { backgroundColor: "#2C2F33" },
  cardLight: { backgroundColor: "#FFF" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  readingsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  readCell: { width: "45%", marginVertical: 6, alignItems: "center" },
  readVal: { fontSize: 14, fontWeight: "600" },
  status: { fontSize: 18, fontWeight: "700" },
  subStatus: { fontSize: 16 },
  controls: { flexDirection: "row", gap: 10, marginVertical: 25 },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },

  btnGray: { backgroundColor: "#A5B8D8" },
  btnTxt: { color: "#FFF", fontWeight: "700" },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  infoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // ✅ هذا هو المفتاح
    marginVertical: 14,
  },

  infoTextGroup: {
    flex: 1,
    justifyContent: "center",
  },

  infoLabel: {
    fontSize: 15, // ⬅️ أكبر
    opacity: 0.6,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 19, // ⬅️ أهم سطر
    fontWeight: "800",
  },

  rowReverse: {
    flexDirection: "row-reverse",
  },

  iconBubble: {
    width: 42, // ⬅️ أكبر وواضح
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  alertRow: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    flexDirection: "row",
    alignItems: "center",
  },

  alertText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
