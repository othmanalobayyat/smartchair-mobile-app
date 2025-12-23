// screens/Statistics.js
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";
import { useTheme } from "../hooks/ThemeContext";
import { useAuth } from "../hooks/AuthContext";
import i18n from "../hooks/i18n";
import SessionCard from "./StatisticsScreens/SessionCard";
import DailyScoreCard from "./StatisticsScreens/DailyScoreCard";
import InsightTip from "./StatisticsScreens/InsightTip";
import HistoryButton from "./StatisticsScreens/HistoryButton";

export default function Statistics() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const { token } = useAuth();

  // ⭐ حل بسيط لإعادة تحديث الصفحة عند تغيير اللغة
  const [, forceRerender] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      // عندما تتغير i18n.locale → سيؤثر على render
      forceRerender((v) => !v);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} ${i18n.t("minutesUnit")}`;
    }

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (m === 0) {
      return `${h} ${i18n.t("hoursUnit")}`;
    }

    return `${h} ${i18n.t("hoursUnit")} ${m} ${i18n.t("minutesUnit")}`;
  };

  const [sessions, setSessions] = useState([]);
  const [dailyScore, setDailyScore] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1️⃣ daily score
        const summaryRes = await fetch(
          "http://10.76.189.74:3000/api/stats/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const summary = await summaryRes.json();
        setDailyScore(summary.score ?? 0);

        // 2️⃣ sessions list
        const sessionsRes = await fetch(
          "http://10.76.189.74:3000/api/session/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sessionsData = await sessionsRes.json();

        setSessions(
          sessionsData.map((s, i) => ({
            id: i + 1,
            duration: Math.round(s.duration_seconds / 60),
            correct: s.avg_posture_score,
            alerts: s.alerts_count,
          }))
        );
      } catch (e) {
        console.log("❌ Failed to fetch stats", e);
      }
    };

    if (!token) return;
    fetchStats();
  }, [token]);

  const tip = i18n.locale.startsWith("ar")
    ? "ميلك للأمام زاد اليوم 20% عن أمس."
    : "Your forward leaning increased by 20% today.";

  const colorByScore = (x) =>
    x >= 80 ? theme.success : x >= 60 ? theme.secondary : theme.error;

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <AppHeader
        title={i18n.t("statsTitle")}
        subtitle={i18n.t("statsOverview")}
      />

      {/* PAGE TITLE */}
      <Text style={[s.title, { color: theme.primary }]}>
        {i18n.t("dailySummary")}
      </Text>

      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      >
        {sessions.map((sess) => (
          <SessionCard
            key={sess.id}
            session={sess}
            theme={theme}
            isDark={isDark}
            formatDuration={formatDuration}
            colorByScore={colorByScore}
          />
        ))}

        {/* التقييم اليومي */}
        <DailyScoreCard
          dailyScore={dailyScore}
          theme={theme}
          isDark={isDark}
          colorByScore={colorByScore}
        />

        {/* نص الملاحظة */}
        <InsightTip text={tip} theme={theme} />

        {/* زر التاريخ */}
        <HistoryButton
          theme={theme}
          onPress={() => navigation.navigate("Historical")}
        />
      </ScrollView>
    </View>
  );
}

// ====================== STYLES ======================
const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  headerContainer: {
    backgroundColor: "#2B4C7E",
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "700" },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 16,
    textAlign: "center",
  },
  card: {
    width: "92%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  table: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    writingDirection: "rtl",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconText: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 15, fontWeight: "500" },
  value: { fontSize: 15, fontWeight: "700" },
  sep: { height: 1 },
  scoreCard: { width: "92%", borderRadius: 15, padding: 18, marginTop: 10 },
  scoreTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  barBg: { width: "100%", height: 10, borderRadius: 6, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 6 },
  scoreText: {
    textAlign: "right",
    marginTop: 8,
    fontWeight: "700",
    fontSize: 15,
  },
  tipBox: { width: "92%", borderRadius: 15, padding: 14, marginTop: 20 },
  tipText: { fontWeight: "500", textAlign: "center", fontSize: 15 },
  btn: { paddingVertical: 14, borderRadius: 12, marginTop: 22, width: "92%" },
  btnTxt: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
