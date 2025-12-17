// screens/SmartChairScreens/Controls.js
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import i18n from "../../hooks/i18n";

export default function Controls({ monitoring, setMonitoring, theme }) {
  return (
    <View style={s.controls}>
      <Pressable
        onPress={() => setMonitoring(!monitoring)}
        style={[
          s.btn,
          { backgroundColor: monitoring ? theme.primary : theme.muted },
        ]}
      >
        <Text style={[s.btnTxt, { color: theme.iconOnPrimary }]}>
          {monitoring ? i18n.t("stopMonitoring") : i18n.t("startMonitoring")}
        </Text>
      </Pressable>

      <Pressable style={[s.btn, { backgroundColor: theme.secondary }]}>
        <Text style={[s.btnTxt, { color: theme.iconOnPrimary }]}>
          {i18n.t("calibrate")}
        </Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  controls: { flexDirection: "row", gap: 10, marginVertical: 25 },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },

  btnTxt: {
    fontWeight: "700",
  },
});
