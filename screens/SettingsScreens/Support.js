// screens/SettingsScreens/Support.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons"; // ← مكتبة أيقونات جديدة
import { useTheme } from "../../hooks/ThemeContext";
import AppHeader from "../../components/AppHeader";
import i18n from "../../hooks/i18n";

export default function Support({ navigation }) {
  const { theme } = useTheme();

  const sendEmail = () => {
    Linking.openURL("mailto:alobayyat.othman@gmail.com");
  };

  const sendReport = () => {
    Linking.openURL(
      "mailto:alobayyat.othman@gmail.com?subject=Bug Report&body=Describe the issue:"
    );
  };

  const openFAQ = () => alert(i18n.t("supportFaqSoon"));
  const openWebsite = () => alert(i18n.t("supportWebsiteSoon"));

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <AppHeader
        title={i18n.t("supportTitle")}
        onBack={() => navigation.goBack()}
      />

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={require("../../assets/support.png")} style={s.image} />

        <Text style={[s.title, { color: theme.text }]}>
          {i18n.t("supportHelpTitle")}
        </Text>

        <Text style={[s.desc, { color: theme.textSecondary }]}>
          {i18n.t("supportDescription")}
        </Text>

        {/* EMAIL */}
        <TouchableOpacity
          style={[
            s.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              shadowColor: theme.shadow,
            },
          ]}
          onPress={sendEmail}
        >
          <Feather name="mail" size={24} color={theme.primary} />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>
              {i18n.t("supportContact")}
            </Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              {i18n.t("supportContactSub")}
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* REPORT */}
        <TouchableOpacity
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={sendReport}
        >
          <Feather name="alert-circle" size={24} color={theme.error} />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>
              {i18n.t("supportReport")}
            </Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              {i18n.t("supportReportSub")}
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* FAQ */}
        <TouchableOpacity
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={openFAQ}
        >
          <Feather name="help-circle" size={24} color={theme.primary} />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>
              {i18n.t("supportFAQ")}
            </Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              {i18n.t("supportFAQSub")}
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* WEBSITE */}
        <TouchableOpacity
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={openWebsite}
        >
          <Feather name="globe" size={24} color={theme.primary} />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>
              {i18n.t("supportWebsite")}
            </Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              {i18n.t("supportWebsiteSub")}
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    alignItems: "center",
  },

  image: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 16,
    opacity: 0.9,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },

  desc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  card: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1.3,
  },

  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardSub: { fontSize: 12, marginTop: 2 },
});
