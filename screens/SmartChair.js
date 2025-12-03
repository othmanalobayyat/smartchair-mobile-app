// screens/SmartChair.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import Svg, { Path, Rect, G, Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/ThemeContext";
import { useData } from "../hooks/DataContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function SmartChair() {
  const { theme, isDark } = useTheme();
  const { attention, camActive, isPresent, drowsy, workSeconds } = useData();

  const [pressures, setPressures] = useState([5, 8, 6, 10, 7, 9]);
  const [posture, setPosture] = useState("صحيحة");
  const [monitoring, setMonitoring] = useState(true);

  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const id = setInterval(() => {
      setPressures((prev) =>
        prev.map((v) => Math.max(0, Math.min(15, v + (Math.random() - 0.5) * 2)))
      );
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const getColor = (v) => {
    if (!monitoring) return "#BDC3C7";
    if (v > 10) return theme.error;
    if (v > 6) return "#F1C40F";
    return theme.success;
  };

  const attentionText =
    attention == null ? "—" : attention > 60 ? "مركز" : "مشتت";

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#14171C", "#1E232A", "#2C2F33"]
          : [theme.background, "#E6EBF5"]
      }
      style={s.container}
    >
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <SafeAreaView style={s.headerContainer} edges={["top"]}>
        <Text style={s.headerTitle}>
          <MaterialCommunityIcons name="chair-school" size={22} color="#fff" /> الكرسي الذكي
        </Text>
      </SafeAreaView>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.headerStatusRow}>
          <View style={[s.statusBox, { backgroundColor: "#D4EDDA" }]}>
            <MaterialCommunityIcons name="power-plug" size={18} color={theme.text} />
            <Text style={[s.statusText, { color: theme.text }]}>Chair Connected</Text>
          </View>

          <View
            style={[
              s.statusBox,
              { backgroundColor: camActive ? "#D4EDDA" : "#F5C6CB" },
            ]}
          >
            <MaterialCommunityIcons
              name="video"
              size={18}
              color={camActive ? theme.text : theme.error}
            />
            <Text style={[s.statusText, { color: theme.text }]}>
              {camActive ? "Cam Active" : "Cam Off"}
            </Text>
          </View>
        </View>

        <View style={s.chairOnly}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Svg width={280} height={280} viewBox="0 0 511.992 511.992">
              <G>
                <Rect x="394.647" y="234.656" width="21.344" height="78.22" fill="#AAB2BC" />
                <Rect x="95.997" y="234.656" width="21.328" height="78.22" fill="#AAB2BC" />
                <Path
                  d="M149.327 499.992v-52c0-1.312 1.922-3.594 3.219-3.812l85.913-14.312c4.406-.734 10.797-1.156 17.539-1.156 6.734 0 13.125.422 17.531 1.156l85.92 14.312c1.281.219 3.203 2.5 3.203 3.812v52h21.344v-52c0-11.734-9.469-22.922-21.047-24.842l-85.904-14.328c-5.797-.953-13.422-1.438-21.046-1.438-7.633 0-15.258.484-21.047 1.438l-85.913 14.328C137.469 425.07 128 436.257 128 447.992v52h21.327z"
                  fill="#AAB2BC"
                />
              </G>

              <Rect x="245.327" y="353.996" width="21.335" height="133.54" fill="#CCD1D9" />
              <Path
                d="M383.995 351.994c0 5.875-4.781 10.656-10.672 10.656h-234.66c-5.891 0-10.664-4.781-10.664-10.656V10.656C127.998 4.765 132.771 0 138.663 0h234.66c5.891 0 10.672 4.765 10.672 10.656V351.994z"
                fill={isDark ? "#2C2F33" : theme.card}
              />
              <Path
                d="M415.995 361.994c0 5.875-4.781 10.656-10.672 10.656H106.664c-5.891 0-10.664-4.781-10.664-10.656v-73.342c0-5.891 4.773-10.656 10.664-10.656h298.659c5.891 0 10.672 4.766 10.672 10.656V361.994z"
                fill="#656D78"
              />
              <Circle cx="150" cy="300" r="16" fill={getColor(pressures[0])} />
              <Circle cx="360" cy="300" r="16" fill={getColor(pressures[1])} />
              <Circle cx="150" cy="355" r="16" fill={getColor(pressures[2])} />
              <Circle cx="360" cy="355" r="16" fill={getColor(pressures[3])} />
              <Circle cx="190" cy="220" r="16" fill={getColor(pressures[4])} />
              <Circle cx="320" cy="220" r="16" fill={getColor(pressures[5])} />
            </Svg>
          </Animated.View>
        </View>

        {/* قراءة الحساسات */}
        <View style={[s.card, isDark ? s.cardDark : s.cardLight]}>
          <Text style={[s.title, { color: theme.text }]}>قراءات الحساسات</Text>
          <View style={s.readingsGrid}>
            {pressures.map((p, i) => (
              <View key={i} style={s.readCell}>
                <Text style={[s.readVal, { color: theme.text }]}>
                  L{i + 1}: {p.toFixed(1)}kg
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* حالة الجلسة */}
        <View style={[s.card, s.equalCard, isDark ? s.cardDark : s.cardLight]}>
          <Text style={[s.status, { color: theme.success }]}>
            وضعية الجلسة: {posture}
          </Text>

          <Text
            style={[
              s.subStatus,
              { color: attentionText === "مركز" ? theme.success : theme.error },
            ]}
          >
            مستوى الانتباه: {attentionText}
          </Text>

          <Text style={[s.subStatus, { color: theme.text, marginTop: 6 }]}>
            مدة العمل: {workSeconds} ثانية
          </Text>

          {drowsy && (
            <Text style={[s.subStatus, { color: theme.error }]}>⚠️ نعاس مُكتشف</Text>
          )}

          <Text
            style={[
              s.subStatus,
              { marginTop: 6, color: isPresent ? theme.success : theme.error },
            ]}
          >
            {isPresent ? "الشخص موجود" : "الشخص غير موجود"}
          </Text>
        </View>
        <View style={s.controls}>
  <Pressable
    onPress={() => setMonitoring(!monitoring)}
    style={({ pressed }) => [
      s.btn,
      {
        backgroundColor: monitoring
          ? pressed
            ? "#194D73"
            : theme.accent
          : "#AAB2BC",
      },
    ]}
  >
    <Text style={s.btnTxt}>
      {monitoring ? "إيقاف المراقبة" : "تشغيل المراقبة"}
    </Text>
  </Pressable>

  <Pressable
    disabled={!true}
    style={({ pressed }) => [
      s.btn,
      s.btnGray,
      { opacity: pressed ? 0.7 : true ? 1 : 0.5 },
    ]}
  >
    <Text style={s.btnTxt}>معايرة</Text>
  </Pressable>
</View>

      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  headerContainer: {
    backgroundColor: "#2B4C7E",
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "800" },
  headerStatusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 15,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chairOnly: { marginTop: 25, alignItems: "center", justifyContent: "center" },
  card: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  equalCard: { minHeight: 160, justifyContent: "center" },
  cardDark: { backgroundColor: "#2C2F33" },
  cardLight: { backgroundColor: "#FFF" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  readingsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  readCell: { width: "45%", marginVertical: 6, alignItems: "center" },
  readVal: { fontSize: 14, fontWeight: "600" },
  status: { fontSize: 18, fontWeight: "700" },
  subStatus: { fontSize: 16 },
  controls: { flexDirection: "row", gap: 10, marginVertical: 25 },

btn: {
  paddingVertical: 10,
  paddingHorizontal: 22,
  borderRadius: 12,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  elevation: 3,
},

btnGray: { backgroundColor: "#A5B8D8" },
btnTxt: { color: "#FFF", fontWeight: "700" },

});
