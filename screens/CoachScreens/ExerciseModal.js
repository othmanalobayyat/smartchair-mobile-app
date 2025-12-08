// CoachScreens/ExerciseModal.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ExerciseModal({
  theme,
  activeExercise,
  exerciseDuration,
  exerciseSeconds,
  isExerciseRunning,
  handleSelectDuration,
  handleFinishExercise,
  setIsExerciseRunning,
}) {
  if (!activeExercise) return null;

  return (
    <View style={styles.exerciseOverlay}>
      <View style={[styles.exerciseModal, { backgroundColor: theme.card }]}>
        {/* عنوان التمرين */}
        <Text style={[styles.exerciseModalTitle, { color: theme.text }]}>
          {activeExercise.name}
        </Text>

        {/* الصورة */}
        <Image
          source={{ uri: activeExercise.img }}
          style={styles.exerciseModalImg}
        />

        {/* الوصف */}
        <Text style={[styles.exerciseModalDesc, { color: theme.muted }]}>
          {activeExercise.desc}
        </Text>

        {/* اختيار المدة */}
        <View style={styles.durationRow}>
          {[15, 30, 60].map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.durationChip,
                exerciseDuration === d && styles.durationChipActive,
              ]}
              onPress={() => handleSelectDuration(d)}
            >
              <Text
                style={[
                  styles.durationChipText,
                  {
                    color: exerciseDuration === d ? "white" : theme.text,
                  },
                ]}
              >
                {d} ثانية
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* العداد */}
        <Text style={[styles.exerciseTimer, { color: theme.primary }]}>
          ⏱️ {exerciseSeconds} ثانية
        </Text>

        {/* شريط التقدم */}
        <View style={styles.timerBar}>
          <View
            style={[
              styles.timerFill,
              { width: `${(exerciseSeconds / exerciseDuration) * 100}%` },
            ]}
          />
        </View>

        {/* أزرار التحكم */}
        <View style={styles.exerciseControlsRow}>
          <TouchableOpacity
            style={[
              styles.exerciseControlBtn,
              isExerciseRunning
                ? styles.exerciseControlPause
                : styles.exerciseControlStart,
            ]}
            onPress={() => setIsExerciseRunning((prev) => !prev)}
          >
            <Text style={styles.exerciseControlText}>
              {isExerciseRunning ? "إيقاف مؤقت" : "ابدأ"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exerciseDone}
            onPress={handleFinishExercise}
          >
            <Text style={styles.exerciseDoneText}>تم الانتهاء ✅</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
  },
  exerciseModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
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
  },
  exerciseTimer: {
    fontSize: 22,
    fontWeight: "700",
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
});
