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
  },

  en: {
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