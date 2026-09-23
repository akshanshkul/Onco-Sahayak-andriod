import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, loginWash, loginHeroTop } from "../theme";
import { IMG } from "../assets";
import { CTA, Card, Field, OrDivider } from "../components/ui";
import { LinearGradient } from "expo-linear-gradient";
export default function Login({ navigation }: { navigation: any }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [hidden, setHidden] = useState(true);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // The screen is designed to fit without scrolling, so the two variable blocks
  // (logo and footer illustration) are sized from the viewport and the form
  // column absorbs the rest. On unusually short screens the content area falls
  // back to scrolling rather than overlapping the illustration.
  const usable = height - insets.top - insets.bottom;
  const heroHeight = Math.min((width * 392) / 900, usable * 0.50);
  const logoHeight = Math.max(64, Math.min(126, usable * 0.13));
  const compact = usable < 820;

  return (
    // Ends on the illustration's own top-edge colour so the two meet seamlessly.
    <LinearGradient colors={[...loginWash]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Back + Need Help? */}
          <View className="flex-row items-center justify-between px-5 pt-1">
            <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
              <Ionicons name="chevron-back" size={26} color={colors.navy} />
            </Pressable>
            <Pressable hitSlop={10}>
              <Text className="text-[15px] font-semibold" style={{ color: colors.primary }}>
                Need Help?
              </Text>
            </Pressable>
          </View>

          {/* Everything between the header and the illustration. flexGrow keeps
              it centred when it fits and only scrolls if the screen is short. */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 26,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center">
              <Image
                source={IMG.logo}
                // Lock-up is 686 x 453.
                style={{ height: logoHeight, width: (logoHeight * 686) / 453 }}
                resizeMode="contain"
              />
            </View>

            <Text
              className="text-center font-extrabold"
              style={{
                color: colors.navy,
                fontSize: compact ? 28 : 34,
                marginTop: compact ? 8 : 14,
              }}
            >
              Welcome Back
            </Text>
            <Text
              className="mt-1 text-center text-slate-500"
              style={{ fontSize: compact ? 13 : 15 }}
            >
              Login to continue your journey with hope.
            </Text>

            <View style={{ marginTop: compact ? 14 : 22 }}>
              <Field
                icon="person-outline"
                placeholder="Email or Mobile Number"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <View style={{ height: compact ? 10 : 14 }} />
              <Field
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidden}
                rightIcon={hidden ? "eye-outline" : "eye-off-outline"}
                onRightIconPress={() => setHidden((v) => !v)}
              />

              <Pressable className="mt-2.5 self-end" hitSlop={8}>
                <Text className="text-[13px] font-bold" style={{ color: colors.primary }}>
                  Forgot Password?
                </Text>
              </Pressable>

              <View style={{ marginTop: compact ? 12 : 18 }}>
                <CTA label="Login" chevron onPress={() => navigation.replace("Main")} />
              </View>

              <OrDivider spacing={compact ? 10 : 18} />

              <Pressable onPress={() => navigation.replace("Main")}>
                <Card className="flex-row items-center justify-center">
                  <View style={{ paddingVertical: compact ? 11 : 14 }} className="flex-row items-center">
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text
                      className="ml-2.5 text-[15px] font-bold"
                      style={{ color: colors.navy }}
                    >
                      Continue with Google
                    </Text>
                  </View>
                </Card>
              </Pressable>

              <View style={{ height: compact ? 8 : 12 }} />

              <Pressable onPress={() => navigation.replace("Main")}>
                <Card className="flex-row items-center justify-center">
                  <View style={{ paddingVertical: compact ? 11 : 14 }} className="flex-row items-center">
                    <Ionicons name="phone-portrait-outline" size={20} color={colors.navy} />
                    <Text
                      className="ml-2.5 text-[15px] font-bold"
                      style={{ color: colors.navy }}
                    >
                      Continue with Mobile OTP
                    </Text>
                  </View>
                </Card>
              </Pressable>

              <View
                className="flex-row justify-center"
                style={{ marginTop: compact ? 12 : 18 }}
              >
                <Text className="text-[14px] text-slate-500">Don’t have an account? </Text>
                <Pressable onPress={() => navigation.navigate("Signup")} hitSlop={8}>
                  <Text className="text-[14px] font-bold" style={{ color: colors.primary }}>
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Illustration footer — bleeds to the screen edges, as in the design.
              It already carries the "You Are Not Alone" script and the quote. */}
          <View style={{ width, height: heroHeight }}>
            <Image
              source={IMG.loginHero}
              style={{ width, height: heroHeight }}
              resizeMode="cover"
            />
            {/* Short fade from the page wash into the artwork. The gradient
                already ends on the image's top colour; this hides any residual
                hairline from JPEG noise or fractional pixel rounding. */}
            <LinearGradient
              colors={[loginHeroTop, "rgba(245,250,253,0)"]}
              style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26 }}
              pointerEvents="none"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
