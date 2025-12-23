// screens/StatisticsScreens/PerformanceChart.js
import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function PerformanceChart({ history, theme, isDark }) {
  if (history.length === 0) return null;

  return (
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
  );
}

const s = StyleSheet.create({
  chartBox: {
    marginTop: 14,
    alignItems: "center",
  },
});
