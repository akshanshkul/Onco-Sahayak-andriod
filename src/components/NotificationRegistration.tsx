import { useEffect } from "react";
import { registerForPushNotifications } from "../services/notifications";

export default function NotificationRegistration() {
  useEffect(() => {
    registerForPushNotifications().catch(() => {
      // Notification setup must not block the authenticated app.
    });
  }, []);
  return null;
}
