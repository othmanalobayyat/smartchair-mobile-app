// services/feedback.js
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

let soundObj = null;

export async function playSound(enabled, file) {
  if (!enabled) return;

  try {
    if (!soundObj) {
      soundObj = new Audio.Sound();
      await soundObj.loadAsync(file);
    }
    await soundObj.replayAsync();
  } catch (e) {
    console.log("Sound error:", e);
  }
}

export function vibrate(enabled, type = "light") {
  if (!enabled) return;

  if (type === "light") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else if (type === "medium") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else if (type === "heavy") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}
