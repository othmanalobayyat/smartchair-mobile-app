import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "../../hooks/ThemeContext";

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const { theme } = useTheme();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = async () => {
    setMsg("");
    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setMsg("تم تغيير كلمة المرور بنجاح");
    } catch (e) {
      setMsg(e.message);
    }
    setLoading(false);
  };

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <Text style={[s.title, { color: theme.text }]}>تغيير كلمة المرور</Text>

      <TextInput
        style={[s.input, { color: theme.text }]}
        placeholder="كلمة المرور الحالية"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <TextInput
        style={[s.input, { color: theme.text }]}
        placeholder="كلمة المرور الجديدة"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {msg ? <Text style={s.msg}>{msg}</Text> : null}

      <TouchableOpacity style={s.btn} onPress={handleChange} disabled={loading}>
        <Text style={s.btnTxt}>{loading ? "جارٍ الحفظ..." : "تغيير"}</Text>
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
    backgroundColor: "#4C89C8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnTxt: { color: "#fff", fontWeight: "700" },
  msg: { marginVertical: 8, color: "red" },
});
