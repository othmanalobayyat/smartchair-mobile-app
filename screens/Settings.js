// screens/Settings.js - نسخة معاد تصميمها بالكامل مع الحفاظ على كل الوظائف
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
import { useAuth } from "../hooks/AuthContext";
import { useData } from "../hooks/DataContext";

export default function Settings({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { chairBattery, chairPressures } = useData();
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [alertTimeout, setAlertTimeout] = useState(5);
  const [lang, setLang] = useState(i18n.locale.startsWith("ar") ? "ar" : "en");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const connected = chairPressures !== null;
  const batteryLevel = chairBattery ?? 0;

  // ====================== HANDLERS ======================
  const toggleLanguage = async () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const isRTL = newLang === "ar";

    await AsyncStorage.setItem("APP_LANG", newLang);
    i18n.locale = newLang;
    i18n.isRTL = isRTL;
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    setLang(newLang);

    Alert.alert(
      i18n.t("languageChangedTitle"),
      i18n.t("languageChangedMessage"),
      [{ text: "OK", onPress: async () => await Updates.reloadAsync() }]
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
    navigation.navigate("About");
  };

  const getBatteryColor = (level) => {
    if (level >= 70) return theme.success;
    if (level >= 40) return theme.warning;
    return theme.error;
  };

  const { user } = useAuth();

  // ====================== UI ======================
  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <SafeAreaView
        style={[s.headerContainer, { backgroundColor: theme.primary }]}
        edges={["top"]}
      >
        <View style={s.headerInner}>
          <Text style={s.headerTitle}>{i18n.t("settingsTitle")}</Text>
          <Text style={s.headerSubtitle}>{i18n.t("headerSubtitle")}</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== ACCOUNT ==================== */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("accountCloud")}
        </Text>

        {/* PROFILE CARD (مبسّط وحديث) */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Account")}
          style={[
            s.profileCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.row}>
            <View
              style={[
                s.avatar,
                { backgroundColor: isDark ? "#FFFFFF10" : "#00000008" },
              ]}
            >
              <Ionicons name="person" size={26} color={theme.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[s.profileName, { color: theme.text }]}>
                {user?.name || "—"}
              </Text>

              <Text
                style={[s.profileEmail, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {user?.email || "—"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {/* CLOUD SYNC (تصميم نظيف جدًا) */}
        <View
          style={[
            s.cloudCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.row}>
            <View
              style={[
                s.cloudIcon,
                { backgroundColor: isDark ? "#FFFFFF08" : "#00000006" },
              ]}
            >
              <Ionicons name="cloud-outline" size={22} color={theme.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[s.cloudTitle, { color: theme.text }]}>
                {i18n.t("cloudSyncTitle")}
              </Text>
              <Text style={[s.cloudSub, { color: theme.textSecondary }]}>
                {`${i18n.t("cloudSyncLast")} منذ 5 دقائق`}
              </Text>
            </View>

            <TouchableOpacity onPress={handleCloudSync} style={s.syncBtn}>
              <Text style={s.syncBtnTxt}>{i18n.t("cloudSyncNow")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ==================== CHAIR ==================== */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("chairSettings")}
        </Text>

        {/* CONNECTION + BATTERY CARD */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.rowLeft}>
            <Ionicons
              name={connected ? "bluetooth" : "bluetooth-outline"}
              size={20}
              color={connected ? theme.success : theme.error}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={[s.cardTitle, { color: theme.text }]}>
                {connected ? "متصل بالكرسي" : "غير متصل بالكرسي"}
              </Text>
              <Text style={[s.cardSub, { color: theme.textSecondary }]}>
                {connected
                  ? i18n.t("chairConnectedDescription")
                  : i18n.t("chairDisconnectedDescription")}
              </Text>
            </View>
          </View>

          <View style={s.batteryRow}>
            <View style={s.rowLeft}>
              <Ionicons
                name="battery-half"
                size={20}
                color={getBatteryColor(batteryLevel)}
              />
              <Text style={[s.batteryText, { color: theme.text }]}>
                طاقة البطارية: {batteryLevel}%
              </Text>
            </View>

            <View
              style={[
                s.batteryBarBg,
                { backgroundColor: theme.border || "#00000010" },
              ]}
            >
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
            onPress={() => navigation.navigate("ChairProvisioning")}
            style={[
              s.secondaryBtn,
              {
                borderColor: theme.secondary,
                backgroundColor: isDark ? "#FFFFFF05" : "#00000003",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="bluetooth-connect"
              size={18}
              color={theme.secondary}
            />
            <Text
              style={[
                s.secondaryBtnTxt,
                { color: theme.secondary, marginLeft: 6 },
              ]}
            >
              {i18n.t("testConnection")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CAMERA CARD */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.row}>
            <View style={s.rowLeft}>
              <MaterialCommunityIcons
                name="video"
                size={20}
                color={theme.primary}
              />
              <View style={{ marginLeft: 8 }}>
                <Text style={[s.cardTitle, { color: theme.text }]}>
                  {i18n.t("cameraToggle")}
                </Text>
                <Text style={[s.cardSub, { color: theme.textSecondary }]}>
                  {i18n.t("cameraDescription")}
                </Text>
              </View>
            </View>

            <Switch value={cameraEnabled} onValueChange={setCameraEnabled} />
          </View>
        </View>

        {/* ==================== GENERAL ==================== */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("generalSettings")}
        </Text>

        {/* ALERT TIMEOUT CARD */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.rowLeft}>
            <MaterialCommunityIcons
              name="clock-alert-outline"
              size={20}
              color={theme.primary}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={[s.cardTitle, { color: theme.text }]}>
                {i18n.t("alertTimeout")}
              </Text>
              <Text style={[s.cardSub, { color: theme.textSecondary }]}>
                {i18n.t("alertTimeoutDescription")}
              </Text>
            </View>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity
              style={[s.iconBtn, { backgroundColor: theme.secondary }]}
              onPress={() => setAlertTimeout((p) => Math.max(1, p - 1))}
            >
              <Text style={s.iconBtnTxt}>-</Text>
            </TouchableOpacity>

            <View
              style={[s.timeoutDisplay, { backgroundColor: theme.primary }]}
            >
              <Text style={s.timeoutValue}>{alertTimeout}</Text>
              <Text style={s.timeoutUnit}>{i18n.t("minutes")}</Text>
            </View>

            <TouchableOpacity
              style={[s.iconBtn, { backgroundColor: theme.secondary }]}
              onPress={() => setAlertTimeout((p) => p + 1)}
            >
              <Text style={s.iconBtnTxt}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LANGUAGE + DARK MODE CARD */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <TouchableOpacity style={s.row} onPress={toggleLanguage}>
            <View style={s.rowLeft}>
              <Ionicons name="language" size={20} color={theme.primary} />
              <Text style={[s.cardTitle, { color: theme.text, marginLeft: 8 }]}>
                {i18n.t("language")}
              </Text>
            </View>
            <Text style={[s.value, { color: theme.secondary }]}>
              {lang === "ar" ? "العربية" : "English"}
            </Text>
          </TouchableOpacity>

          <View
            style={[
              s.divider,
              { backgroundColor: theme.border || "#00000015" },
            ]}
          />

          <View style={s.row}>
            <View style={s.rowLeft}>
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={20}
                color={isDark ? theme.warning : theme.primary}
              />
              <View style={{ marginLeft: 8 }}>
                <Text style={[s.cardTitle, { color: theme.text }]}>
                  {i18n.t("darkMode")}
                </Text>
                <Text style={[s.cardSub, { color: theme.textSecondary }]}>
                  {i18n.t("darkModeDescription")}
                </Text>
              </View>
            </View>

            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        {/* SOUND + VIBRATION CARD */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.row}>
            <View style={s.rowLeft}>
              <MaterialCommunityIcons
                name="volume-high"
                size={20}
                color={theme.secondary}
              />
              <View style={{ marginLeft: 8 }}>
                <Text style={[s.cardTitle, { color: theme.text }]}>
                  تشغيل الصوت
                </Text>
                <Text style={[s.cardSub, { color: theme.textSecondary }]}>
                  {i18n.t("soundDescription")}
                </Text>
              </View>
            </View>

            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>

          <View
            style={[
              s.divider,
              { backgroundColor: theme.border || "#00000015" },
            ]}
          />

          <View style={s.row}>
            <View style={s.rowLeft}>
              <MaterialCommunityIcons
                name="vibrate"
                size={20}
                color={theme.secondary}
              />
              <View style={{ marginLeft: 8 }}>
                <Text style={[s.cardTitle, { color: theme.text }]}>
                  تفعيل الاهتزاز
                </Text>
                <Text style={[s.cardSub, { color: theme.textSecondary }]}>
                  {i18n.t("vibrationDescription")}
                </Text>
              </View>
            </View>

            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
            />
          </View>
        </View>

        {/* ==================== SUPPORT ==================== */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("supportAbout")}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Support")}
          style={[s.mainBtn, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="information-circle-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>{i18n.t("support")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAbout}
          style={[
            s.mainBtn,
            { backgroundColor: theme.primary, marginBottom: 40 },
          ]}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 40,
  },

  // HEADER
  headerContainer: {
    width: "100%",
    paddingBottom: 10,
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  headerInner: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 6,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#FFFFFFCC",
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    width: "92%",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 18,
    opacity: 0.6,
  },

  // GENERIC
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
  },

  // PROFILE CARD
  profileCard: {
    width: "92%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },

  // CLOUD CARD
  cloudCard: {
    width: "92%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cloudIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cloudTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  cloudSub: {
    fontSize: 12,
    marginTop: 2,
  },
  syncBtn: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncBtnTxt: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },

  // GENERIC CARD
  card: {
    width: "92%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
  },

  divider: {
    height: 1,
    marginVertical: 10,
    width: "100%",
  },

  // BATTERY
  batteryRow: {
    marginTop: 14,
  },
  batteryText: {
    fontSize: 13,
    marginLeft: 8,
  },
  batteryBarBg: {
    width: "100%",
    height: 8,
    borderRadius: 5,
    marginTop: 8,
    overflow: "hidden",
  },
  batteryBarFill: {
    height: "100%",
    borderRadius: 5,
  },

  // TIMEOUT
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnTxt: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  timeoutDisplay: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 90,
  },
  timeoutValue: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "800",
  },
  timeoutUnit: {
    color: "#FFFFFFCC",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  // BUTTONS
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
  mainBtnTxt: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 14,
    borderWidth: 1,
  },
  secondaryBtnTxt: {
    fontSize: 13,
    fontWeight: "700",
  },
});
