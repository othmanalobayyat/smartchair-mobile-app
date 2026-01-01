import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// عرض الإشعار حتى لو التطبيق مفتوح
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const { status: newStatus } =
      await Notifications.requestPermissionsAsync();

    if (newStatus !== "granted") {
      return false;
    }
  }
  return true;
}

export async function sendLocalNotification({
  title,
  body,
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: null, // فوري
  });
}
