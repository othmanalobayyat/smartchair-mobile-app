// screens/Settings.js
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../hooks/ThemeContext";
import i18n from "../hooks/i18n";

export default function Settings({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [alertTimeout, setAlertTimeout] = useState(5);
  const [lang, setLang] = useState(i18n.locale.startsWith("ar") ? "ar" : "en");
  const [connected] = useState(true);
  const [batteryLevel] = useState(82);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);

  // ====================== HANDLERS ======================
const toggleLanguage = async () => {
  const newLang = lang === "ar" ? "en" : "ar";
  const isRTL = newLang === "ar";

  // 1️⃣ حفظ اللغة
  await AsyncStorage.setItem("APP_LANG", newLang);

  // 2️⃣ تغيير اللغة
  i18n.locale = newLang;
  i18n.isRTL = isRTL;

  // 3️⃣ تغيير اتجاه التطبيق (ضروري)
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);

  // 4️⃣ تحديث الحالة
  setLang(newLang);

  Alert.alert(
    i18n.t("languageChangedTitle"),
    i18n.t("languageChangedMessage"),
    [
      {
        text: "OK",
        onPress: async () => {
          // 5️⃣ إعادة تشغيل التطبيق
          await Updates.reloadAsync();
        },
      },
    ]
  );
};

  const handleTestConnection = () => {
    Alert.alert(i18n.t("connectionTest"), i18n.t("connectionSuccess"));
  };

  const handleSupport = () => {
    Alert.alert(i18n.t("supportTitle"), i18n.t("supportMessage"));
  };

  const handleCloudSync = () => {
    Alert.alert("☁️", "تمت مزامنة البيانات مع السحابة بنجاح ✅");
  };

  const handleAbout = () => {
    Alert.alert(
      "ℹ️ حول النظام",
      "اسم التطبيق: Smart Chair\nالإصدار: 1.0.0\nالمطور: فريق الهندسة الذكية - جامعة PAU\nآخر تحديث: نوفمبر 2025"
    );
  };

  const getBatteryColor = (level) => {
    if (level >= 70) return theme.success;
    if (level >= 40) return theme.warning;
    return theme.error;
  };

  // ====================== UI ======================
  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* HEADER */}
      <SafeAreaView
        style={[s.headerContainer, { backgroundColor: theme.primary }]}
        edges={["top"]}
      >
        <Text style={s.headerTitle}>{i18n.t("settingsTitle")}</Text>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* GENERAL */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("generalSettings")}
        </Text>

        {/* ALERT TIMEOUT */}
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[s.label, { color: theme.text }]}>
            {i18n.t("alertTimeout")} {alertTimeout} {i18n.t("minutes")}
          </Text>

          <View style={s.btnRow}>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: theme.secondary }]}
              onPress={() => setAlertTimeout((p) => Math.max(1, p - 1))}
            >
              <Text style={s.btnTxt}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.btn, { backgroundColor: theme.secondary }]}
              onPress={() => setAlertTimeout((p) => p + 1)}
            >
              <Text style={s.btnTxt}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LANGUAGE */}
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.row}>
            <Ionicons name="language" size={20} color={theme.primary} />
            <Text style={[s.label, { color: theme.text }]}>{i18n.t("language")}</Text>
            <TouchableOpacity onPress={toggleLanguage}>
              <Text style={[s.value, { color: theme.secondary }]}>
                {lang === "ar" ? "العربية" : "English"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SOUND + VIBRATION */}
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.row}>
            <MaterialCommunityIcons name="volume-high" size={20} color={theme.secondary} />
            <Text style={[s.label, { color: theme.text }]}>تشغيل الصوت</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>

          <View style={[s.row, { marginTop: 8 }]}>
            <MaterialCommunityIcons name="vibrate" size={20} color={theme.secondary} />
            <Text style={[s.label, { color: theme.text }]}>تفعيل الاهتزاز</Text>
            <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} />
          </View>
        </View>

        {/* DARK MODE */}
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.row}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={isDark ? theme.warning : theme.primary}
            />
            <Text style={[s.label, { color: theme.text }]}>{i18n.t("darkMode")}</Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        {/* CHAIR */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("chairSettings")}
        </Text>

        {/* CAMERA */}
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.row}>
            <MaterialCommunityIcons name="video" size={20} color={theme.primary} />
            <Text style={[s.label, { color: theme.text }]}>{i18n.t("cameraToggle")}</Text>
            <Switch value={cameraEnabled} onValueChange={setCameraEnabled} />
          </View>
        </View>

        {/* CONNECTION + BATTERY */}
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.row}>
            <Ionicons
              name={connected ? "bluetooth" : "bluetooth-outline"}
              size={20}
              color={connected ? theme.success : theme.error}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {connected ? "متصل بالكرسي" : "غير متصل"}
            </Text>
          </View>

          <View style={[s.row, { marginTop: 8 }]}>
            <Ionicons name="battery-half" size={20} color={getBatteryColor(batteryLevel)} />
            <Text style={[s.label, { color: theme.text }]}>
              طاقة البطارية: {batteryLevel}%
            </Text>
          </View>

          <View style={[s.batteryBarBg, { backgroundColor: theme.border }]}>
            <View
              style={[
                s.batteryBarFill,
                {
                  width: `${batteryLevel}%`,
                  backgroundColor: getBatteryColor(batteryLevel),
                },
              ]}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleTestConnection}
          style={[s.mainBtn, { backgroundColor: theme.secondary }]}
        >
          <MaterialCommunityIcons name="bluetooth-connect" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>{i18n.t("testConnection")}</Text>
        </TouchableOpacity>

        {/* ACCOUNT */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("accountCloud")}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Account")}
          style={[s.mainBtn, { backgroundColor: theme.secondary }]}
        >
          <Ionicons name="person-circle-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>إعدادات الحساب</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCloudSync}
          style={[s.mainBtn, { backgroundColor: theme.secondary }]}
        >
          <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>مزامنة البيانات مع السحابة</Text>
        </TouchableOpacity>

        {/* SUPPORT */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("supportAbout")}
        </Text>

        <TouchableOpacity
          onPress={handleSupport}
          style={[s.mainBtn, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="information-circle-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>{i18n.t("support")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAbout}
          style={[s.mainBtn, { backgroundColor: theme.primary, marginBottom: 40 }]}
        >
          <Ionicons name="help-circle-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>حول النظام</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// =====================
// STYLES
// =====================
const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { alignItems: "center", paddingVertical: 20 },

  headerContainer: {
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "700" },

  sectionTitle: {
    width: "92%",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 12,
    opacity: 0.5,
  },

  card: {
    width: "92%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    elevation: 3,
  },

  label: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 15, fontWeight: "700" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: { color: "#FFF", fontSize: 18, fontWeight: "700" },

  mainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "92%",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 14,
    gap: 6,
  },
  mainBtnTxt: { color: "#FFF", fontWeight: "700", fontSize: 15 },

  batteryBarBg: {
    width: "100%",
    height: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  batteryBarFill: {
    height: "100%",
    borderRadius: 5,
  },
});
