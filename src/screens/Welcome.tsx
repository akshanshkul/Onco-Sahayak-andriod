import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { IMG } from "../assets";
import Logo from "../components/Logo";
import { CTA, IconTile, ScreenWash } from "../components/ui";

const FEATURES = [
  { icon: "business" as const, tone: "green" as const, label: "Trusted\nHospitals" },
  { icon: "heart-circle" as const, tone: "rose" as const, label: "NGO &\nFinancial Support" },
  { icon: "document-text" as const, tone: "sky" as const, label: "Secure Document\nManagement" },
];

export default function Welcome({ navigation }: { navigation: any }) {
  return (
    <ScreenWash>
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Skip */}
        <View className="flex-row justify-end px-5 pt-1">
          <Pressable
            onPress={() => navigation.replace("Main")}
            hitSlop={10}
            className="flex-row items-center"
          >
            <Text className="text-[16px] font-semibold" style={{ color: colors.primary }}>
              Skip
            </Text>
            <Ionicons name="chevron-forward" size={17} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center pt-1">
            <Logo size="lg" />
          </View>

          <View className="mt-5 flex-row px-5">
            <View className="flex-1 pr-3">
              <Text
                className="font-extrabold"
                style={{ color: colors.navy, fontSize: 27, lineHeight: 33 }}
                adjustsFontSizeToFit
                numberOfLines={3}
              >
                A Brighter{"\n"}
                <Text style={{ color: colors.primary }}>Tomorrow</Text>
                {"\n"}Is Possible
              </Text>

              <Text className="mt-3 text-[14px] leading-[20px] text-slate-500">
                Find the right hospitals, financial support and a caring community — all in
                one place.
              </Text>

              {/* Feature list sits beside the portrait, as in the design */}
              <View className="mt-6">
                {FEATURES.map((f) => (
                  <View key={f.label} className="mb-4 flex-row items-center">
                    <IconTile icon={f.icon} tone={f.tone} size={46} radius={23} />
                    <Text
                      className="ml-3 flex-1 text-[14px] font-bold"
                      style={{ color: colors.navy, lineHeight: 19 }}
                    >
                      {f.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Hero portrait — the crop already carries the "You Are Stronger"
                script and the pull-quote from the design. */}
            <Image
              source={IMG.welcomeHero}
              style={{ width: 150, height: 372 }}
              resizeMode="cover"
              className="rounded-2xl"
            />
          </View>

          {/* CTAs */}
          <View className="mt-7 px-6">
            <CTA label="Login" chevron onPress={() => navigation.navigate("Login")} />
            <View className="h-3" />
            <CTA
              label="Create an Account"
              variant="outline"
              chevron
              onPress={() => navigation.navigate("Signup")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWash>
  );
}
