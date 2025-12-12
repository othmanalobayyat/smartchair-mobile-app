// screens/SettingsScreens/Account.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/ThemeContext";
import { useAuth } from "../../hooks/AuthContext";
import {
  pickImageFromLibrary,
  uploadImageToCloudinary,
} from "../../utils/cloudinary";

export default function Account({ navigation }) {
  const { theme, isDark } = useTheme();
  const { user, logout, updateProfile } = useAuth();

  const handleEdit = () => navigation.navigate("EditProfile");
  const handlePassword = () => navigation.navigate("ChangePassword");

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleChangeAvatar = async () => {
    try {
      const uri = await pickImageFromLibrary();
      if (!uri) return;

      const avatarUrl = await uploadImageToCloudinary(uri);

      await updateProfile(user.name, user.email, avatarUrl);

      Alert.alert("تم", "تم تحديث صورة البروفايل بنجاح");
    } catch (e) {
      Alert.alert("خطأ", e.message || "فشل تحديث الصورة");
    }
  };

  return (
    <View
      style={[
        s.container,
        { backgroundColor: isDark ? "#0F172A" : theme.background },
      ]}
    >
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <SafeAreaView style={s.header} edges={["top"]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle}> إعدادات الحساب</Text>
      </SafeAreaView>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingVertical: 25 }}
      >
        {/* AVATAR */}
        <TouchableOpacity onPress={handleChangeAvatar}>
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={s.avatar}
          />
        </TouchableOpacity>

        {/* NAME */}
        <Text style={[s.name, { color: theme.text }]}>{user?.name || "—"}</Text>

        {/* EMAIL */}
        <Text style={[s.email, { color: isDark ? "#AFCBFF" : "#4C89C8" }]}>
          {user?.email || "—"}
        </Text>

        {/* OPTIONS CARD */}
        <View
          style={[
            s.card,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
            },
          ]}
        >
          <TouchableOpacity onPress={handleEdit} style={s.row}>
            <Ionicons name="create-outline" size={22} color="#4C89C8" />
            <Text style={[s.label, { color: theme.text }]}>
              تعديل البيانات الشخصية
            </Text>
          </TouchableOpacity>

          <View style={s.divider} />

          <TouchableOpacity onPress={handlePassword} style={s.row}>
            <Ionicons name="lock-closed-outline" size={22} color="#4C89C8" />
            <Text style={[s.label, { color: theme.text }]}>
              تغيير كلمة المرور
            </Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: "#E74C3C" }]}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
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

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 80,
    marginBottom: 12,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
  },

  email: {
    fontSize: 14,
    marginBottom: 22,
    fontWeight: "600",
  },

  card: {
    width: "92%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#D3D8E0",
    marginVertical: 12,
    opacity: 0.5,
  },

  mainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "92%",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    gap: 6,
  },

  mainBtnTxt: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
