import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  useWindowDimensions,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, loginWash, loginHeroTop } from "../theme";
import { IMG } from "../assets";
import { CTA, Field } from "../components/ui";
import { LinearGradient } from "expo-linear-gradient";
import {
  changeForgottenPassword,
  login,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
} from "../services/api";
export default function Login({ navigation }: { navigation: any }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [requestingReset, setRequestingReset] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [resetStep, setResetStep] = useState<"identifier" | "otp" | "password">("identifier");
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetChallengeId, setResetChallengeId] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  React.useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const submitLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await login(identifier, password);
      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Login failed", error instanceof Error ? error.message : "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const submitForgotPassword = () => {
    setResetIdentifier(identifier.trim());
    setResetStep("identifier");
    setResetVisible(true);
  };

  const sendResetCode = async () => {
    if (!resetIdentifier.trim()) {
      Alert.alert("Enter your email or mobile", "Enter the email or mobile number used for your account.");
      return;
    }
    setRequestingReset(true);
    try {
      const response = await requestPasswordResetOtp(resetIdentifier.trim());
      setResetChallengeId(response.data?.challengeId || "");
      setResetStep("otp");
      Alert.alert("Code sent", "We sent a verification code to the email linked to your account.");
    } catch (error) {
      Alert.alert("Unable to send code", error instanceof Error ? error.message : "Please try again");
    } finally {
      setRequestingReset(false);
    }
  };

  const verifyResetCode = async () => {
    if (!resetChallengeId || !/^\d{6}$/.test(resetCode.trim())) {
      Alert.alert("Enter the OTP", "Enter the 6-digit code sent to your email.");
      return;
    }
    setRequestingReset(true);
    try {
      await verifyPasswordResetOtp(resetChallengeId, resetCode.trim());
      setResetStep("password");
    } catch (error) {
      Alert.alert("Verification failed", error instanceof Error ? error.message : "Please try again");
    } finally {
      setRequestingReset(false);
    }
  };

  const changeResetPassword = async () => {
    if (resetPassword.length < 8) {
      Alert.alert("Password too short", "Password must be at least 8 characters.");
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      Alert.alert("Passwords do not match", "Enter the same password in both fields.");
      return;
    }
    setRequestingReset(true);
    try {
      await changeForgottenPassword(resetChallengeId, resetCode.trim(), resetPassword);
      setResetVisible(false);
      setPassword("");
      Alert.alert("Password changed", "Your password was changed successfully. Please log in again.");
    } catch (error) {
      Alert.alert("Password change failed", error instanceof Error ? error.message : "Please try again");
    } finally {
      setRequestingReset(false);
    }
  };

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

              <Pressable className="mt-2.5 self-end" hitSlop={8} onPress={submitForgotPassword}>
                <Text className="text-[13px] font-bold" style={{ color: colors.primary }}>
                  {requestingReset ? "Sending..." : "Forgot Password?"}
                </Text>
              </Pressable>

              <View style={{ marginTop: compact ? 12 : 18 }}>
                <CTA label={loading ? "Logging in..." : "Login"} chevron onPress={submitLogin} />
              </View>

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
      <Modal visible={resetVisible} transparent animationType="slide" onRequestClose={() => setResetVisible(false)}>
        <View className="flex-1 justify-end bg-black/30">
          <View
            className="rounded-t-3xl bg-white px-6 pt-6"
            style={{ paddingBottom: 40 + keyboardHeight }}
          >
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-xl font-extrabold" style={{ color: colors.navy }}>
                {resetStep === "identifier" ? "Reset password" : resetStep === "otp" ? "Verify email" : "Create new password"}
              </Text>
              <Pressable onPress={() => setResetVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={25} color={colors.navy} />
              </Pressable>
            </View>
            {resetStep === "identifier" && (
              <>
                <Text className="mb-3 text-slate-500">Enter your registered email or mobile number. We will send the OTP to your email.</Text>
                <TextInput
                  value={resetIdentifier}
                  onChangeText={setResetIdentifier}
                  placeholder="Email or Mobile Number"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="mb-4 rounded-2xl border border-slate-200 px-4 py-3"
                />
                <CTA label={requestingReset ? "Sending..." : "Send OTP"} onPress={sendResetCode} chevron />
              </>
            )}
            {resetStep === "otp" && (
              <>
                <Text className="mb-3 text-slate-500">Enter the 6-digit OTP sent to your email.</Text>
                <TextInput
                  value={resetCode}
                  onChangeText={setResetCode}
                  placeholder="6-digit OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                  className="mb-4 rounded-2xl border border-slate-200 px-4 py-3 text-center text-lg tracking-widest"
                />
                <CTA label={requestingReset ? "Verifying..." : "Verify OTP"} onPress={verifyResetCode} chevron />
              </>
            )}
            {resetStep === "password" && (
              <>
                <TextInput
                  value={resetPassword}
                  onChangeText={setResetPassword}
                  placeholder="New password"
                  secureTextEntry
                  className="mb-3 rounded-2xl border border-slate-200 px-4 py-3"
                />
                <TextInput
                  value={resetConfirmPassword}
                  onChangeText={setResetConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                  className="mb-4 rounded-2xl border border-slate-200 px-4 py-3"
                />
                <CTA label={requestingReset ? "Changing..." : "Change Password"} onPress={changeResetPassword} chevron />
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
