// screens/Statistics.js
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  I18nManager,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/ThemeContext";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import i18n from "../hooks/i18n";

export default function Statistics() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();

  // ⭐ حل بسيط لإعادة تحديث الصفحة عند تغيير اللغة
  const [, forceRerender] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      // عندما تتغير i18n.locale → سيؤثر على render
      forceRerender((v) => !v);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const [sessions] = useState([
    { id: 1, duration: 45, correct: 82, alerts: 3 },
    { id: 2, duration: 30, correct: 90, alerts: 1 },
    { id: 3, duration: 55, correct: 76, alerts: 4 },
  ]);

  const dailyScore = 84;

  const tip = i18n.locale.startsWith("ar")
    ? "ميلك للأمام زاد اليوم 20% عن أمس."
    : "Your forward leaning increased by 20% today.";

  const colorByScore = (x) =>
    x >= 80 ? "#27AE60" : x >= 60 ? "#4C89C8" : "#E74C3C";

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor:
            isDark || theme.mode === "dark" ? "#0F172A" : theme.background,
        },
      ]}
    >
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <SafeAreaView style={s.headerContainer} edges={["top"]}>
        <Text style={s.headerTitle}>{i18n.t("statsTitle")}</Text>
      </SafeAreaView>

      {/* PAGE TITLE */}
      <Text style={[s.title, { color: isDark ? "#D6E4FF" : "#2B4C7E" }]}>
        {i18n.t("dailySummary")}
      </Text>

      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      >
        {sessions.map((sess) => (
          <View
            key={sess.id}
            style={[
              s.card,
              {
                backgroundColor: isDark ? "#1C2433" : "#FFF",
                shadowOpacity: isDark ? 0 : 0.08,
                borderColor: isDark ? "#2E3A50" : "#E0E5EE",
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[s.cardTitle, { color: isDark ? "#AFCBFF" : "#2B4C7E" }]}
            >
              {i18n.t("session")} {sess.id}
            </Text>

            <View
              style={[
                s.table,
                {
                  backgroundColor: isDark ? "#242E42" : "#FAFBFD",
                  borderColor: isDark ? "#303A52" : "#E0E5EE",
                },
              ]}
            >
              {/* المدة */}
              <View style={s.row}>
                <View style={s.iconText}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={isDark ? "#E8ECF3" : "#333"}
                  />
                  <Text
                    style={[s.label, { color: isDark ? "#E8ECF3" : "#333" }]}
                  >
                    {i18n.t("duration")}
                  </Text>
                </View>
                <Text style={[s.value, { color: isDark ? "#E8ECF3" : "#333" }]}>
                  {sess.duration} {i18n.t("minutesUnit")}
                </Text>
              </View>

              <View
                style={[
                  s.sep,
                  { backgroundColor: isDark ? "#303A52" : "#E0E5EE" },
                ]}
              />

              {/* النسبة الصحيحة */}
              <View style={s.row}>
                <View style={s.iconText}>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={20}
                    color={colorByScore(sess.correct)}
                  />
                  <Text
                    style={[s.label, { color: isDark ? "#E8ECF3" : "#333" }]}
                  >
                    {i18n.t("correctPercent")}
                  </Text>
                </View>
                <Text style={[s.value, { color: colorByScore(sess.correct) }]}>
                  {sess.correct}%
                </Text>
              </View>

              <View
                style={[
                  s.sep,
                  { backgroundColor: isDark ? "#303A52" : "#E0E5EE" },
                ]}
              />

              {/* عدد التنبيهات */}
              <View style={s.row}>
                <View style={s.iconText}>
                  <MaterialIcons
                    name="warning-amber"
                    size={20}
                    color="#E67E22"
                  />
                  <Text
                    style={[s.label, { color: isDark ? "#E8ECF3" : "#333" }]}
                  >
                    {i18n.t("alertsCount")}
                  </Text>
                </View>
                <Text style={[s.value, { color: "#E67E22" }]}>
                  {sess.alerts}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* التقييم اليومي */}
        <View
          style={[
            s.scoreCard,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[s.scoreTitle, { color: isDark ? "#AFCBFF" : "#2B4C7E" }]}
          >
            {i18n.t("dailyScore")}
          </Text>

          <View
            style={[
              s.barBg,
              { backgroundColor: isDark ? "#303A52" : "#E0E5EE" },
            ]}
          >
            <View
              style={[
                s.barFill,
                {
                  width: `${dailyScore}%`,
                  backgroundColor: colorByScore(dailyScore),
                },
              ]}
            />
          </View>

          <Text style={[s.scoreText, { color: isDark ? "#E8ECF3" : "#333" }]}>
            {dailyScore}/100
          </Text>
        </View>

        {/* نص الملاحظة */}
        <View
          style={[
            s.tipBox,
            {
              backgroundColor: isDark ? "#1E3A5F" : "#EAF2FA",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={20}
            color={isDark ? "#B9D4F5" : "#4C89C8"}
            style={{ marginRight: 6 }}
          />
          <Text style={[s.tipText, { color: isDark ? "#B9D4F5" : "#4C89C8" }]}>
            {tip}
          </Text>
        </View>

        {/* زر التاريخ */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Historical")}
          style={[
            s.btn,
            {
              backgroundColor: "#4C89C8",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={20}
            color="#FFF"
            style={{ marginRight: 6 }}
          />
          <Text style={s.btnTxt}>{i18n.t("historyBtn")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ====================== STYLES (كما هي بدون أي تعديل) ======================
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
