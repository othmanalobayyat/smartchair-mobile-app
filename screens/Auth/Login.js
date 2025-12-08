// screens/Auth/Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/ThemeContext";
import { useAuth } from "../../hooks/AuthContext";
import i18n from "../../hooks/i18n";

export default function Login({ navigation }) {
  const { theme, isDark } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg(i18n.t("loginErrorEmpty"));
      return;
    }
    setErrorMsg("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setErrorMsg(e.message || i18n.t("loginErrorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={theme.gradient} style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header / Logo */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Ionicons name="fitness-outline" size={34} color="#FFF" />
              </View>

              <Text style={[styles.appName, { color: theme.text }]}>
                Smart Chair
              </Text>

              <Text style={[styles.appSubtitle, { color: theme.muted }]}>
                {i18n.t("loginSubtitle")}
              </Text>
            </View>

            {/* Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark
                    ? "rgba(15,23,42,0.9)"
                    : "rgba(255,255,255,0.96)",
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {i18n.t("loginTitle")}
              </Text>

              {/* Email */}
              <Text style={[styles.label, { color: theme.muted }]}>
                {i18n.t("loginEmail")}
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: isDark ? "#020617" : "#F3F4F6",
                    borderColor: isDark ? "#1E293B" : "#E5E7EB",
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={theme.muted}
                  style={{ marginHorizontal: 8 }}
                />

                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={i18n.t("loginPlaceholderEmail")}
                  placeholderTextColor={theme.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password */}
              <Text style={[styles.label, { color: theme.muted }]}>
                {i18n.t("loginPassword")}
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: isDark ? "#020617" : "#F3F4F6",
                    borderColor: isDark ? "#1E293B" : "#E5E7EB",
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={theme.muted}
                  style={{ marginHorizontal: 8 }}
                />

                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={i18n.t("loginPlaceholderPassword")}
                  placeholderTextColor={theme.muted}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.mainBtn,
                  {
                    backgroundColor: submitting ? "#64748B" : theme.primary,
                  },
                ]}
                onPress={handleLogin}
                disabled={submitting}
              >
                <Ionicons name="log-in-outline" size={20} color="#FFF" />
                <Text style={styles.mainBtnTxt}>
                  {submitting
                    ? i18n.t("loginButtonLoading")
                    : i18n.t("loginButton")}
                </Text>
              </TouchableOpacity>

              {/* Link to Register */}
              <View style={styles.bottomRow}>
                <Text style={{ color: theme.muted, fontSize: 13 }}>
                  {i18n.t("loginNoAccount")}
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={[styles.linkText, { color: theme.secondary }]}>
                    {i18n.t("loginCreateAccount")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <Text style={[styles.footer, { color: theme.muted }]}>
              {i18n.t("loginFooter")}
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 30,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 26,
    marginTop: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#2B4C7E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 4,
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
  },
  appSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  card: {
    width: "100%",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 18,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 14,
  },
  errorText: {
    marginTop: 6,
    color: "#E74C3C",
    fontSize: 13,
    textAlign: "center",
  },
  mainBtn: {
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  mainBtnTxt: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  bottomRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontWeight: "700",
    fontSize: 13,
  },
  footer: {
    marginTop: 18,
    fontSize: 11,
    textAlign: "center",
  },
});
