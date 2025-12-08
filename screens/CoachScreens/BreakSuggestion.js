// CoachScreens/BreakSuggestion.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BreakSuggestion({ theme, sessionMinutes }) {
  return (
    <View style={[styles.breakCard, { backgroundColor: theme.card }]}>
      <Ionicons name="time-outline" size={28} color={theme.primary} />

      <Text style={[styles.breakText, { color: theme.text }]}>
        مضى {sessionMinutes} دقيقة من الجلوس المتواصل – يُفضل أخذ استراحة قصيرة.
      </Text>

      <View style={styles.timeBar}>
        <View
          style={[
            styles.timeFill,
            { width: `${Math.min(sessionMinutes * 2, 100)}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  breakCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
  },
  breakText: {
    marginTop: 6,
    fontSize: 15,
    color: "#1e293b",
    textAlign: "center",
  },
  timeBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E7EEFF",
    borderRadius: 4,
    marginTop: 8,
  },
  timeFill: {
    height: "100%",
    backgroundColor: "#2B4C7E",
    borderRadius: 4,
  },
});
