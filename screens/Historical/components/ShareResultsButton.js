// screens/StatisticsScreens/ShareResultsButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../../hooks/i18n";

export default function ShareResultsButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.shareBtn}>
      <Ionicons name="share-social" size={20} color="#FFF" />
      <Text style={s.shareTxt}>{i18n.t("shareResults")}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
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
  shareTxt: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});
