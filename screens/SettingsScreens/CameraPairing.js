import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/ThemeContext";
import { useAuth } from "../../hooks/AuthContext";

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
      <SafeAreaView
        edges={["top"]}
        style={[s.header, { backgroundColor: theme.primary }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Pair Camera</Text>
          <Text style={s.headerSub}>Scan this QR from desktop camera app</Text>
        </View>

        <TouchableOpacity onPress={onHelp} style={s.helpBtn}>
          <Ionicons name="help-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <View
        style={[
          s.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {!payload ? (
          <>
            <Text style={[s.title, { color: theme.text }]}>
              لا يوجد User ID
            </Text>
            <Text style={[s.desc, { color: theme.muted }]}>
              يبدو أن بيانات المستخدم غير مكتملة. جرّب تسجيل الخروج ثم تسجيل
              الدخول.
            </Text>
          </>
        ) : (
          <>
            <Text style={[s.title, { color: theme.text }]}>QR جاهز للمسح</Text>
            <Text style={[s.desc, { color: theme.muted }]}>
              امسح الرمز من تطبيق الكاميرا على الكمبيوتر لربطها بحسابك.
            </Text>

            <View
              style={[
                s.qrWrap,
                { backgroundColor: isDark ? "#FFFFFF10" : "#00000008" },
              ]}
            >
              <QRCode value={payload} size={220} />
            </View>

            <Text style={[s.small, { color: theme.muted }]}>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { padding: 6, marginRight: 6 },
  helpBtn: { padding: 6, marginLeft: 6 },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  headerSub: { color: "#FFFFFFCC", fontSize: 12, marginTop: 2 },

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
