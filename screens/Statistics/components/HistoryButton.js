// screens/StatisticsScreens/HistoryButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../../../hooks/i18n";

export default function HistoryButton({ onPress, theme }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        s.btn,
        {
          backgroundColor: theme.secondary,
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
  );
}

const s = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 22,
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
