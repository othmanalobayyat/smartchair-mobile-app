// screens/Coach.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/ThemeContext";

export default function Coach() {
  const { theme } = useTheme();

  // الحالة تأتي لاحقاً من SmartChair
  const [posture, setPosture] = useState("صحيحة"); // صحيحة - منحنية - تعب - طويلة
  const [sessionMinutes, setSessionMinutes] = useState(55);

  const suggestions = [
    "🪑 اجلس بشكل مستقيم وارجع كتفيك للخلف.",
    "📏 اجعل قدميك مستويتين على الأرض.",
    "💺 لا تمِل للأمام لفترات طويلة.",
  ];

  const stretches = [
    {
      id: 1,
      name: "تمديد الرقبة",
      img: { uri: "https://i.imgur.com/Vh9xOLu.png" },
      desc: "أدر رقبتك ببطء يمينًا ويسارًا لمدة 30 ثانية.",
    },
    {
      id: 2,
      name: "تمديد الكتفين",
      img: { uri: "https://i.imgur.com/6TzyYKM.png" },
      desc: "حرّك كتفيك للأعلى وللخلف لتخفيف التوتر.",
    },
  ];

  const lightExercises = [
    {
      id: 1,
      name: "تمرين الذراعين",
      img: { uri: "https://i.imgur.com/H2Tn8RQ.png" },
      desc: "حرّك ذراعيك للأمام والخلف لتحسين الدورة الدموية.",
    },
    {
      id: 2,
      name: "لف الرقبة",
      img: { uri: "https://i.imgur.com/m9pZboc.png" },
      desc: "أدر رقبتك بلطف مع تنفس هادئ لتخفيف التوتر.",
    },
    {
      id: 3,
      name: "رفع القدمين",
      img: { uri: "https://i.imgur.com/nKDnqpv.png" },
      desc: "ارفع كل قدم ببطء وعدّل وضع الجلوس لراحة العضلات.",
    },
  ];

  const restTips = [
    "⏰ خذ استراحة قصيرة كل 45 دقيقة.",
    "🚶‍♂️ قم بالمشي لبضع دقائق.",
    "💧 اشرب كوب ماء قبل العودة للجلوس.",
  ];

  const notifications = [
    "👏 أحسنت! جلستك اليوم ممتازة.",
    "💪 تحسّن واضح في مستوى انتباهك.",
    "🎯 استمر بهذه العادات الجيدة.",
  ];

  const getSection = () => {
    if (posture === "منحنية") {
      return { title: "📌 اقتراحات تصحيح الجلسة", data: suggestions, type: "text" };
    } else if (sessionMinutes >= 45) {
      return { title: "☕ نصائح الاستراحة المثالية", data: restTips, type: "text" };
    } else if (posture === "تعب") {
      return { title: "🧘‍♀️ تمارين التمدد البسيطة", data: stretches, type: "exercise" };
    } else if (posture === "صحيحة") {
      return { title: "🏃‍♂️ تمارين خفيفة للمحافظة على نشاطك", data: lightExercises, type: "exercise" };
    } else {
      return { title: "🌟 إشعارات تشجيعية", data: notifications, type: "text" };
    }
  };

  const section = getSection();

  return (
    <View style={[s.container, { backgroundColor: "#f5f8fc" }]}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <SafeAreaView style={s.headerContainer} edges={["top"]}>
        <Text style={s.headerTitle}>💡 المساعد الذكي – Smart Coach</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.card}>
          <Text style={s.sectionTitle}>{section.title}</Text>

          {section.type === "text" &&
            section.data.map((text, i) => (
              <View key={i} style={s.tipBox}>
                <Text style={s.tipText}>{text}</Text>
              </View>
            ))}

          {section.type === "exercise" &&
            section.data.map((ex) => (
              <View key={ex.id} style={s.exerciseBox}>
                <Image source={ex.img} style={s.image} />
                <Text style={s.exerciseName}>{ex.name}</Text>
                <Text style={s.tipText}>{ex.desc}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#2B4C7E",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  scroll: {
    padding: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 12,
    textAlign: "center",
  },
  tipBox: {
    backgroundColor: "#f0f4fa",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: "#1e293b",
    textAlign: "center",
    lineHeight: 24,
  },
  exerciseBox: {
    backgroundColor: "#f0f4fa",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 6,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 4,
  },
});
