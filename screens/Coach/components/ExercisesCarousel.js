// CoachScreens/ExercisesCarousel.js
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import i18n from "../../../hooks/i18n";

export default function ExercisesCarousel({
  exercises,
  theme,
  scrollX,
  EXERCISE_CARD_WIDTH,
  handleStartExercise,
}) {
  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={EXERCISE_CARD_WIDTH}
      decelerationRate="fast"
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
    >
      {exercises.map((ex, index) => {
        const scale = scrollX.interpolate({
          inputRange: [
            (index - 1) * EXERCISE_CARD_WIDTH,
            index * EXERCISE_CARD_WIDTH,
            (index + 1) * EXERCISE_CARD_WIDTH,
          ],
          outputRange: [0.9, 1, 0.9],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={ex.id}
            style={[
              styles.exerciseCard,
              {
                backgroundColor: theme.card,
                transform: [{ scale }],
                marginRight: index === exercises.length - 1 ? 60 : 14,
              },
            ]}
          >
            <View style={styles.exerciseImageWrapper}>
              <Image
                source={typeof ex.img === "string" ? { uri: ex.img } : ex.img}
                style={styles.exerciseImg}
              />
            </View>

            <Text style={[styles.exerciseName, { color: theme.text }]}>
              {ex.name}
            </Text>

            <Text style={[styles.exerciseDesc, { color: theme.muted }]}>
              {ex.desc}
            </Text>

            <TouchableOpacity
              style={styles.exerciseBtn}
              onPress={() => handleStartExercise(ex)}
            >
              <Text style={styles.exerciseBtnText}>
                {i18n.t("exerciseStart")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  exerciseCard: {
    width: 210,
    borderRadius: 16,
    padding: 12,
    elevation: 3,
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
});
