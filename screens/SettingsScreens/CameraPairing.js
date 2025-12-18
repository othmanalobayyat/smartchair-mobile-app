// screens/SettingsScreens/CameraPairing.js
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/ThemeContext";
import { useAuth } from "../../hooks/AuthContext";
import AppHeader from "../../components/AppHeader";

export default function CameraPairing({ navigation }) {
  const { theme, isDark } = useTheme();
  const { user, token } = useAuth();

  const userId = user?.id;

  const payload = useMemo(() => {
    if (!userId) return null;

    // QR payload JSON (أفضل من string طويل عشان الكاميرا تفهمه بسهولة)
    return JSON.stringify({
      scheme: "smartchair",
      action: "pair",
      user_id: userId,
      token: token || null, // اختياري الآن، بس مفيد لاحقاً
      ts: Date.now(),
    });
  }, [userId, token]);

  const onHelp = () => {
    Alert.alert(
      "ربط الكاميرا",
      "افتح تطبيق الكاميرا على الكمبيوتر، اضغط Pair QR ثم وجّه الكاميرا نحو هذا الرمز."
    );
  };

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Pair Camera"
        subtitle="Scan this QR from desktop camera app"
        onBack={() => navigation.goBack()}
        rightIcon="help-circle-outline"
        onRightPress={onHelp}
      />

      <View
        style={[
          s.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            shadowColor: theme.shadow,
          },
        ]}
      >
        {!payload ? (
          <>
            <Text style={[s.title, { color: theme.text }]}>
              لا يوجد User ID
            </Text>
            <Text style={[s.desc, { color: theme.textSecondary }]}>
              يبدو أن بيانات المستخدم غير مكتملة. جرّب تسجيل الخروج ثم تسجيل
              الدخول.
            </Text>
          </>
        ) : (
          <>
            <Text style={[s.title, { color: theme.text }]}>QR جاهز للمسح</Text>
            <Text style={[s.desc, { color: theme.textSecondary }]}>
              امسح الرمز من تطبيق الكاميرا على الكمبيوتر لربطها بحسابك.
            </Text>

            <View
              style={[
                s.qrWrap,
                { backgroundColor: isDark ? theme.surfaceAlt : theme.surface },
              ]}
            >
              <QRCode value={payload} size={220} />
            </View>

            <Text style={[s.small, { color: theme.textSecondary }]}>
              User: {userId}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  card: {
    marginTop: 18,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "800" },
  desc: { fontSize: 13, marginTop: 6, textAlign: "center", lineHeight: 18 },
  qrWrap: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
  },
  small: { marginTop: 12, fontSize: 12 },
});
