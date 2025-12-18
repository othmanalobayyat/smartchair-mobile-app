// screens/SettingsScreens/EditProfile.js
import React, { useState, useEffect } from "react";
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

export default function EditProfile({ navigation }) {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");

  // 🔥 مزامنة الـ state مع AuthContext.user
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const isUnchanged =
    name.trim() === user?.name && email.trim() === user?.email;

  const handleSave = async () => {
    setMsg("");
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setMsgType("error");
      setMsg(i18n.t("profileAllFieldsRequired"));
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMsgType("error");
      setMsg(i18n.t("profileInvalidEmail"));
      setLoading(false);
      return;
    }

    try {
      await updateProfile(name.trim(), email.trim());
      setMsgType("success");
      setMsg(i18n.t("profileUpdateSuccess"));

      // ⬇️ رجوع تلقائي بعد نجاح التحديث (اختياري لكنه UX أفضل)
      setTimeout(() => {
        navigation.goBack();
      }, 800);
    } catch (e) {
      setMsgType("error");
      setMsg(e.message || i18n.t("profileUpdateError"));
    }

    setLoading(false);
  };

  const inputBorder = theme.border;
  const iconColor = theme.icon;

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <AppHeader
        title={i18n.t("editProfileTitle")}
        onBack={() => navigation.goBack()}
      />

      <View style={s.body}>
        {/* NAME */}
        <View style={[s.inputWrap, { borderColor: inputBorder }]}>
          <Ionicons name="person-outline" size={20} color={iconColor} />
          <TextInput
            style={[s.input, { color: theme.text }]}
            placeholder={i18n.t("profileName")}
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        {/* EMAIL */}
        <View style={[s.inputWrap, { borderColor: inputBorder }]}>
          <Ionicons name="mail-outline" size={20} color={iconColor} />
          <TextInput
            style={[s.input, { color: theme.text }]}
            placeholder={i18n.t("profileEmail")}
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {msg ? (
          <Text
            style={[
              s.msg,
              {
                color: msgType === "success" ? theme.success : theme.error,
              },
            ]}
          >
            {msg}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            s.btn,
            {
              backgroundColor:
                loading || isUnchanged ? theme.disabled : theme.primary,
            },
          ]}
          onPress={handleSave}
          disabled={loading || isUnchanged}
        >
          <Text style={[s.btnTxt, { color: theme.iconOnPrimary }]}>
            {loading ? i18n.t("profileSaving") : i18n.t("profileSave")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },

  body: { padding: 16 },

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
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  btnTxt: {
    fontWeight: "700",
  },

  msg: {
    marginVertical: 8,
    textAlign: "center",
    fontWeight: "600",
  },
});
