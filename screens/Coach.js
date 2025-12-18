// screens/Coach.js
import React, { useState, useRef, useEffect } from "react";
import i18n from "../hooks/i18n";
import { useTheme } from "../hooks/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

import ChatBot from "./CoachScreens/ChatBot";
import Header from "./CoachScreens/Header";
import HeroCard from "./CoachScreens/HeroCard";
import QuickTips from "./CoachScreens/QuickTips";
import ExercisesCarousel from "./CoachScreens/ExercisesCarousel";
import BreakSuggestion from "./CoachScreens/BreakSuggestion";
import ExerciseModal from "./CoachScreens/ExerciseModal";
import { useData } from "../hooks/DataContext";

const EXERCISE_CARD_WIDTH = 220;

export default function Coach() {
  const { theme } = useTheme();
  // ========================
  // STATES
  // ========================
  const [posture, setPosture] = useState("صحيحة"); // صحيحة – منحنية – تعب – طويلة
  const [sessionMinutes, setSessionMinutes] = useState(15);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // تمرين
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseDuration, setExerciseDuration] = useState(30); // 15 / 30 / 60
  const [exerciseSeconds, setExerciseSeconds] = useState(30);
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState([]); // [{id,name,duration,completedAt}]

  // ========================
  // HERO COLORS + ICONS
  // ========================
  const heroColors = {
    صحيحة: "#4CAF50",
    منحنية: "#FFC107",
    تعب: "#FF9800",
    طويلة: "#F44336",
  };

  const postureIcon = {
    صحيحة: "checkmark-circle-outline",
    منحنية: "alert-circle-outline",
    تعب: "fitness-outline",
    طويلة: "time-outline",
  };

  const heroColor = heroColors[posture] || "#4CAF50";

  // ========================
  // ANIMATIONS
  // ========================
  const heroAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scrollX = useRef(new Animated.Value(0)).current;

  // ========================
  // SESSION TIMER (كل دقيقة)
  // ========================
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutes((m) => m + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // ========================
  // HAPTICS عند تغير الـ posture
  // ========================
  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [posture]);

  // ========================
  // BEEP SOUND للعد التنازلي
  // ========================
  const beepSoundRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          // عدّل المسار حسب مكان ملف الصوت عندك
          require("../assets/exercise-beep.mp3")
        );
        if (isMounted) beepSoundRef.current = sound;
      } catch (e) {
        console.log("Error loading beep sound:", e);
      }
    })();

    return () => {
      isMounted = false;
      if (beepSoundRef.current) {
        beepSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const playBeep = async () => {
    try {
      if (beepSoundRef.current) {
        await beepSoundRef.current.replayAsync();
      }
    } catch (e) {
      console.log("Error playing beep:", e);
    }
  };

  // ========================
  // EXERCISE COUNTDOWN TIMER
  // ========================
  useEffect(() => {
    if (!isExerciseRunning || !activeExercise) return;

    if (exerciseSeconds === 0) {
      // انتهى التمرين
      setIsExerciseRunning(false);
      // نسجّل في التاريخ
      setExerciseHistory((prev) => [
        {
          id: Date.now().toString(),
          name: activeExercise.name,
          duration: exerciseDuration,
          completedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      playBeep();
      return;
    }

    const timer = setTimeout(() => {
      setExerciseSeconds((prev) => {
        const next = prev - 1;
        if (next > 0 && next <= 3) {
          // آخر ثلاث ثواني
          playBeep();
        }
        return next;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isExerciseRunning, exerciseSeconds, activeExercise, exerciseDuration]);

  const handleStartExercise = (ex) => {
    setActiveExercise(ex);
    setExerciseDuration(30);
    setExerciseSeconds(30);
    setIsExerciseRunning(true);
  };

  const handleFinishExercise = () => {
    if (activeExercise) {
      setExerciseHistory((prev) => [
        {
          id: Date.now().toString(),
          name: activeExercise.name,
          duration: exerciseDuration,
          completedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
    setIsExerciseRunning(false);
    setActiveExercise(null);
  };

  const handleSelectDuration = (d) => {
    setExerciseDuration(d);
    setExerciseSeconds(d);
  };

  // ========================
  // QUICK TIPS
  // ========================
  const suggestions = [
    { icon: "body-outline", text: i18n.t("coachTip1") },
    { icon: "footsteps-outline", text: i18n.t("coachTip2") },
    { icon: "swap-vertical-outline", text: i18n.t("coachTip3") },
  ];

  // ========================
  // EXERCISES
  // ========================
  const exercisesCorrect = [
    {
      id: 1,
      name: i18n.t("coachEx1Name"),
      img: require("../assets/exercises/arm_stretch.png"),
      desc: i18n.t("coachEx1Desc"),
    },
    {
      id: 2,
      name: i18n.t("coachEx2Name"),
      img: require("../assets/exercises/neck_rotation.png"),
      desc: i18n.t("coachEx2Desc"),
    },
    {
      id: 3,
      name: i18n.t("coachEx3Name"),
      img: "https://cdn-icons-png.flaticon.com/512/3048/3048387.png",
      desc: i18n.t("coachEx3Desc"),
    },
  ];

  const exercisesTired = [
    {
      id: 4,
      name: i18n.t("coachEx4Name"),
      img: "https://cdn-icons-png.flaticon.com/512/3048/3048381.png",
      desc: i18n.t("coachEx4Desc"),
    },
    {
      id: 5,
      name: i18n.t("coachEx5Name"),
      img: "https://cdn-icons-png.flaticon.com/512/3048/3048394.png",
      desc: i18n.t("coachEx5Desc"),
    },
  ];

  let exercises = exercisesCorrect;
  if (posture === "تعب") exercises = exercisesTired;
  if (sessionMinutes > 30) exercises = exercisesTired.slice(0, 2);

  // ========================
  // UI
  // ========================
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* HEADER */}
      <Header theme={theme} />

      {/* MAIN SCROLL */}
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
        {/* HERO CARD */}
        <HeroCard
          posture={posture}
          sessionMinutes={sessionMinutes}
          heroColor={heroColor}
          postureIcon={postureIcon}
          heroAnim={heroAnim}
        />

        {/* QUICK TIPS */}
        <QuickTips theme={theme} suggestions={suggestions} />

        {/* EXERCISES */}
        <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
          {i18n.t("coachSuggestedExercises")}
        </Text>

        <ExercisesCarousel
          exercises={exercises}
          theme={theme}
          scrollX={scrollX}
          EXERCISE_CARD_WIDTH={EXERCISE_CARD_WIDTH}
          handleStartExercise={handleStartExercise}
        />

        {/* BREAK SUGGESTION */}
        {sessionMinutes >= 40 && (
          <BreakSuggestion theme={theme} sessionMinutes={sessionMinutes} />
        )}

        {/* HISTORY */}
        {exerciseHistory.length > 0 && (
          <View style={[styles.historyCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.historyTitle, { color: theme.text }]}>
              {i18n.t("coachHistory")}
            </Text>
            {exerciseHistory.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={[styles.historyName, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.historyMeta, { color: theme.muted }]}>
                    {i18n.t("coachDurationSeconds", { seconds: item.duration })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FLOATING CHAT BUTTON */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.chatButton, { backgroundColor: theme.primary }]}
          onPress={() => setIsChatOpen(true)}
        >
          <Ionicons name="chatbubbles-sharp" size={28} color="white" />
          <View style={styles.chatBadge}>
            <Text style={styles.chatBadgeText}>AI</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* EXERCISE MODAL */}
      <ExerciseModal
        theme={theme}
        activeExercise={activeExercise}
        exerciseDuration={exerciseDuration}
        exerciseSeconds={exerciseSeconds}
        isExerciseRunning={isExerciseRunning}
        handleSelectDuration={handleSelectDuration}
        handleFinishExercise={handleFinishExercise}
        setIsExerciseRunning={setIsExerciseRunning}
      />

      {/* CHATBOT COMPONENT */}
      <ChatBot
        visible={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        posture={posture}
        sessionMinutes={sessionMinutes}
      />
    </View>
  );
}

// ============================
// STYLES
// ============================
const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 10,
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "700" },

  heroCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    marginBottom: 22,
  },
  heroAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { color: "white", fontSize: 20, fontWeight: "700", marginTop: 6 },
  heroSmall: { color: "white", fontSize: 15, marginTop: 4 },

  sessionBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 6,
    marginTop: 12,
  },
  sessionFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
  sessionHint: {
    marginTop: 6,
    fontSize: 12,
    color: "white",
    opacity: 0.9,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },

  tipCard: {
    width: 150,
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    alignItems: "center",
    elevation: 3,
  },
  tipText: {
    textAlign: "center",
    marginTop: 6,
    color: "#1e2a3b",
    fontSize: 14,
  },

  exerciseCard: {
    width: EXERCISE_CARD_WIDTH - 10,
    borderRadius: 16,
    padding: 12,
    marginRight: 14,
    elevation: 3,
  },
  exerciseIndex: {
    position: "absolute",
    top: 8,
    right: 10,
    fontSize: 12,
    color: "#64748b",
  },
  exerciseImg: {
    width: "100%",
    height: 130,
    borderRadius: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e3a8a",
    marginTop: 8,
  },
  exerciseDesc: {
    fontSize: 14,
    color: "#1e293b",
    marginTop: 4,
  },

  exerciseBtn: {
    marginTop: 8,
    backgroundColor: "#2B4C7E",
    borderRadius: 14,
    paddingVertical: 6,
  },
  exerciseBtnText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },

  breakCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
  },
  breakText: {
    marginTop: 6,
    fontSize: 15,
    color: "#1e293b",
    textAlign: "center",
  },
  timeBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E7EEFF",
    borderRadius: 4,
    marginTop: 8,
  },
  timeFill: {
    height: "100%",
    backgroundColor: "#2B4C7E",
    borderRadius: 4,
  },

  chatButton: {
    position: "absolute",
    bottom: 28,
    right: 30,
    width: 74,
    height: 74,
    backgroundColor: "#2B4C7E",
    borderRadius: 37,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  chatBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chatBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },

  exerciseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  exerciseModal: {
    backgroundColor: "white",
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
  },
  exerciseModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1e3a8a",
    textAlign: "center",
  },
  exerciseModalImg: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 10,
  },
  exerciseModalDesc: {
    fontSize: 15,
    color: "#1e293b",
    textAlign: "center",
  },

  durationRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  durationChip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  durationChipActive: {
    backgroundColor: "#2B4C7E",
    borderColor: "#2B4C7E",
  },
  durationChipText: {
    fontSize: 13,
    color: "#1e293b",
  },
  durationChipTextActive: {
    color: "white",
    fontWeight: "700",
  },

  exerciseTimer: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B4C7E",
    marginTop: 6,
    textAlign: "center",
  },
  timerBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E7EEFF",
    borderRadius: 4,
    marginTop: 6,
  },
  timerFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },

  exerciseControlsRow: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "space-between",
  },
  exerciseControlBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    marginRight: 8,
  },
  exerciseControlStart: {
    backgroundColor: "#3b82f6",
  },
  exerciseControlPause: {
    backgroundColor: "#f97316",
  },
  exerciseControlText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  exerciseDone: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    marginLeft: 8,
  },
  exerciseDoneText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  historyCard: {
    marginTop: 20,
    padding: 14,

    borderRadius: 16,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  historyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  historyMeta: {
    fontSize: 12,
    color: "#6b7280",
  },
  exerciseImageWrapper: {
    backgroundColor: "#F1F5FF",
    borderRadius: 14,
    padding: 8,
    marginBottom: 8,
  },

  exerciseImg: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
  },
});
