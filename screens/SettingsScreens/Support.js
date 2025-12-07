// screens/SettingsScreens/Support.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";   // ← مكتبة أيقونات جديدة
import { useTheme } from "../../hooks/ThemeContext";

export default function Support({ navigation }) {
  const { theme } = useTheme();

  const sendEmail = () => {
    Linking.openURL("mailto:alobayyat.othman@gmail.com");
  };

  const sendReport = () => {
    Linking.openURL(
      "mailto:alobayyat.othman@gmail.com?subject=Bug Report&body=Describe the issue:"
    );
  };

  const openFAQ = () => alert("سيتم إضافة صفحة الأسئلة الشائعة قريباً.");
  const openWebsite = () => alert("سيتم إضافة موقع رسمي عند الإطلاق.");

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <SafeAreaView style={s.header} edges={["top"]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={s.headerTitle}>الدعم</Text>

        <View style={{ width: 40 }} />
      </SafeAreaView>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../assets/support.png")}
          style={s.image}
        />

        <Text style={[s.title, { color: theme.text }]}>
          كيف يمكننا مساعدتك؟
        </Text>

        <Text style={[s.desc, { color: theme.textSecondary }]}>
          إذا واجهت أي مشكلة أو لديك سؤال، يمكنك التواصل معنا مباشرة من خلال
          الخيارات التالية:
        </Text>

        {/* EMAIL */}
        <TouchableOpacity
          style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={sendEmail}
        >
          <Feather name="mail" size={24} color={theme.primary} />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>
              مراسلة فريق الدعم
            </Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              الرد خلال 24 ساعة
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* REPORT */}
        <TouchableOpacity
          style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={sendReport}
        >
          <Feather name="alert-circle" size={24} color="#E63946" />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>الإبلاغ عن خطأ</Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              ساعدنا في تحسين التطبيق
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* FAQ */}
        <TouchableOpacity
          style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={openFAQ}
        >
          <Feather name="help-circle" size={24} color={theme.primary} />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>الأسئلة الشائعة</Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              إجابات لأكثر الأسئلة شيوعاً
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* WEBSITE */}
        <TouchableOpacity
          style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={openWebsite}
        >
          <Feather name="globe" size={24} color={theme.primary} />

          <View style={s.cardTextContainer}>
            <Text style={[s.cardTitle, { color: theme.text }]}>الموقع الرسمي</Text>
            <Text style={[s.cardSub, { color: theme.textSecondary }]}>
              سيتم إطلاقه لاحقاً
            </Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: "#2B4C7E",
    width: "100%",
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  content: {
    padding: 20,
    alignItems: "center",
  },

  image: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 16,
    opacity: 0.9,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },

  desc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  card: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1.3,
  },

  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardSub: { fontSize: 12, marginTop: 2 },
});
