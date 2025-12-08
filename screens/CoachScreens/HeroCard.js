// CoachScreens/HeroCard.js
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeroCard({
  posture,
  sessionMinutes,
  heroColor,
  postureIcon,
  heroAnim,
}) {
  return (
    <Animated.View
      style={[
        styles.heroCard,
        {
          backgroundColor: heroColor,
          opacity: heroAnim,
          transform: [{ scale: heroAnim }],
        },
      ]}
    >
      <View style={styles.heroAvatar}>
        <Ionicons name="person-outline" size={32} color={heroColor} />
      </View>

      <Text style={styles.heroTitle}>وضعيتك الآن: {posture}</Text>
      <Text style={styles.heroSmall}>مدة الجلسة: {sessionMinutes} دقيقة</Text>

      <Text style={styles.heroSmall}>
        حالة الجلسة:{" "}
        {posture === "صحيحة"
          ? "مثالية"
          : posture === "منحنية"
          ? "يلزم تصحيح"
          : posture === "تعب"
          ? "تحتاج تمارين"
          : "تحتاج استراحة"}
      </Text>

      <Ionicons
        name={postureIcon[posture]}
        size={28}
        color="white"
        style={{ marginTop: 10 }}
      />

      {/* شريط تقدم الجلسة */}
      <View style={styles.sessionBar}>
        <View
          style={[
            styles.sessionFill,
            { width: `${Math.min((sessionMinutes / 60) * 100, 100)}%` },
          ]}
        />
      </View>

      <Text style={styles.sessionHint}>
        كلما زاد وقت الجلوس، خذ فترات استراحة قصيرة.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    marginBottom: 22,
  },
  heroAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { color: "white", fontSize: 20, fontWeight: "700", marginTop: 6 },
  heroSmall: { color: "white", fontSize: 15, marginTop: 4 },

  sessionBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 6,
    marginTop: 12,
  },
  sessionFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
  sessionHint: {
    marginTop: 6,
    fontSize: 12,
    color: "white",
    opacity: 0.9,
  },
});
