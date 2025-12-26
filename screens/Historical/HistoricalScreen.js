// screens/StatisticsScreens/Historical screen
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
} from "react-native";
import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "../../hooks/ThemeContext";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import AppHeader from "../../components/AppHeader";
import i18n from "../../hooks/i18n";
import AveragePerformanceCard from "./components/AveragePerformanceCard";
import PerformanceChart from "./components/PerformanceChart";
import HistoryDayCard from "./components/HistoryDayCard";
import MotivationFooter from "./components/MotivationFooter";
import ShareResultsButton from "./components/ShareResultsButton";
import { API_BASE } from "../../config/api";

export default function HistoricalScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const viewRef = useRef();

  // SAMPLE HISTORY (replace with real data)
  const [history, setHistory] = useState([]);

  const { token } = useAuth();

  const colorByScore = (x) =>
    x >= 80 ? theme.success : x >= 60 ? theme.secondary : theme.error;

  const avg =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
      : 0;

  const motivation =
    avg >= 85
      ? i18n.t("motivationHigh")
      : avg >= 70
      ? i18n.t("motivationMedium")
      : i18n.t("motivationLow");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stats/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setHistory(data);
      } catch (e) {
        console.log("❌ Failed to fetch history", e);
      }
    };

    if (!token) return;
    fetchHistory();
  }, [token]);

  const handleShare = async () => {
    const uri = await viewRef.current.capture();
    await Sharing.shareAsync(uri);
  };

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <AppHeader
        title={i18n.t("historyTitle")}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}
        showsVerticalScrollIndicator={true}
      >
        <ViewShot
          ref={viewRef}
          options={{ format: "jpg", quality: 0.95 }}
          style={{
            width: "100%",
            backgroundColor: theme.background,
          }}
        >
          {/* AVERAGE PERFORMANCE */}
          <AveragePerformanceCard
            avg={avg}
            theme={theme}
            colorByScore={colorByScore}
          />

          {/* LINE CHART */}
          <PerformanceChart history={history} theme={theme} isDark={isDark} />

          {/* TITLE */}
          <Text style={[s.title, { color: theme.text }]}>
            {i18n.t("prevDaysResults")}
          </Text>

          {/* CARDS */}
          {history.map((d) => (
            <HistoryDayCard
              key={d.date}
              day={d}
              theme={theme}
              fadeAnim={fadeAnim}
              colorByScore={colorByScore}
            />
          ))}

          {/* FOOTER */}
          <MotivationFooter text={motivation} theme={theme} />

          {/* SHARE BUTTON */}
          <ShareResultsButton onPress={handleShare} />
        </ViewShot>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: "#2B4C7E",
    width: "100%",
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  avgBox: {
    width: "90%",
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 18,
    alignSelf: "center",
  },
  avgLabel: { fontSize: 15, fontWeight: "600" },
  avgValue: { fontSize: 20, fontWeight: "800", marginTop: 4 },
  chartBox: { marginTop: 14, alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 16,
    textAlign: "center",
  },
  card: {
    width: "90%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
    minHeight: 130,
    justifyContent: "center",
    alignSelf: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  dateText: { fontSize: 16, fontWeight: "700" },
  barBg: { width: "100%", height: 10, borderRadius: 6, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 6 },
  score: { marginTop: 8, textAlign: "right", fontWeight: "700", fontSize: 15 },
  footerBox: {
    width: "90%",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    alignSelf: "center",
  },
  footerTxt: { textAlign: "center", fontWeight: "700", fontSize: 15 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4C89C8",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  shareTxt: { color: "#FFF", fontWeight: "700", fontSize: 16, marginLeft: 8 },
});
