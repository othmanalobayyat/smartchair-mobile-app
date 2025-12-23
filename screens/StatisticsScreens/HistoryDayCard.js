// screens/StatisticsScreens/HistoryDayCard.js
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HistoryDayCard({ day, theme, fadeAnim, colorByScore }) {
  return (
    <Animated.View
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
          <Text style={[s.dateText, { color: theme.text }]}>{day.date}</Text>
        </View>

        <View style={[s.barBg, { backgroundColor: theme.border }]}>
          <View
            style={[
              s.barFill,
              {
                width: `${day.score}%`,
                backgroundColor: colorByScore(day.score),
              },
            ]}
          />
        </View>

        <Text style={[s.score, { color: colorByScore(day.score) }]}>
          {day.score}/100
        </Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dateText: { fontSize: 16, fontWeight: "700" },
  barBg: { width: "100%", height: 10, borderRadius: 6, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 6 },
  score: {
    marginTop: 8,
    textAlign: "right",
    fontWeight: "700",
    fontSize: 15,
  },
});
