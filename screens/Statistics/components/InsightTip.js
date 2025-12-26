// screens/StatisticsScreens/InsightTip.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InsightTip({ text, theme }) {
  return (
    <View
      style={[
        s.tipBox,
        {
          backgroundColor: theme.surfaceAlt,
          borderColor: theme.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="lightbulb-on-outline"
        size={20}
        color={theme.secondary}
        style={{ marginRight: 6 }}
      />
      <Text style={[s.tipText, { color: theme.secondary }]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  tipBox: {
    width: "92%",
    borderRadius: 15,
    padding: 14,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  tipText: {
    fontWeight: "500",
    textAlign: "center",
    fontSize: 15,
  },
});
