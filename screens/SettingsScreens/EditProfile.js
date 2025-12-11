import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "../../hooks/ThemeContext";

export default function EditProfile({ navigation }) {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    setMsg("");
    setLoading(true);
    try {
      await updateProfile(name.trim(), email.trim());
      setMsg("تم تحديث البيانات بنجاح");
    } catch (e) {
      setMsg(e.message);
    }
    setLoading(false);
  };

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <Text style={[s.title, { color: theme.text }]}>تعديل البيانات</Text>

      <TextInput
        style={[s.input, { color: theme.text }]}
        placeholder="الاسم"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[s.input, { color: theme.text }]}
        placeholder="الإيميل"
        value={email}
        onChangeText={setEmail}
      />

      {msg ? <Text style={s.msg}>{msg}</Text> : null}

      <TouchableOpacity style={s.btn} onPress={handleSave} disabled={loading}>
        <Text style={s.btnTxt}>{loading ? "جارٍ الحفظ..." : "حفظ"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#2B4C7E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnTxt: { color: "#fff", fontWeight: "700" },
  msg: { marginVertical: 8, color: "red" },
});
