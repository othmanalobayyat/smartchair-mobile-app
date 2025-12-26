// screens/SmartChairScreens/Header.js
import React from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../../../hooks/i18n";

export default function Header({ theme }) {
  return (
    <SafeAreaView
      style={[s.headerContainer, { backgroundColor: theme.primary }]}
      edges={["top"]}
    >
      <Text style={[s.headerTitle, { color: theme.iconOnPrimary }]}>
        <MaterialCommunityIcons
          name="chair-school"
          size={22}
          color={theme.iconOnPrimary}
        />{" "}
        {i18n.t("smartChairTitle")}
      </Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  headerContainer: {
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
});
