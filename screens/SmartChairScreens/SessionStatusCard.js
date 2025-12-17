// screens/SmartChairScreens/SessionStatusCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../../hooks/i18n";

export default function SessionStatusCard({
  posture,
  attentionText,
  timeLabel,
  isPresent,
  drowsy,
  theme,
  isDark,
}) {
  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: theme.card,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? theme.border : "transparent",
          shadowColor: theme.shadow,
        },
      ]}
    >
      <Text style={[s.cardTitle, { color: theme.text }]}>
        {i18n.t("sessionStatus")}
      </Text>

      {/* وضعية الجلسة */}
      <View
        style={[
          s.infoRow,
          { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            s.iconBubble,
            {
              backgroundColor:
                posture === "صحيحة" ? theme.success : theme.error,
            },
          ]}
        >
          <MaterialCommunityIcons name="seat" size={18} color="#fff" />
        </View>

        <View style={s.infoTextGroup}>
          <Text
            style={[
              s.infoLabel,
              { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
            ]}
          >
            {i18n.t("postureLabel")}
          </Text>

          <Text
            style={[
              s.infoValue,
              {
                color: posture === "صحيحة" ? theme.success : theme.error,
                textAlign: i18n.isRTL ? "right" : "left",
              },
            ]}
          >
            {posture === "صحيحة"
              ? i18n.t("postureCorrect")
              : i18n.t("postureIncorrect")}
          </Text>
        </View>
      </View>

      {/* مستوى الانتباه */}
      <View
        style={[
          s.infoRow,
          { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            s.iconBubble,
            {
              backgroundColor:
                attentionText === "مركز" ? theme.success : theme.error,
            },
          ]}
        >
          <Ionicons
            name={attentionText === "مركز" ? "eye" : "eye-off"}
            size={18}
            color={theme.iconOnPrimary}
          />
        </View>

        <View style={s.infoTextGroup}>
          <Text
            style={[
              s.infoLabel,
              { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
            ]}
          >
            {i18n.t("attentionLevel")}
          </Text>

          <Text
            style={[
              s.infoValue,
              {
                color: attentionText === "مركز" ? theme.success : theme.error,
                textAlign: i18n.isRTL ? "right" : "left",
              },
            ]}
          >
            {attentionText === "مركز"
              ? i18n.t("attentionFocused")
              : i18n.t("attentionDistracted")}
          </Text>
        </View>
      </View>

      {/* مدة العمل */}
      <View
        style={[
          s.infoRow,
          { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View style={[s.iconBubble, { backgroundColor: theme.primary }]}>
          <Ionicons name="time" size={18} color="#fff" />
        </View>

        <View style={s.infoTextGroup}>
          <Text
            style={[
              s.infoLabel,
              { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
            ]}
          >
            {i18n.t("workDuration")}
          </Text>

          <Text
            style={[
              s.infoValue,
              { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
            ]}
          >
            {timeLabel}
          </Text>
        </View>
      </View>

      {/* وجود الشخص */}
      <View
        style={[
          s.infoRow,
          { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            s.iconBubble,
            { backgroundColor: isPresent ? theme.success : theme.error },
          ]}
        >
          <Ionicons name="person" size={18} color="#fff" />
        </View>

        <View style={s.infoTextGroup}>
          <Text
            style={[
              s.infoLabel,
              { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
            ]}
          >
            {i18n.t("personStatus")}
          </Text>

          <Text
            style={[
              s.infoValue,
              {
                color: isPresent ? theme.success : theme.error,
                textAlign: i18n.isRTL ? "right" : "left",
              },
            ]}
          >
            {isPresent ? i18n.t("present") : i18n.t("notPresent")}
          </Text>
        </View>
      </View>

      {/* تنبيه النعاس */}
      {drowsy && (
        <View
          style={[
            s.alertRow,
            {
              borderColor: theme.border,
              flexDirection: i18n.isRTL ? "row-reverse" : "row",
            },
          ]}
        >
          <Ionicons name="warning" size={18} color={theme.error} />
          <Text
            style={[
              s.alertText,
              {
                color: theme.error,
                textAlign: i18n.isRTL ? "right" : "left",
                marginHorizontal: 8,
              },
            ]}
          >
            {i18n.t("drowsyAlert")}
          </Text>
        </View>
      )}
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
    elevation: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  infoRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 14,
  },

  infoTextGroup: {
    flex: 1,
    justifyContent: "center",
  },

  infoLabel: {
    fontSize: 15,
    opacity: 0.6,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 19,
    fontWeight: "800",
  },

  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 14,
  },

  alertRow: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    alignItems: "center",
  },

  alertText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
