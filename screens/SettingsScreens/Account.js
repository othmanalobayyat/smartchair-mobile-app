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
import i18n from "../../hooks/i18n";
import { useTheme } from "../../hooks/ThemeContext";
import { useAuth } from "../../hooks/AuthContext";
import {
  pickImageFromLibrary,
  uploadImageToCloudinary,
} from "../../utils/cloudinary";
import AppHeader from "../../components/AppHeader";

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

      Alert.alert(i18n.t("success"), i18n.t("avatarUpdated"));
    } catch (e) {
      Alert.alert(i18n.t("error"), e.message || i18n.t("avatarUpdateFailed"));
    }
  };

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <AppHeader
        title={i18n.t("accountSettingsTitle")}
        onBack={() => navigation.goBack()}
      />

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
        <Text style={[s.email, { color: theme.secondary }]}>
          {user?.email || "—"}
        </Text>

        {/* OPTIONS CARD */}
        <View
          style={[
            s.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity onPress={handleEdit} style={s.row}>
            <Ionicons name="create-outline" size={22} color={theme.secondary} />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("editProfile")}
            </Text>
          </TouchableOpacity>

          <View style={s.divider} />

          <TouchableOpacity onPress={handlePassword} style={s.row}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={theme.secondary}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("changePassword")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: theme.error }]}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>{i18n.t("logout")}</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
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
