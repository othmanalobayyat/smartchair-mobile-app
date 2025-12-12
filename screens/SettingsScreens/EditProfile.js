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

export default function EditProfile({ navigation }) {
  const { user, updateProfile } = useAuth();
  const { theme, isDark } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");

  const isUnchanged =
    name.trim() === user?.name && email.trim() === user?.email;

  const handleSave = async () => {
    setMsg("");
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setMsgType("error");
      setMsg("جميع الحقول مطلوبة");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMsgType("error");
      setMsg("صيغة البريد الإلكتروني غير صحيحة");
      setLoading(false);
      return;
    }

    try {
      await updateProfile(name.trim(), email.trim());
      setMsgType("success");
      setMsg("تم تحديث البيانات بنجاح");
    } catch (e) {
      setMsgType("error");
      setMsg(e.message || "حدث خطأ أثناء التحديث");
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
      <SafeAreaView style={s.header} edges={["top"]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>تعديل البيانات</Text>
      </SafeAreaView>

      <View style={s.body}>
        {/* NAME */}
        <View style={[s.inputWrap, { borderColor: inputBorder }]}>
          <Ionicons name="person-outline" size={20} color={iconColor} />
          <TextInput
            style={[s.input, { color: theme.text }]}
            placeholder="الاسم"
            placeholderTextColor="#999"
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
            placeholder="الإيميل"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
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
          style={[s.btn, (loading || isUnchanged) && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading || isUnchanged}
        >
          <Text style={s.btnTxt}>{loading ? "جارٍ الحفظ..." : "حفظ"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },

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
