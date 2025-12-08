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
    languageChangedMessage: "سيتم تطبيق اللغة الجديدة بعد إعادة تشغيل التطبيق.",

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
    // ===== App.js (موجودة كما هي) =====
    tabDashboard: "الرئيسية",
    tabStatistics: "الإحصاءات",
    tabCoach: "المساعد",
    tabSettings: "الإعدادات",

    // ===== ِAbout.js (موجودة كما هي) =====
    aboutTitle: "حول النظام",
    aboutProjectName: "Posturic – نظام الجلسة والانتباه الذكي",
    aboutDescription:
      "بوستريك هو مشروع تخرّج من جامعة فلسطين الأهلية، يهدف إلى تحسين الجلسة والانتباه باستخدام تقنيات الاستشعار الذكي، الكاميرا، وتحليل السلوك الصحي. النظام يدمج بين ESP32، الكرسي الذكي، معالجة الصور، وتطبيق موبايل تفاعلي.",
    aboutDevelopers: "المطورون",
    aboutSupervisor: "المشرف",
    aboutDevOthman: "عثمان العبيات",
    aboutDevRahaf: "رهف عديلة",
    aboutSupervisorName: "د. أحمد عبدو",

    // ===}Coach  (موجودة كما هي) =====
    coachSuggestedExercises: "تمارين مقترحة",
    coachHistory: "سجل التمارين",
    coachDurationSeconds: "مدة: {{seconds}} ثانية",

    coachTip1: "اجلس باستقامة وحافظ على ظهر ممدود.",
    coachTip2: "ضع قدميك بشكل مسطح على الأرض.",
    coachTip3: "تجنب الانحناء للأمام لفترات طويلة.",

    coachEx1Name: "تمديد الذراعين",
    coachEx1Desc: "حرّك ذراعيك للأمام والخلف لمدة 30 ثانية.",

    coachEx2Name: "تمرين الرقبة",
    coachEx2Desc: "حرّك رقبتك بلطف يمينًا ويسارًا.",

    coachEx3Name: "استقامة الجلوس",
    coachEx3Desc: "اجلس باستقامة مع شد الكتفين للخلف.",

    coachEx4Name: "تمديد الرقبة",
    coachEx4Desc: "تمرين لتخفيف شد الرقبة.",

    coachEx5Name: "تمديد الكتفين",
    coachEx5Desc: "لفّ الكتفين للأعلى والخلف.",

    coachBreakSuggestion: "لقد مر وقت طويل — خذ استراحة قصيرة.",
    coachExerciseSelectDuration: "اختر المدة",
    coachExerciseStart: "ابدأ",
    coachExercisePause: "إيقاف مؤقت",
    coachExerciseFinish: "إنهاء",
    coachHeaderTitle: "المساعد الذكي – Smart Coach",
    coachBreakText:
      "مضى {{minutes}} دقيقة من الجلوس المتواصل – يُفضل أخذ استراحة قصيرة.",
    modalSeconds: "{{seconds}} ثانية",
    modalDurationSeconds: "{{seconds}} ثانية",
    modalStart: "ابدأ",
    modalPause: "إيقاف مؤقت",
    modalDone: "تم الانتهاء ✅",
    exerciseStart: "ابدأ التمرين",
    heroYourPosture: "وضعيتك الآن:",
    heroSessionDuration: "مدة الجلسة:",
    heroMinutes: "دقيقة",
    heroSessionState: "حالة الجلسة:",

    heroStatePerfect: "مثالية",
    heroStateFix: "يلزم تصحيح",
    heroStateExercise: "تحتاج تمارين",
    heroStateBreak: "تحتاج استراحة",

    heroHint: "كلما زاد وقت الجلوس، خذ فترات استراحة قصيرة.",
    quickTipsTitle: "نصائح سريعة",
    quickTipsSwipe: "اسحب لليمين لرؤية المزيد",

    // ===ChatBot.js (موجودة كما هي) =====
    chatWelcome: "مرحباً! أنا مساعد الجلسة الذكي 👋",

    chatPostureCorrect: "جلستك ممتازة! استمر بهذه الوضعية.",
    chatPostureBent: "ظهرك مائل—حاول ترجع كتفيك للخلف.",
    chatPostureTired: "أنصحك بتمارين التمدد التي تظهر أمامك.",
    chatPostureLong: "جلستك أصبحت طويلة—خذ استراحة بسيطة.",
    chatPostureDefault: "تستطيع سؤالي عن وضعك أو طلب نصيحة أو تمرين.",

    chatAskStatus: "كيف وضعي الآن؟",
    chatAskExercise: "أعطني تمرين.",
    chatAskBreak: "هل أحتاج استراحة؟",

    chatExerciseTired: "أنصحك بتمدد الرقبة والكتفين.",
    chatExerciseNormal: "جرّب تمرين الذراعين أو لف الرقبة.",

    chatBreakYes: "نعم! الأفضل تأخذ استراحة الآن.",
    chatBreakNo: "لسا عندك وقت، لكن لو تعبان خذ بريك.",

    chatTitle: "محادثة المساعد الذكي",
    chatQuickStatus: "حالتي؟",
    chatQuickExercise: "تمريني",
    chatQuickBreak: "استراحة",

    chatPlaceholder: "اكتب رسالة...",
    // ===== AUTH (Login & Register) =====
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "تسجيل الدخول لمتابعة وضعيتك وصحتك",
    loginButton: "تسجيل الدخول",
    loginButtonLoading: "جاري تسجيل الدخول...",
    loginEmail: "البريد الإلكتروني",
    loginPassword: "كلمة المرور",
    loginPlaceholderEmail: "example@email.com",
    loginPlaceholderPassword: "••••••••",
    loginNoAccount: "لا تملك حساباً؟",
    loginCreateAccount: "إنشاء حساب جديد",
    loginErrorEmpty: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
    loginFooter: "بياناتك تُستخدم لتحسين تجربتك الصحية فقط.",

    registerTitle: "إنشاء حساب جديد",
    registerSubtitle: "اربط حسابك بذكاء مع كرسيك الصحي",
    registerName: "الاسم",
    registerPlaceholderName: "الاسم الكامل",
    registerButton: "إنشاء حساب",
    registerButtonLoading: "جاري إنشاء الحساب...",
    registerSuccess: "تم إنشاء الحساب بنجاح، يمكنك الآن تسجيل الدخول.",
    registerErrorEmpty: "يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور",
    registerHaveAccount: "لديك حساب بالفعل؟",
    registerLogin: "تسجيل الدخول",
    // ===== STATISTICS =====
    statsTitle: "الإحصاءات",
    dailySummary: "ملخص النشاط اليومي",
    session: "الجلسة",
    duration: "المدة",
    minutesUnit: "دقيقة",
    correctPercent: "النسبة الصحيحة",
    alertsCount: "عدد التنبيهات",
    dailyScore: "التقييم اليومي",
    tipTitle: "معلومة اليوم",
    historyBtn: "عرض التاريخ السابق",

    // ===== Historical  =====
    historyTitle: "عرض التاريخ السابق",
    averagePerformance: "متوسط الأداء",
    prevDaysResults: "نتائج الأيام السابقة",
    motivationHigh: "🌟 أداء ممتاز! استمر بنفس الوتيرة.",
    motivationMedium: "💪 أداء جيد جدًا، يمكنك الوصول للأفضل قريبًا.",
    motivationLow: "🚀 لا تقلق، التحسّن يأتي بالمداومة!",
    shareResults: "مشاركة النتائج",
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

    // ===== App.js (موجودة كما هي) =====
    tabDashboard: "Dashboard",
    tabStatistics: "Statistics",
    tabCoach: "Coach",
    tabSettings: "Settings",
    // ===== ِAbout.js (موجودة كما هي) =====
    aboutTitle: "About the System",
    aboutProjectName: "Posturic – Smart Posture & Attention System",
    aboutDescription:
      "Posturic is a graduation project from Palestine Ahliya University, designed to improve posture and attention using smart sensing, camera analysis, and healthy behavior tracking. The system integrates ESP32, smart seating sensors, computer vision, and an interactive mobile application.",
    aboutDevelopers: "Developers",
    aboutSupervisor: "Supervisor",
    aboutDevOthman: "Othman Al-Obayyat",
    aboutDevRahaf: "Rahaf Adeelah",
    aboutSupervisorName: "Dr. Ahmed Abdou",

    // ===== ِCoach.js (موجودة كما هي) =====
    coachSuggestedExercises: "Suggested Exercises",
    coachHistory: "Exercise History",
    coachDurationSeconds: "Duration: {{seconds}} sec",

    coachTip1: "Sit upright and keep your back straight.",
    coachTip2: "Place both feet flat on the floor.",
    coachTip3: "Avoid leaning forward for long periods.",

    coachEx1Name: "Arm Stretch",
    coachEx1Desc: "Move your arms forward and backward for 30 seconds.",

    coachEx2Name: "Neck Exercise",
    coachEx2Desc: "Gently move your neck left and right.",

    coachEx3Name: "Posture Correction",
    coachEx3Desc: "Sit straight and pull your shoulders back.",

    coachEx4Name: "Neck Stretch",
    coachEx4Desc: "A stretch to relieve neck tension.",

    coachEx5Name: "Shoulder Stretch",
    coachEx5Desc: "Roll your shoulders up and back.",

    coachBreakSuggestion: "You've been sitting for long — take a short break.",
    coachExerciseSelectDuration: "Select Duration",
    coachExerciseStart: "Start",
    coachExercisePause: "Pause",
    coachExerciseFinish: "Finish",
    coachHeaderTitle: "Smart Coach – Intelligent Assistant",
    coachBreakText:
      "{{minutes}} minutes of continuous sitting – it's recommended to take a short break.",
    modalSeconds: "{{seconds}} sec",
    modalDurationSeconds: "{{seconds}} sec",
    modalStart: "Start",
    modalPause: "Pause",
    modalDone: "Completed ✅",
    exerciseStart: "Start Exercise",
    heroYourPosture: "Your posture:",
    heroSessionDuration: "Session duration:",
    heroMinutes: "min",
    heroSessionState: "Session state:",

    heroStatePerfect: "Perfect",
    heroStateFix: "Needs correction",
    heroStateExercise: "Needs exercises",
    heroStateBreak: "Needs a break",

    heroHint: "As sitting time increases, take short breaks.",
    quickTipsTitle: "Quick Tips",
    quickTipsSwipe: "Swipe right to see more",

    // ===ChatBot.js (موجودة كما هي) =====
    chatWelcome: "Hello! I'm your smart session assistant 👋",

    chatPostureCorrect: "Your posture is great! Keep it up.",
    chatPostureBent: "Your back is bent—try pulling your shoulders back.",
    chatPostureTired: "I recommend the stretching exercises shown above.",
    chatPostureLong: "You've been sitting too long—take a short break.",
    chatPostureDefault:
      "You can ask me about your posture or request a tip or exercise.",

    chatAskStatus: "How's my posture now?",
    chatAskExercise: "Give me an exercise.",
    chatAskBreak: "Do I need a break?",

    chatExerciseTired: "I recommend neck and shoulder stretch.",
    chatExerciseNormal: "Try arm stretch or neck rotation.",

    chatBreakYes: "Yes! You should take a break now.",
    chatBreakNo: "You're good for now, but take a break if you're tired.",

    chatTitle: "Smart Coach Chat",
    chatQuickStatus: "My status?",
    chatQuickExercise: "Exercise",
    chatQuickBreak: "Break",

    chatPlaceholder: "Type a message...",
    // ===== AUTH (Login & Register) =====
    loginTitle: "Login",
    loginSubtitle: "Sign in to track your posture and health",
    loginButton: "Login",
    loginButtonLoading: "Signing in...",
    loginEmail: "Email",
    loginPassword: "Password",
    loginPlaceholderEmail: "example@email.com",
    loginPlaceholderPassword: "••••••••",
    loginNoAccount: "Don't have an account?",
    loginCreateAccount: "Create a new account",
    loginErrorEmpty: "Please enter email and password",
    loginFooter: "Your data is used only to improve your health experience.",

    registerTitle: "Create a New Account",
    registerSubtitle: "Link your account smartly with your healthy chair",
    registerName: "Name",
    registerPlaceholderName: "Full Name",
    registerButton: "Create Account",
    registerButtonLoading: "Creating account...",
    registerSuccess: "Account created successfully. You can now login.",
    registerErrorEmpty: "Please enter name, email, and password",
    registerHaveAccount: "Already have an account?",
    registerLogin: "Login",
    // ===== STATISTICS =====
    statsTitle: "Statistics",
    dailySummary: "Daily Activity Summary",
    session: "Session",
    duration: "Duration",
    minutesUnit: "min",
    correctPercent: "Correct Posture",
    alertsCount: "Alerts Count",
    dailyScore: "Daily Score",
    tipTitle: "Today's Tip",
    historyBtn: "View History",

    // ===== Historical  =====
    historyTitle: "History",
    averagePerformance: "Average Performance",
    prevDaysResults: "Previous Days Results",
    motivationHigh: "🌟 Excellent performance! Keep going.",
    motivationMedium: "💪 Very good performance, you're improving.",
    motivationLow: "🚀 Don't worry, improvement comes with consistency!",
    shareResults: "Share Results",
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
