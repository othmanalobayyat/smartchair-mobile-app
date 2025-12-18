// screens/SettingsScreens/ChangePassword.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "../../hooks/ThemeContext";
import i18n from "../../hooks/i18n";
import AppHeader from "../../components/AppHeader";

export default function ChangePassword({ navigation }) {
  const { changePassword } = useAuth();
  const { theme, isDark } = useTheme();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");

  const handleChange = async () => {
    setMsg("");
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMsgType("error");
      setMsg(i18n.t("cpAllFieldsRequired"));
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMsgType("error");
      setMsg(i18n.t("cpMinLength"));
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsgType("error");
      setMsg(i18n.t("cpNotMatch"));
      setLoading(false);
      return;
    }

    if (oldPassword === newPassword) {
      setMsgType("error");
      setMsg(i18n.t("cpSameAsOld"));
      setLoading(false);
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setMsgType("success");
      setMsg(i18n.t("cpSuccess"));
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setMsgType("error");
      setMsg(e.message || i18n.t("cpGenericError"));
    }

    setLoading(false);
  };

  const inputBorder = isDark ? "#334155" : "#ccc";
  const iconColor = isDark ? "#CBD5E1" : "#64748B";

  return (
    <View
      style={[
        s.container,
        { backgroundColor: isDark ? "#0F172A" : theme.background },
      ]}
    >
      {/* HEADER */}
      <AppHeader
        title={i18n.t("changePasswordTitle") ?? "تغيير كلمة المرور"}
        onBack={() => navigation.goBack()}
      />

      <View style={s.body}>
        {/* OLD PASSWORD */}
        <View style={[s.inputWrap, { borderColor: inputBorder }]}>
          <Ionicons name="lock-closed-outline" size={20} color={iconColor} />
          <TextInput
            style={[s.input, { color: theme.text }]}
            placeholder={i18n.t("currentPassword")}
            placeholderTextColor="#999"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            autoCapitalize="none"
          />
        </View>

        {/* NEW PASSWORD */}
        <View style={[s.inputWrap, { borderColor: inputBorder }]}>
          <Ionicons name="key-outline" size={20} color={iconColor} />
          <TextInput
            style={[s.input, { color: theme.text }]}
            placeholder={i18n.t("newPassword")}
            placeholderTextColor="#999"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
          />
        </View>

        {/* CONFIRM PASSWORD */}
        <View style={[s.inputWrap, { borderColor: inputBorder }]}>
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={iconColor}
          />
          <TextInput
            style={[s.input, { color: theme.text }]}
            placeholder={i18n.t("confirmNewPassword")}
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />
        </View>

        {msg ? (
          <Text
            style={[s.msg, { color: msgType === "success" ? "green" : "red" }]}
          >
            {msg}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.6 }]}
          onPress={handleChange}
          disabled={loading}
        >
          <Text style={s.btnTxt}>
            {loading
              ? i18n.t("changePasswordSaving")
              : i18n.t("changePasswordBtn")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: "#2B4C7E",
    width: "100%",
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  body: {
    padding: 16,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  btn: {
    backgroundColor: "#2B4C7E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  btnTxt: {
    color: "#fff",
    fontWeight: "700",
  },

  msg: {
    marginVertical: 8,
    textAlign: "center",
    fontWeight: "600",
  },
});
