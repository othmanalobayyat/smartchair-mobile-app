// hooks/i18n.js
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =====================
// إنشاء كائن الترجمة
// =====================
const i18n = new I18n({
  ar: {
    // ===== SETTINGS (موجودة كما هي) =====
    settingsTitle: "إعدادات النظام",
    alertTimeout: "⏱ مهلة التنبيه الحالية:",
    minutes: "دقيقة",
    cameraToggle: "تفعيل الكاميرا",
    language: "اللغة",
    darkMode: "الوضع الليلي",
    testConnection: "اختبار الاتصال مع الكرسي",
    support: "الدعم / عن النظام",
    connectionTest: "📡 اختبار الاتصال",
    connectionSuccess: "تم الاتصال مع الكرسي بنجاح ✅",
    supportTitle: "ℹ️ الدعم الفني",
    supportMessage: "للتواصل مع الدعم:\nsmartchair.support@email.com",
    languageChangedTitle: "🌐 تم تغيير اللغة",
    languageChangedMessage:
      "سيتم تطبيق اللغة الجديدة بعد إعادة تشغيل التطبيق.",

    // ===== SMART CHAIR (مضاف جديد) =====
    smartChairTitle: "الكرسي الذكي",
    chairConnected: "الكرسي متصل",
    chairInactive: "الكرسي غير متصل",
    camActive: "الكاميرا مفعّلة",
    camOff: "الكاميرا متوقفة",

    sensorsReadings: "قراءات الحساسات",
    sessionStatus: "حالة الجلسة",

    postureLabel: "وضعية الجلسة",
    postureCorrect: "صحيحة",
    postureIncorrect: "غير صحيحة",

    attentionLevel: "مستوى الانتباه",
    attentionFocused: "مركز",
    attentionDistracted: "مشتت",

    workDuration: "مدة العمل",

    personStatus: "حالة الشخص",
    present: "موجود",
    notPresent: "غير موجود",

    drowsyAlert: "نعاس مُكتشف – يُفضّل أخذ استراحة",

    startMonitoring: "تشغيل المراقبة",
    stopMonitoring: "إيقاف المراقبة",
    calibrate: "معايرة",
  },

  en: {
    // ===== SETTINGS (موجودة كما هي) =====
    settingsTitle: "System Settings",
    alertTimeout: "⏱ Alert Timeout:",
    minutes: "min",
    cameraToggle: "Camera",
    language: "Language",
    darkMode: "Dark Mode",
    testConnection: "Test Chair Connection",
    support: "Support / About",
    connectionTest: "📡 Connection Test",
    connectionSuccess: "Chair connection successful ✅",
    supportTitle: "ℹ️ Support",
    supportMessage: "For support contact:\nsmartchair.support@email.com",
    languageChangedTitle: "🌐 Language Changed",
    languageChangedMessage:
      "The new language will apply after restarting the app.",

    // ===== SMART CHAIR (مضاف جديد) =====
    smartChairTitle: "Smart Chair",
    chairConnected: "Chair Connected",
    chairInactive: "Chair Inactive",
    camActive: "Camera Active",
    camOff: "Camera Off",

    sensorsReadings: "Sensor Readings",
    sessionStatus: "Session Status",

    postureLabel: "Posture",
    postureCorrect: "Correct",
    postureIncorrect: "Incorrect",

    attentionLevel: "Attention Level",
    attentionFocused: "Focused",
    attentionDistracted: "Distracted",

    workDuration: "Work Duration",

    personStatus: "Person Status",
    present: "Present",
    notPresent: "Not Present",

    drowsyAlert: "Drowsiness detected – consider taking a break",

    startMonitoring: "Start Monitoring",
    stopMonitoring: "Stop Monitoring",
    calibrate: "Calibrate",
  },
});

i18n.enableFallback = true;

// =====================
// ✅ تحميل اللغة عند تشغيل التطبيق
// =====================
export const loadLanguage = async () => {
  const storedLang = await AsyncStorage.getItem("APP_LANG");
  const lang = storedLang || Localization.locale || "en";

  i18n.locale = lang;

  const isRTL = lang.startsWith("ar");
  i18n.isRTL = isRTL;

  // مهم للموبايل (iOS / Android)
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

export default i18n;
