// CoachScreens/Header.js
import React from "react";
import i18n from "../../../hooks/i18n";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header({ theme }) {
  return (
    <SafeAreaView
      style={[styles.headerContainer, { backgroundColor: theme.primary }]}
      edges={["top"]}
    >
      <Text style={styles.headerTitle}>{i18n.t("coachHeaderTitle")}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 10,
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "700" },
});
