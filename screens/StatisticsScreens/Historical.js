//Historical screen
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
  Platform,
} from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { LineChart } from "react-native-chart-kit";
import Constants from "expo-constants";

export default function Historical({ navigation }) {
  const { theme, isDark } = useTheme();
  const viewRef = useRef();

  const [history] = useState([
    { date: "2025-11-05", score: 84 },
    { date: "2025-11-04", score: 77 },
    { date: "2025-11-03", score: 91 },
    { date: "2025-11-02", score: 65 },
    { date: "2025-11-01", score: 88 },
  ]);

  const colorByScore = (x) =>
    x >= 80 ? "#27AE60" : x >= 60 ? "#4C89C8" : "#E74C3C";

  const avg = Math.round(history.reduce((a, b) => a + b.score, 0) / history.length);
  const motivation =
    avg >= 85
      ? "🌟 أداء ممتاز! استمر بنفس الوتيرة."
      : avg >= 70
      ? "💪 أداء جيد جدًا، يمكنك الوصول للأفضل قريبًا."
      : "🚀 لا تقلق، التحسّن يأتي بالمداومة!";

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleShare = async () => {
    const uri = await viewRef.current.capture();
    await Sharing.shareAsync(uri);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark || theme.mode === "dark" ? "#0F172A" : theme.background,
      }}
    >
      {/* ✅ شريط علوي مضبوط تمامًا */}
      <StatusBar barStyle="light-content" backgroundColor="#2B4C7E" />
      <View
        style={{
          backgroundColor: "#2B4C7E",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0, // إضافة حقيقية لفراغ النوتش
          height: 56 + (Platform.OS === "ios" ? Constants.statusBarHeight : 0),
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "700" }}>
          عرض التاريخ السابق
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={true}
      >
        <ViewShot
          ref={viewRef}
          options={{ format: "jpg", quality: 0.95 }}
          style={{
            width: "100%",
            backgroundColor: isDark ? "#0F172A" : theme.background,
          }}
        >
          {/* المتوسط */}
          <View
            style={[
              s.avgBox,
              {
                backgroundColor: isDark ? "#1C2433" : "#FFF",
                borderColor: isDark ? "#2E3A50" : "#E0E5EE",
              },
            ]}
          >
            <Text style={[s.avgLabel, { color: isDark ? "#AFCBFF" : "#2B4C7E" }]}>
              متوسط الأداء
            </Text>
            <Text style={[s.avgValue, { color: colorByScore(avg) }]}>{avg}%</Text>
          </View>

          {/* الرسم البياني */}
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

          {/* البطاقات */}
          <Text style={[s.title, { color: isDark ? "#D6E4FF" : "#2B4C7E" }]}>
            نتائج الأيام السابقة
          </Text>

          {history.map((d, i) => (
            <Animated.View
              key={i}
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
                    backgroundColor: isDark ? "#1C2433" : "#FFF",
                    borderColor: isDark ? "#2E3A50" : "#E0E5EE",
                  },
                ]}
              >
                <View style={s.row}>
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={20}
                    color={isDark ? "#AFCBFF" : "#2B4C7E"}
                  />
                  <Text style={[s.dateText, { color: isDark ? "#F5F7FA" : "#333" }]}>
                    {d.date}
                  </Text>
                </View>

                <View
                  style={[s.barBg, { backgroundColor: isDark ? "#303A52" : "#E0E5EE" }]}
                >
                  <View
                    style={[
                      s.barFill,
                      { width: `${d.score}%`, backgroundColor: colorByScore(d.score) },
                    ]}
                  />
                </View>

                <Text style={[s.score, { color: colorByScore(d.score) }]}>
                  {d.score}/100
                </Text>
              </View>
            </Animated.View>
          ))}

          {/* الملاحظة + مشاركة */}
          <View style={[s.footerBox, { backgroundColor: isDark ? "#1E3A5F" : "#EAF2FA" }]}>
            <Text style={[s.footerTxt, { color: isDark ? "#B9D4F5" : "#2B4C7E" }]}>
              {motivation}
            </Text>
          </View>

          <TouchableOpacity onPress={handleShare} style={s.shareBtn}>
            <Ionicons name="share-social" size={20} color="#FFF" />
            <Text style={s.shareTxt}>مشاركة النتائج</Text>
          </TouchableOpacity>
        </ViewShot>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
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
  title: { fontSize: 20, fontWeight: "800", marginVertical: 16, textAlign: "center" },
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
