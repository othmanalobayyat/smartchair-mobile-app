// screens/StatisticsScreens/AveragePerformanceCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import i18n from "../../hooks/i18n";

export default function AveragePerformanceCard({ avg, theme, colorByScore }) {
  return (
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
      <Text style={[s.avgValue, { color: colorByScore(avg) }]}>{avg}%</Text>
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
});
