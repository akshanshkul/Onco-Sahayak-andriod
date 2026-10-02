import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenWash } from "../components/ui";
import Stepper from "../components/Stepper";
import { colors } from "../theme";
import { IMG } from "../assets";
import { completeRegistration } from "../services/api";

export default function RegistrationWaiting({ navigation, route }: { navigation: any; route?: any }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    completeRegistration({
      ...(route?.params?.registrationData || {}),
      documentMetadata: route?.params?.documentMetadata || [],
    }).catch(() => undefined);
    const animation = Animated.timing(progress, { toValue: 1, duration: 10000, useNativeDriver: false });
    animation.start(({ finished }) => finished && navigation.replace("Main"));
    return () => animation.stop();
  }, [navigation, progress]);
  return (
    <ScreenWash>
      <SafeAreaView className="flex-1 items-center px-6 pt-3">
        <View className="w-full flex-row justify-end">
          <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: "#E6F1FD" }}>
            <Text className="text-[12px] font-bold" style={{ color: colors.navy }}>Step 3 of 3</Text>
          </View>
        </View>
        <View className="mt-12 w-full"><Stepper current={3} /></View>
        <Image source={IMG.aiRobot} resizeMode="contain" className="mt-14 h-56 w-56" />
        <Text className="mt-8 text-center text-[28px] font-extrabold" style={{ color: colors.navy }}>
          We’re setting things up
        </Text>
        <Text className="mt-2 text-center text-[15px] leading-6 text-slate-500">
          Your documents are being securely reviewed. This will only take a moment.
        </Text>
        <View className="mt-8 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "#DCE8F2" }}>
          <Animated.View style={{ height: "100%", backgroundColor: colors.primary, width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }} />
        </View>
        <Text className="mt-3 text-[13px] text-slate-500">Please wait…</Text>
      </SafeAreaView>
    </ScreenWash>
  );
}
