// screens/StatisticsScreens/Historical screen
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { useAuth } from "../../hooks/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { LineChart } from "react-native-chart-kit";
import AppHeader from "../../components/AppHeader";
import i18n from "../../hooks/i18n";

export default function Historical({ navigation }) {
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
        const res = await fetch("http://10.76.189.74:3000/api/stats/history", {
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
          <View
            style={[
              s.avgBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[s.avgLabel, { color: theme.text }]}>
              {i18n.t("averagePerformance")}
            </Text>
            <Text style={[s.avgValue, { color: colorByScore(avg) }]}>
              {avg}%
            </Text>
          </View>

          {/* LINE CHART */}
          {history.length > 0 && (
            <View style={s.chartBox}>
              <LineChart
                data={{
                  labels: history.map((h) => h.date.slice(5)),
                  datasets: [{ data: history.map((h) => h.score) }],
                }}
                width={Dimensions.get("window").width * 0.9}
                height={180}
                yAxisSuffix="%"
                chartConfig={{
                  backgroundGradientFrom: isDark ? "#1C2433" : "#DDE9FA",
                  backgroundGradientTo: isDark ? "#1C2433" : "#FFFFFF",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(76,137,200,${opacity})`,
                  labelColor: () => (isDark ? "#B9D4F5" : "#2B4C7E"),
                  propsForDots: { r: "5", strokeWidth: "2", stroke: "#4C89C8" },
                }}
                bezier
                style={{ borderRadius: 12 }}
              />
            </View>
          )}

          {/* TITLE */}
          <Text style={[s.title, { color: theme.text }]}>
            {i18n.t("prevDaysResults")}
          </Text>

          {/* CARDS */}
          {history.map((d, i) => (
            <Animated.View
              key={d.date}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <View
                style={[
                  s.card,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={s.row}>
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={20}
                    color={theme.iconSecondary}
                  />
                  <Text style={[s.dateText, { color: theme.text }]}>
                    {d.date}
                  </Text>
                </View>

                <View style={[s.barBg, { backgroundColor: theme.border }]}>
                  <View
                    style={[
                      s.barFill,
                      {
                        width: `${d.score}%`,
                        backgroundColor: colorByScore(d.score),
                      },
                    ]}
                  />
                </View>

                <Text style={[s.score, { color: colorByScore(d.score) }]}>
                  {d.score}/100
                </Text>
              </View>
            </Animated.View>
          ))}

          {/* FOOTER */}
          <View style={[s.footerBox, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[s.footerTxt, { color: theme.secondary }]}>
              {motivation}
            </Text>
          </View>

          {/* SHARE BUTTON */}
          <TouchableOpacity onPress={handleShare} style={s.shareBtn}>
            <Ionicons name="share-social" size={20} color="#FFF" />
            <Text style={s.shareTxt}>{i18n.t("shareResults")}</Text>
          </TouchableOpacity>
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
