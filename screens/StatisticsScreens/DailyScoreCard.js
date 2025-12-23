// screens/StatisticsScreens/DailyScoreCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import i18n from "../../hooks/i18n";

export default function DailyScoreCard({
  dailyScore,
  theme,
  isDark,
  colorByScore,
}) {
  return (
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
      <Text style={[s.scoreTitle, { color: isDark ? "#AFCBFF" : "#2B4C7E" }]}>
        {i18n.t("dailyScore")}
      </Text>

      <View
        style={[s.barBg, { backgroundColor: isDark ? "#303A52" : "#E0E5EE" }]}
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

      <Text style={[s.scoreText, { color: theme.text }]}>{dailyScore}/100</Text>
    </View>
  );
}

const s = StyleSheet.create({
  scoreCard: {
    width: "92%",
    borderRadius: 15,
    padding: 18,
    marginTop: 10,
  },
  scoreTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  barBg: {
    width: "100%",
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
  scoreText: {
    textAlign: "right",
    marginTop: 8,
    fontWeight: "700",
    fontSize: 15,
  },
});
