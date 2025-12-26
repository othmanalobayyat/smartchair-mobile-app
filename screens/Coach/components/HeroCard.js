// CoachScreens/HeroCard.js
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../../hooks/i18n";

export default function HeroCard({
  posture,
  sessionMinutes,
  heroColor,
  postureIcon,
  heroAnim,
}) {
  const postureStateText =
    posture === "صحيحة"
      ? i18n.t("heroStatePerfect")
      : posture === "منحنية"
      ? i18n.t("heroStateFix")
      : posture === "تعب"
      ? i18n.t("heroStateExercise")
      : i18n.t("heroStateBreak");

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

      {/* وضعيتك الآن */}
      <Text style={styles.heroTitle}>
        {i18n.t("heroYourPosture")} {posture}
      </Text>

      {/* مدة الجلسة */}
      <Text style={styles.heroSmall}>
        {i18n.t("heroSessionDuration")} {sessionMinutes} {i18n.t("heroMinutes")}
      </Text>

      {/* حالة الجلسة */}
      <Text style={styles.heroSmall}>
        {i18n.t("heroSessionState")} {postureStateText}
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

      <Text style={styles.sessionHint}>{i18n.t("heroHint")}</Text>
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
