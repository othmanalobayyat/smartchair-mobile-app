// screens/SmartChairScreens/SensorsCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import i18n from "../../hooks/i18n";

export default function SensorsCard({ pressures, theme, isDark }) {
  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: theme.card,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? theme.border : "transparent",
          shadowColor: theme.shadow,
          elevation: 4,
        },
      ]}
    >
      <Text style={[s.title, { color: theme.text }]}>
        {i18n.t("sensorsReadings")}
      </Text>

      <View style={s.readingsGrid}>
        {pressures.map((p, i) => (
          <View key={i} style={s.readCell}>
            <Text style={[s.readVal, { color: theme.text }]}>
              L{i + 1}: {p.toFixed(1)}kg
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 22,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  readingsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  readCell: { width: "45%", marginVertical: 6, alignItems: "center" },
  readVal: { fontSize: 14, fontWeight: "600" },
});
