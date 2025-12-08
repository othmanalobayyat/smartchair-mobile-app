// screens/Settings.js - محسّن مع الحفاظ على الهوية
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

  // ====================== UI ======================
  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

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
        {/* ==================== ACCOUNT (بارز) ==================== */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("accountCloud")}
        </Text>

        {/* PROFILE CARD - مميز */}
        <View
          style={[
            s.profileCard,
            {
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
            },
          ]}
        >
          <View style={s.profileTop}>
            <View style={s.profileAvatar}>
              <Ionicons name="person" size={28} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName}>أحمد محمد</Text>
              <Text style={s.profileEmail}>ahmed@example.com</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Account")}
              style={s.editBtn}
            >
              <Ionicons name="create-outline" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>247</Text>
              <Text style={s.statLabel}>ساعات</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>32</Text>
              <Text style={s.statLabel}>تنبيهات</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>98%</Text>
              <Text style={s.statLabel}>التزام</Text>
            </View>
          </View>
        </View>

        {/* CLOUD SYNC - مميز */}
        <TouchableOpacity
          onPress={handleCloudSync}
          style={[
            s.cloudCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.success,
            },
          ]}
        >
          <View style={s.cloudBadge}>
            <MaterialCommunityIcons name="cloud-check" size={14} color="#FFF" />
            <Text style={s.cloudBadgeText}>متزامن</Text>
          </View>

          <View style={s.cloudContent}>
            <View
              style={[s.cloudIcon, { backgroundColor: theme.success + "20" }]}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={24}
                color={theme.success}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.cloudTitle, { color: theme.text }]}>
                مزامنة البيانات
              </Text>
              <Text style={[s.cloudSub, { color: theme.textSecondary }]}>
                آخر مزامنة: منذ 5 دقائق
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>

          <View style={[s.progressBar, { backgroundColor: theme.border }]}>
            <View
              style={[
                s.progressFill,
                {
                  width: "85%",
                  backgroundColor: theme.success,
                },
              ]}
            />
          </View>
          <Text style={[s.progressText, { color: theme.textSecondary }]}>
            85% • 2.4 MB / 2.8 MB
          </Text>
        </TouchableOpacity>

        {/* ==================== CHAIR ==================== */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("chairSettings")}
        </Text>

        {/* CONNECTION + BATTERY */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
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

          <View style={[s.row, { marginTop: 12 }]}>
            <Ionicons
              name="battery-half"
              size={20}
              color={getBatteryColor(batteryLevel)}
            />
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

        {/* CAMERA */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.row}>
            <MaterialCommunityIcons
              name="video"
              size={20}
              color={theme.primary}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("cameraToggle")}
            </Text>
            <Switch value={cameraEnabled} onValueChange={setCameraEnabled} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ChairProvisioning")}
          style={[s.mainBtn, { backgroundColor: theme.secondary }]}
        >
          <MaterialCommunityIcons
            name="bluetooth-connect"
            size={20}
            color="#FFF"
          />
          <Text style={s.mainBtnTxt}>{i18n.t("testConnection")}</Text>
        </TouchableOpacity>

        {/* ==================== GENERAL ==================== */}
        <Text style={[s.sectionTitle, { color: theme.text }]}>
          {i18n.t("generalSettings")}
        </Text>

        {/* ALERT TIMEOUT */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.timeoutHeader}>
            <MaterialCommunityIcons
              name="clock-alert-outline"
              size={20}
              color={theme.primary}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("alertTimeout")}
            </Text>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: theme.secondary }]}
              onPress={() => setAlertTimeout((p) => Math.max(1, p - 1))}
            >
              <Text style={s.btnTxt}>-</Text>
            </TouchableOpacity>

            <View
              style={[s.timeoutDisplay, { backgroundColor: theme.primary }]}
            >
              <Text style={s.timeoutValue}>{alertTimeout}</Text>
              <Text style={s.timeoutUnit}>{i18n.t("minutes")}</Text>
            </View>

            <TouchableOpacity
              style={[s.btn, { backgroundColor: theme.secondary }]}
              onPress={() => setAlertTimeout((p) => p + 1)}
            >
              <Text style={s.btnTxt}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LANGUAGE + DARK MODE */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <TouchableOpacity style={s.row} onPress={toggleLanguage}>
            <Ionicons name="language" size={20} color={theme.primary} />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("language")}
            </Text>
            <Text style={[s.value, { color: theme.secondary }]}>
              {lang === "ar" ? "العربية" : "English"}
            </Text>
          </TouchableOpacity>

          <View style={[s.divider, { backgroundColor: theme.border }]} />

          <View style={s.row}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={isDark ? theme.warning : theme.primary}
            />
            <Text style={[s.label, { color: theme.text }]}>
              {i18n.t("darkMode")}
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        {/* SOUND + VIBRATION */}
        <View
          style={[
            s.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={s.row}>
            <MaterialCommunityIcons
              name="volume-high"
              size={20}
              color={theme.secondary}
            />
            <Text style={[s.label, { color: theme.text }]}>تشغيل الصوت</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>

          <View style={[s.divider, { backgroundColor: theme.border }]} />

          <View style={s.row}>
            <MaterialCommunityIcons
              name="vibrate"
              size={20}
              color={theme.secondary}
            />
            <Text style={[s.label, { color: theme.text }]}>تفعيل الاهتزاز</Text>
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
    marginTop: 16,
    opacity: 0.5,
  },

  // PROFILE CARD (محسّن)
  profileCard: {
    width: "92%",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF30",
  },
  profileName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  profileEmail: {
    color: "#FFFFFF90",
    fontSize: 13,
    marginTop: 2,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF20",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF20",
    borderRadius: 14,
    padding: 14,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    color: "#FFFFFF80",
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#FFFFFF30",
  },

  // CLOUD CARD (محسّن)
  cloudCard: {
    width: "92%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cloudBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  cloudBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  cloudContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  cloudIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cloudTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cloudSub: {
    fontSize: 12,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    marginTop: 4,
  },

  // REGULAR CARDS
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

  divider: {
    height: 1,
    marginVertical: 10,
  },

  // TIMEOUT
  timeoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: { color: "#FFF", fontSize: 20, fontWeight: "700" },
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
    color: "#FFFFFF90",
    fontSize: 11,
    fontWeight: "600",
  },

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
    marginTop: 10,
  },
  batteryBarFill: {
    height: "100%",
    borderRadius: 5,
  },
});
