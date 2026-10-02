import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { saveExpoPushToken } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (Platform.OS === "web") return { status: "unsupported" as const };
  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== "granted") status = (await Notifications.requestPermissionsAsync()).status;
  if (status !== "granted") {
    Alert.alert(
      "Notifications are off",
      "Enable notifications later in device settings to receive updates about your care."
    );
    return { status: "denied" as const };
  }
  const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
  if (!projectId) throw new Error("Expo project ID is missing from app configuration.");
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await saveExpoPushToken(token);
  return { status: "granted" as const, token };
}
