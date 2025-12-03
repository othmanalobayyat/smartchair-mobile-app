// screens/Settings.js (scrollable)
import React, { useState } from "react";
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
  const [connected, setConnected] = useState(true);
  const [batteryLevel] = useState(82);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    i18n.locale = newLang;
    setLang(newLang);
    Alert.alert(i18n.t("languageChangedTitle"), i18n.t("languageChangedMessage"));
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
    if (level >= 70) return "#27AE60";
    if (level >= 40) return "#F1C40F";
    return "#E74C3C";
  };

  return (
    <View
      style={[
        s.container,
        { backgroundColor: isDark ? "#0F172A" : theme.background },
      ]}
    >
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <SafeAreaView style={s.headerContainer} edges={["top"]}>
        <Text style={s.headerTitle}>{i18n.t("settingsTitle")}</Text>
      </SafeAreaView>

      {/* جعل المحتوى قابلاً للتمرير */}
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* مهلة التنبيه */}
        <View
          style={[
            s.card,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
            },
          ]}
        >
          <Text style={[s.label, { color: theme.text }]}>
            {i18n.t("alertTimeout")} {alertTimeout} {i18n.t("minutes")}
          </Text>
          <View style={s.btnRow}>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: "#4C89C8" }]}
              onPress={() => setAlertTimeout((p) => Math.max(1, p - 1))}
            >
              <Text style={s.btnTxt}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: "#4C89C8" }]}
              onPress={() => setAlertTimeout((p) => p + 1)}
            >
              <Text style={s.btnTxt}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* الكاميرا */}
        <View
          style={[
            s.card,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
            },
          ]}
        >
          <View style={s.row}>
            <MaterialCommunityIcons
              name="video"
              size={20}
              color={isDark ? "#AFCBFF" : "#2B4C7E"}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("cameraToggle")}
            </Text>
            <Switch value={cameraEnabled} onValueChange={setCameraEnabled} />
          </View>
        </View>

        {/* الاتصال والبطارية */}
        <View
          style={[
            s.card,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
            },
          ]}
        >
          <View style={s.row}>
            <Ionicons
              name={connected ? "bluetooth" : "bluetooth-outline"}
              size={20}
              color={connected ? "#27AE60" : "#E74C3C"}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {connected ? "متصل بالكرسي" : "غير متصل"}
            </Text>
          </View>

          <View style={[s.row, { marginTop: 8 }]}>
            <Ionicons
              name="battery-half"
              size={20}
              color={getBatteryColor(batteryLevel)}
            />
            <Text style={[s.label, { color: theme.text }]}>
              طاقة البطارية: {batteryLevel}%
            </Text>
          </View>

          <View style={s.batteryBarBg}>
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

        {/* اللغة */}
        <View
          style={[
            s.card,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
            },
          ]}
        >
          <View style={s.row}>
            <Ionicons
              name="language"
              size={20}
              color={isDark ? "#AFCBFF" : "#2B4C7E"}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("language")}
            </Text>
            <TouchableOpacity onPress={toggleLanguage}>
              <Text style={[s.value, { color: "#4C89C8" }]}>
                {lang === "ar" ? "العربية" : "English"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* الصوت والاهتزاز */}
        <View
          style={[
            s.card,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
            },
          ]}
        >
          <View style={s.row}>
            <Ionicons name="volume-high" size={20} color="#4C89C8" />
            <Text style={[s.label, { color: theme.text }]}>تشغيل الصوت</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>

          <View style={[s.row, { marginTop: 8 }]}>
            <Ionicons name="vibrate" size={20} color="#4C89C8" />
            <Text style={[s.label, { color: theme.text }]}>تفعيل الاهتزاز</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
            />
          </View>
        </View>

        {/* الوضع الليلي */}
        <View
          style={[
            s.card,
            {
              backgroundColor: isDark ? "#1C2433" : "#FFF",
              borderColor: isDark ? "#2E3A50" : "#E0E5EE",
            },
          ]}
        >
          <View style={s.row}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={isDark ? "#F1C40F" : "#2B4C7E"}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("darkMode")}
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Account")}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: "#4C89C8" }]}
        >
        
          <Ionicons name="person-circle-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>إعدادات الحساب</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCloudSync}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: "#4C89C8" }]}
        >
          <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>مزامنة البيانات مع السحابة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleTestConnection}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: "#4C89C8" }]}
        >
          <MaterialCommunityIcons name="bluetooth-connect" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>{i18n.t("testConnection")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSupport}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: "#2B4C7E" }]}
        >
          <Ionicons name="information-circle-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>{i18n.t("support")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAbout}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: "#5C6BC0", marginBottom: 40 }]}
        >
          <Ionicons name="help-circle-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>حول النظام</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { alignItems: "center", paddingVertical: 20 },
  headerContainer: {
    backgroundColor: "#2B4C7E",
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "700" },
  card: {
    width: "92%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    marginTop: 18,
    gap: 6,
  },
  mainBtnTxt: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  batteryBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E5EE",
    borderRadius: 5,
    marginTop: 8,
  },
  batteryBarFill: {
    height: "100%",
    borderRadius: 5,
  },
});
