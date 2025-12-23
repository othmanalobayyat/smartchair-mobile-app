// screens/StatisticsScreens/MotivationFooter.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MotivationFooter({ text, theme }) {
  return (
    <View style={[s.footerBox, { backgroundColor: theme.surfaceAlt }]}>
      <Text style={[s.footerTxt, { color: theme.secondary }]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  footerBox: {
    width: "90%",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    alignSelf: "center",
  },
  footerTxt: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
});
