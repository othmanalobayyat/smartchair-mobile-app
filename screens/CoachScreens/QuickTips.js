// CoachScreens/QuickTips.js
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function QuickTips({ theme, suggestions }) {
  return (
    <View>
      {/* العنوان */}
      <Text style={styles.sectionHeader}>نصائح سريعة</Text>
      <Text style={styles.sectionSub}>اسحب لليمين لرؤية المزيد</Text>

      {/* الكروت */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {suggestions.map((s, i) => (
          <View
            key={i}
            style={[styles.tipCard, { backgroundColor: theme.card }]}
          >
            <Ionicons name={s.icon} size={26} color={theme.primary} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              {s.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  tipCard: {
    width: 150,
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    alignItems: "center",
    elevation: 3,
  },
  tipText: {
    textAlign: "center",
    marginTop: 6,
    color: "#1e2a3b",
    fontSize: 14,
  },
});
