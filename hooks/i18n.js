// hooks/i18n.js
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

// إنشاء الكائن
const i18n = new I18n({
  ar: {
    settingsTitle: "⚙️ إعدادات النظام",
    alertTimeout: "⏱ مهلة التنبيه الحالية:",
    minutes: "دقيقة",
    cameraToggle: "تفعيل الكاميرا",
    language: "اللغة",
    darkMode: "الوضع الليلي",
    testConnection: "اختبار الاتصال مع الكرسي",
    support: "الدعم / عن النظام",
    connectionTest: "📡 اختبار الاتصال",
    connectionSuccess: "تم الاتصال بالكرسي بنجاح ✅",
    supportTitle: "ℹ️ الدعم الفني",
    supportMessage: "للتواصل مع فريق الدعم:\nsmartchair.support@email.com",
    languageChangedTitle: "🌐 تم تغيير اللغة",
    languageChangedMessage: "سيتم تطبيق اللغة الجديدة في الواجهة.",
  },
  en: {
    settingsTitle: "⚙️ System Settings",
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
    languageChangedMessage: "The new language is now active.",
  },
});

// ✅ تأكد أن اللغة دائماً نص وليست undefined
const locale = Localization.locale || "en"; // قيمة افتراضية
i18n.locale = typeof locale === "string" ? locale : "en";
i18n.enableFallback = true;

export default i18n;
