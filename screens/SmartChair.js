// screens/SmartChair.js
import React, { useState, useEffect, useRef } from "react";
import i18n from "../hooks/i18n";
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
import { useData } from "../hooks/DataContext"; //Data
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function SmartChair() {
  const { theme, isDark } = useTheme();
  const { attention, camActive, isPresent, drowsy, workSeconds } = useData();
  const [chairActive] = useState(true);
  const [pressures, setPressures] = useState([5, 8, 6, 10, 7, 9]);
  const [posture, setPosture] = useState("صحيحة");
  const [monitoring, setMonitoring] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const statusBg = (active) => {
    if (!isDark) return active ? '#D4EDDA' : '#F5C6CB';
    return active ? 'rgba(46, 204, 113, 0.18)' : 'rgba(231, 76, 60, 0.18)';
  };

  const statusColor = (active) => (active ? theme.success : theme.error);
  
  const getColor = (v) => {
    if (!monitoring) return '#BDC3C7';
    if (v > 10) return theme.error;
    if (v > 6) return theme.warning;
    return theme.success;
  };

  const attentionText =
    attention == null ? "—" : attention > 60 ? "مركز" : "مشتت";

  return (
    <LinearGradient colors={theme.gradient} style={s.container}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <SafeAreaView
        style={[s.headerContainer, { backgroundColor: theme.primary }]}
        edges={['top']}>
        <Text style={s.headerTitle}>
          <MaterialCommunityIcons name="chair-school" size={22} color="#FFF" />{' '}
          الكرسي الذكي
        </Text>
      </SafeAreaView>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* STATUS ROW */}
        <View style={s.headerStatusRow}>
          <View
            style={[s.statusBox, { backgroundColor: statusBg(chairActive) }]}>
            <MaterialCommunityIcons
              name="power-plug"
              size={18}
              color={statusColor(chairActive)}
            />
            <Text style={[s.statusText, { color: theme.text }]}>
              {chairActive ? 'Chair Connected' : 'Chair Inactive'}
            </Text>
          </View>

          <View style={[s.statusBox, { backgroundColor: statusBg(camActive) }]}>
            <MaterialCommunityIcons
              name="video"
              size={18}
              color={statusColor(camActive)}
            />
            <Text style={[s.statusText, { color: theme.text }]}>
              {camActive ? 'Cam Active' : 'Cam Off'}
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

        {/* STATUS CARD */}
        <View
  style={[
    s.card,
    {
      backgroundColor: theme.card,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? theme.border : "transparent",
    },
  ]}
>
  <Text style={[s.cardTitle, { color: theme.text }]}>
    حالة الجلسة
  </Text>
  {/* وضعية الجلسة */}
<View
  style={[
    s.infoRow,
    { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
  ]}
>
  <View
    style={[
      s.iconBubble,
      { backgroundColor: posture === "صحيحة" ? theme.success : theme.error },
    ]}
  >
    <MaterialCommunityIcons name="seat" size={18} color="#fff" />
  </View>

  <View style={s.infoTextGroup}>
    <Text
      style={[
        s.infoLabel,
        { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
      ]}
    >
      وضعية الجلسة
    </Text>

    <Text
      style={[
        s.infoValue,
        {
          color: posture === "صحيحة" ? theme.success : theme.error,
          textAlign: i18n.isRTL ? "right" : "left",
        },
      ]}
    >
      {posture}
    </Text>
  </View>
</View>

{/* مستوى الانتباه */}
<View
  style={[
    s.infoRow,
    { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
  ]}
>
  <View
    style={[
      s.iconBubble,
      {
        backgroundColor:
          attentionText === "مركز" ? theme.success : theme.error,
      },
    ]}
  >
    <Ionicons
      name={attentionText === "مركز" ? "eye" : "eye-off"}
      size={18}
      color="#fff"
    />
  </View>

  <View style={s.infoTextGroup}>
    <Text
      style={[
        s.infoLabel,
        { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
      ]}
    >
      مستوى الانتباه
    </Text>

    <Text
      style={[
        s.infoValue,
        {
          color: attentionText === "مركز" ? theme.success : theme.error,
          textAlign: i18n.isRTL ? "right" : "left",
        },
      ]}
    >
      {attentionText}
    </Text>
  </View>
</View>

{/* مدة العمل */}
<View
  style={[
    s.infoRow,
    { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
  ]}
>
  <View style={[s.iconBubble, { backgroundColor: theme.primary }]}>
  <Ionicons name="time" size={18} color="#fff" />
</View>

  <View style={s.infoTextGroup}>
    <Text
      style={[
        s.infoLabel,
        { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
      ]}
    >
      مدة العمل
    </Text>

    <Text
      style={[
        s.infoValue,
        { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
      ]}
    >
      {workSeconds} ثانية
    </Text>
  </View>
</View>

{/* وجود الشخص */}
<View
  style={[
    s.infoRow,
    { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
  ]}
>
  <View
    style={[
      s.iconBubble,
      { backgroundColor: isPresent ? theme.success : theme.error },
    ]}
  >
    <Ionicons name="person" size={18} color="#fff" />
  </View>

  <View style={s.infoTextGroup}>
    <Text
      style={[
        s.infoLabel,
        { color: theme.text, textAlign: i18n.isRTL ? "right" : "left" },
      ]}
    >
      حالة الشخص
    </Text>

    <Text
      style={[
        s.infoValue,
        {
          color: isPresent ? theme.success : theme.error,
          textAlign: i18n.isRTL ? "right" : "left",
        },
      ]}
    >
      {isPresent ? "موجود" : "غير موجود"}
    </Text>
  </View>
</View>

{/* نعاس */}
{drowsy && (
  <View
    style={[
      s.alertRow,
      { flexDirection: i18n.isRTL ? "row-reverse" : "row" },
    ]}
  >
    <Ionicons name="warning" size={18} color={theme.error} />
    <Text
      style={[
        s.alertText,
        {
          color: theme.error,
          textAlign: i18n.isRTL ? "right" : "left",
          marginHorizontal: 8,
        },
      ]}
    >
      نعاس مُكتشف – يُفضّل أخذ استراحة
    </Text>
  </View>
)}
</View>

{/* CONTROLS */}
        <View style={s.controls}>
          <Pressable
            onPress={() => setMonitoring(!monitoring)}
            style={[
              s.btn,
              { backgroundColor: monitoring ? theme.primary : theme.muted },
            ]}>
            <Text style={s.btnTxt}>
              {monitoring ? 'إيقاف المراقبة' : 'تشغيل المراقبة'}
            </Text>
          </Pressable>

          <Pressable style={[s.btn, { backgroundColor: theme.secondary }]}>
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
    borderRadius: 22,
    paddingVertical: 26,   // ⬅️ أكبر
    paddingHorizontal: 22,
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
cardTitle: {
  fontSize: 16,
  fontWeight: "700",
  marginBottom: 12,
},

infoRow: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start", // ✅ هذا هو المفتاح
  marginVertical: 14,
},

infoTextGroup: {
  flex: 1,
  justifyContent: "center",
},

infoLabel: {
  fontSize: 15,     // ⬅️ أكبر
  opacity: 0.6,
  marginBottom: 2,
},

infoValue: {
  fontSize: 19,     // ⬅️ أهم سطر
  fontWeight: "800",
},

rowReverse: {
  flexDirection: "row-reverse",
},

iconBubble: {
  width: 42,        // ⬅️ أكبر وواضح
  height: 42,
  borderRadius: 21,
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 14,
},

cardTitle: {
  fontSize: 18,
  fontWeight: "800",
  marginBottom: 16,
},

alertRow: {
  marginTop: 18,
  paddingTop: 14,
  borderTopWidth: 1,
  borderColor: "rgba(0,0,0,0.08)",
  flexDirection: "row",
  alignItems: "center",
},

alertText: {
  fontSize: 15,
  fontWeight: "600",
},
});
