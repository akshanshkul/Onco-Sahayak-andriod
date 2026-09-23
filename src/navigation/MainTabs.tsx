import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Home from "../screens/Home";
import Hospitals from "../screens/Hospitals";
import Assistance from "../screens/Assistance";
import MyDocuments from "../screens/MyDocuments";
import Profile from "../screens/Profile";
import BottomNav from "../components/BottomNav";
import { ScreenWash } from "../components/ui";

export default function MainTabs({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) {
  const [active, setActive] = useState<string>(route?.params?.tab ?? "Home");

  // Screens outside the tab bar (e.g. AISupport) can request a tab on return.
  useEffect(() => {
    const requested = route?.params?.tab;
    if (requested && requested !== active) setActive(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.tab]);

  const render = () => {
    switch (active) {
      case "Hospitals":
        return <Hospitals navigation={navigation} />;
      case "Assistance":
        return <Assistance navigation={navigation} />;
      case "Documents":
        return <MyDocuments />;
      case "Profile":
        return <Profile navigation={navigation} />;
      default:
        return <Home navigation={navigation} onTab={setActive} />;
    }
  };

  return (
    <ScreenWash>
      {/* `top` keeps content clear of the status bar / notch; the tab bar
          handles the bottom inset itself so it can paint to the screen edge. */}
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <View className="flex-1">{render()}</View>
      </SafeAreaView>
      <BottomNav active={active} onChange={setActive} />
    </ScreenWash>
  );
}
