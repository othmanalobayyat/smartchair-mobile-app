// screens/StatisticsScreens/SessionCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import i18n from "../../hooks/i18n";

export default function SessionCard({
  session,
  theme,
  isDark,
  formatDuration,
  colorByScore,
}) {
  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: theme.card,
          shadowOpacity: isDark ? 0 : 0.08,
          borderColor: theme.border,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={[s.cardTitle, { color: theme.text }]}>
        {i18n.t("session")} {session.id}
      </Text>

      <View
        style={[
          s.table,
          {
            backgroundColor: theme.surfaceAlt,
            borderColor: theme.border,
          },
        ]}
      >
        {/* المدة */}
        <View style={s.row}>
          <View style={s.iconText}>
            <Ionicons
              name="time-outline"
              size={18}
              color={theme.iconSecondary}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("duration")}
            </Text>
          </View>
          <Text style={[s.value, { color: theme.text }]}>
            {formatDuration(session.duration)}
          </Text>
        </View>

        <View style={[s.sep, { backgroundColor: theme.border }]} />

        {/* النسبة الصحيحة */}
        <View style={s.row}>
          <View style={s.iconText}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color={colorByScore(session.correct)}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("correctPercent")}
            </Text>
          </View>
          <Text style={[s.value, { color: colorByScore(session.correct) }]}>
            {session.correct}%
          </Text>
        </View>

        <View
          style={[s.sep, { backgroundColor: isDark ? "#303A52" : "#E0E5EE" }]}
        />

        {/* عدد التنبيهات */}
        <View style={s.row}>
          <View style={s.iconText}>
            <MaterialIcons
              name="warning-amber"
              size={20}
              color={theme.warning}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("alertsCount")}
            </Text>
          </View>
          <Text style={[s.value, { color: "#E67E22" }]}>{session.alerts}</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
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
});
