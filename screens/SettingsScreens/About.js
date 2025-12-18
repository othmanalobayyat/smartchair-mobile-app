// screens/SettingsScreens/About.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/ThemeContext";
import i18n from "../../hooks/i18n";
import AppHeader from "../../components/AppHeader";

export default function About({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* HEADER*/}
      <AppHeader
        title={i18n.t("aboutTitle")}
        onBack={() => navigation.goBack()}
      />

      {/* CONTENT */}
      <View style={s.content}>
        <Image source={require("../../assets/pau.png")} style={s.logo} />

        <Text style={[s.projectTitle, { color: theme.text }]}>
          {i18n.t("aboutProjectName")}
        </Text>
        <View
          style={{
            width: 40,
            height: 3,
            backgroundColor: theme.primary,
            borderRadius: 2,
            marginVertical: 12,
          }}
        />

        <Text style={[s.description, { color: theme.textSecondary }]}>
          {i18n.t("aboutDescription")}
        </Text>

        {/* Developers */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>
            {i18n.t("aboutDevelopers")}
          </Text>

          <Text style={[s.devName, { color: theme.text }]}>
            {i18n.t("aboutDevOthman")}
          </Text>
          <Text style={[s.devEmail, { color: theme.textSecondary }]}>
            alobayyat.othman@gmail.com
          </Text>

          <Text style={[s.devName, { color: theme.text }]}>
            {i18n.t("aboutDevRahaf")}
          </Text>
          <Text style={[s.devEmail, { color: theme.textSecondary }]}>
            rahafadeelah99@gmail.com
          </Text>
        </View>

        {/* Supervisor */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>
            {i18n.t("aboutSupervisor")}
          </Text>

          <Text style={[s.devName, { color: theme.text }]}>
            {i18n.t("aboutSupervisorName")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginBottom: 16,
  },

  projectTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },

  section: {
    width: "100%",
    marginTop: 14,
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },

  devName: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  devEmail: {
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
});
