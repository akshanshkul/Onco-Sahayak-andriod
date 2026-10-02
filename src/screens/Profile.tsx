import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
  Image,
  Keyboard,
  Animated,
  Easing,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Card, ScriptText, Skeleton, type IconName } from "../components/ui";
import { OptionSheet } from "../components/pickers";
import LanguageSheet from "../components/LanguageSheet";
import { useT, useI18n, LANGUAGE_NAMES } from "../i18n";
import type { StringKey } from "../i18n";
import Logo from "../components/Logo";
import {
  getProfile,
  getCatalogOptions,
  getCachedProfile,
  invalidateProfileCache,
  requestContactChangeOtp,
  updateProfile,
  updateProfileImage,
  uploadFile,
  verifyContactChangeOtp,
} from "../services/api";
import { signOutFirebase } from "../services/firebase";

const formatDateOfBirth = (value: string) => {
  if (!value) return "";
  const date = value.slice(0, 10);
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

type FieldKey = "fullName" | "dob" | "gender" | "location" | "bloodGroup" | "medicalStage" | "email" | "mobile";

/** Field schema. `pick` marks a value chosen from a list rather than typed. */
const PERSONAL: { key: FieldKey; icon: IconName; label: StringKey; pick?: string[] }[] = [
  { key: "fullName", icon: "person-outline", label: "signup.fullName" },
  { key: "dob", icon: "calendar-outline", label: "signup.dob" },
  { key: "gender", icon: "male-female-outline", label: "signup.gender" },
  { key: "location", icon: "location-outline", label: "profile.location" },
  {
    key: "bloodGroup",
    icon: "water-outline",
    label: "profile.bloodGroup",
    pick: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  {
    key: "medicalStage",
    icon: "document-text-outline",
    label: "profile.condition",
  },
];

const INITIAL: Record<FieldKey, string> = {
  fullName: "",
  dob: "",
  gender: "",
  location: "",
  bloodGroup: "",
  medicalStage: "",
  email: "",
  mobile: "",
};

type SettingRow = { id: string; icon: IconName; label: StringKey; danger?: boolean };

const SETTINGS: SettingRow[] = [
  { id: "password", icon: "lock-closed-outline", label: "profile.changePassword" },
  { id: "notifications", icon: "notifications-outline", label: "profile.notifications" },
  { id: "language", icon: "globe-outline", label: "profile.language" },
  { id: "privacy", icon: "shield-checkmark-outline", label: "profile.privacy" },
  { id: "help", icon: "help-circle-outline", label: "profile.help" },
  { id: "logout", icon: "log-out-outline", label: "profile.logout", danger: true },
];

export default function Profile({ navigation }: { navigation?: any }) {
  const [genderOptions, setGenderOptions] = useState<string[]>([]);
  const [cancerStageOptions, setCancerStageOptions] = useState<string[]>([]);
  const cachedProfile = getCachedProfile();
  const [saved, setSaved] = useState<Record<FieldKey, string>>(() => ({
    ...INITIAL,
    fullName: cachedProfile?.fullName || "",
    email: cachedProfile?.email || "",
    mobile: cachedProfile?.mobile || "",
    bloodGroup: typeof cachedProfile?.bloodGroup === "string"
      ? cachedProfile.bloodGroup
      : typeof cachedProfile?.blood_group === "string" ? cachedProfile.blood_group : "",
    medicalStage: typeof cachedProfile?.medicalStage === "string"
      ? cachedProfile.medicalStage
      : typeof cachedProfile?.medical_stage === "string" ? cachedProfile.medical_stage : "",
  }));
  // `draft` holds unsaved edits so Cancel can discard them cleanly.
  const [draft, setDraft] = useState<Record<FieldKey, string>>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [picking, setPicking] = useState<FieldKey | null>(null);
  const [showLanguage, setShowLanguage] = useState(false);
  const [contactType, setContactType] = useState<"mobile" | "email" | null>(null);
  useEffect(() => {
    getCatalogOptions().then((options) => {
      setGenderOptions(options.gender);
      setCancerStageOptions(options.cancerStage);
    }).catch(() => {
      Alert.alert("Unable to load profile options", "Please check your connection and try again.");
    });
  }, []);
  const [contactValue, setContactValue] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [contactStep, setContactStep] = useState<"value" | "codes">("value");
  const [contactBusy, setContactBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);
  const sheetOpacity = React.useRef(new Animated.Value(0)).current;
  const sheetTranslateY = React.useRef(new Animated.Value(36)).current;
  const keyboardOffset = React.useRef(new Animated.Value(0)).current;
  const toastAnimation = React.useRef(new Animated.Value(0)).current;
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [imageBusy, setImageBusy] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const tr = useT();
  const { lang } = useI18n();

  const showToast = (message: string, error = false) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, error });
    Animated.sequence([
      Animated.timing(toastAnimation, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(2600),
      Animated.timing(toastAnimation, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      Animated.timing(keyboardOffset, {
        toValue: event.endCoordinates.height,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (contactType) {
      sheetOpacity.setValue(0);
      sheetTranslateY.setValue(36);
      Animated.parallel([
        Animated.timing(sheetOpacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 220,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [contactType, sheetOpacity, sheetTranslateY]);

  const logout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOutFirebase();
          } finally {
            await AsyncStorage.multiRemove(["auth_token"]);
            invalidateProfileCache();
            navigation?.reset({ index: 0, routes: [{ name: "Welcome" }] });
          }
        },
      },
    ]);
  };

  useEffect(() => {
    AsyncStorage.getItem("auth_token")
      .then((token) => setAuthenticated(Boolean(token)))
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    setProfileLoading(true);
    getProfile()
      .then((profile) => {
        const next = {
          ...saved,
          fullName: typeof profile.fullName === "string" ? profile.fullName : saved.fullName,
          dob: formatDateOfBirth(
            typeof profile.dateOfBirth === "string" ? profile.dateOfBirth : saved.dob
          ),
          gender: typeof profile.gender === "string" ? profile.gender : saved.gender,
          bloodGroup: typeof profile.bloodGroup === "string"
            ? profile.bloodGroup
            : typeof profile.blood_group === "string" ? profile.blood_group : saved.bloodGroup,
          medicalStage: typeof profile.medicalStage === "string"
            ? profile.medicalStage
            : typeof profile.medical_stage === "string" ? profile.medical_stage : saved.medicalStage,
          location:
            [profile.district, profile.state, profile.pinCode]
              .filter((value): value is string => typeof value === "string" && Boolean(value))
              .join(", ") ||
            saved.location,
          email: typeof profile.email === "string" ? profile.email : saved.email,
          mobile: typeof profile.mobile === "string" ? profile.mobile : saved.mobile,
        };
        setProfileImage(profile.profileImageUrl || profile.profile_image_url);
        setSaved(next);
        setDraft(next);
      })
      .catch((error) => {
        console.error("Profile loading failed:", error);
      })
      .finally(() => setProfileLoading(false));
    // Load once when the tab is first opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const startEdit = () => {
    setDraft(saved);
    setEditing(true);
  };

  const chooseProfileImage = async () => {
    if (imageBusy) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow photo access to choose a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setImageBusy(true);
    try {
      const upload = await uploadFile(
        {
          uri: asset.uri,
          name: asset.fileName || `profile-${Date.now()}.jpg`,
          mimeType: asset.mimeType || "image/jpeg",
        },
        "profile"
      );
      if (!upload.key) throw new Error("The server did not create an image upload");
      const profile = await updateProfileImage(upload.key);
      const imageUrl = profile.profileImageUrl || profile.profile_image_url;
      if (!imageUrl) throw new Error("The profile photo was uploaded but no viewing URL was returned");
      setProfileImage(imageUrl);
      showToast("Profile picture updated");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to update your photo.", true);
    } finally {
      setImageBusy(false);
    }
  };
  const cancelEdit = () => {
    setDraft(saved);
    setEditing(false);
  };
  const commit = async () => {
    if (!draft.fullName.trim()) {
      Alert.alert(tr("profile.nameRequired"));
      return;
    }
    setSavingProfile(true);
    try {
      const dateParts = draft.dob.split("/");
      const dateOfBirth =
        dateParts.length === 3
          ? `${dateParts[2]}-${dateParts[1].padStart(2, "0")}-${dateParts[0].padStart(2, "0")}`
          : draft.dob || undefined;
      const updatedProfile = await updateProfile({
        fullName: draft.fullName.trim(),
        dateOfBirth,
        gender: draft.gender || undefined,
        bloodGroup: draft.bloodGroup || undefined,
        medicalStage: draft.medicalStage || undefined,
      });
      const next = {
        ...draft,
        bloodGroup: typeof updatedProfile?.bloodGroup === "string"
          ? updatedProfile.bloodGroup
          : typeof updatedProfile?.blood_group === "string"
            ? updatedProfile.blood_group
            : draft.bloodGroup,
        medicalStage: typeof updatedProfile?.medicalStage === "string"
          ? updatedProfile.medicalStage
          : typeof updatedProfile?.medical_stage === "string"
            ? updatedProfile.medical_stage
            : draft.medicalStage,
      };
      setSaved(next);
      setDraft(next);
      setEditing(false);
      showToast("Personal information saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save your personal information.",
        true
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const openContactChange = (type: "mobile" | "email") => {
    setContactType(type);
    setContactValue("");
    setCurrentCode("");
    setNewCode("");
    setChallengeId("");
    setContactStep("value");
  };

  const closeContactSheet = () => {
    if (contactBusy) return;
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(sheetOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 30,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => setContactType(null));
  };

  const sendContactCode = async () => {
    if (!contactType || !contactValue.trim()) {
      Alert.alert("Required", `Enter your new ${contactType || "contact"} first.`);
      return;
    }
    setContactBusy(true);
    try {
      const response = await requestContactChangeOtp(contactType, contactValue.trim());
      const id = response.data?.challengeId;
      if (!id) throw new Error("The server did not create a verification request");
      setChallengeId(id);
      setContactStep("codes");
    } catch (error) {
      Alert.alert("Unable to send code", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setContactBusy(false);
    }
  };

  const verifyContactCode = async () => {
    if (!challengeId || !currentCode.trim() || (contactType === "email" && !newCode.trim())) {
      Alert.alert("Required", "Enter all verification codes.");
      return;
    }
    setContactBusy(true);
    try {
      await verifyContactChangeOtp(challengeId, currentCode.trim(), contactType === "email" ? newCode.trim() : undefined);
      invalidateProfileCache();
      const next = { ...saved, [contactType as "email" | "mobile"]: contactValue.trim() };
      setSaved(next);
      setDraft(next);
      closeContactSheet();
      showToast(`${contactType === "email" ? "Email" : "Mobile number"} updated successfully`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Please try again.", true);
    } finally {
      setContactBusy(false);
    }
  };

  const pickField = PERSONAL.find((f) => f.key === picking);
  const pickOptions = picking === "gender"
    ? genderOptions
    : picking === "medicalStage" ? cancerStageOptions : pickField?.pick;

  if (authChecking) {
    return (
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: colors.bg }}>
        <Ionicons name="person-circle-outline" size={72} color={colors.primary} />
        <Text className="mt-4 text-center text-[18px] font-bold" style={{ color: colors.navy }}>
          Loading your profile
        </Text>
      </View>
    );
  }

  if (!authenticated) {
    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {profileLoading && (
          <View className="mb-4">
            <Skeleton width={118} height={20} />
            <Skeleton width="72%" height={14} className="mt-3" />
            <Skeleton width="88%" height={14} className="mt-2" />
          </View>
        )}
        <View
          className="h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: "#E6F7EF" }}
        >
          <Ionicons name="person-outline" size={46} color={colors.primary} />
        </View>
        <Text className="mt-5 text-center text-[25px] font-extrabold" style={{ color: colors.navy }}>
          Your profile is waiting
        </Text>
        <Text className="mt-2 max-w-[320px] text-center text-[14px] leading-5 text-slate-500">
          Log in to view your personal information, documents, contact details, and profile photo.
        </Text>
        <Pressable
          onPress={() => navigation?.navigate("Login")}
          className="mt-6 w-full max-w-[320px] items-center rounded-2xl py-3.5"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-[15px] font-bold text-white">Log in to view profile</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation?.navigate("Signup")}
          className="mt-3 w-full max-w-[320px] items-center rounded-2xl border py-3.5"
          style={{ borderColor: colors.primary }}
        >
          <Text className="text-[15px] font-bold" style={{ color: colors.primary }}>
            Create an account
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Logo size="sm" showTagline={false} />
        <Pressable hitSlop={10}>
          <Ionicons name="notifications-outline" size={23} color={colors.navy} />
          <View
            className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.pink }}
          >
            <Text className="text-[9px] font-bold text-white">3</Text>
          </View>
        </Pressable>
      </View>

      <Text className="mt-4 text-[26px] font-extrabold" style={{ color: colors.navy }}>
        {tr("profile.title")}
      </Text>
      <Text className="mt-0.5 text-[13px] text-slate-500">{tr("profile.subtitle")}</Text>

      {/* Identity */}
      <View className="mt-4 flex-row items-start">
        <View>
          <Pressable onPress={chooseProfileImage} disabled={imageBusy}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} className="h-[74px] w-[74px] rounded-full" />
            ) : (
              <View
                className="h-[74px] w-[74px] items-center justify-center rounded-full"
                style={{ backgroundColor: "#E6F1FD" }}
              >
                <Ionicons name="person" size={36} color={colors.blue} />
              </View>
            )}
            <View
              className="absolute -bottom-0.5 -right-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-white"
              style={{ backgroundColor: colors.primary }}
            >
              <Ionicons name={imageBusy ? "cloud-upload-outline" : "camera"} size={13} color="#fff" />
            </View>
          </Pressable>
        </View>

        <View className="ml-3.5 min-w-0 flex-1">
          <Text
            className="text-[19px] font-extrabold"
            style={{ color: colors.navy }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {saved.fullName}
          </Text>
          <Text className="text-[13px] text-slate-500">{tr("profile.patient")}</Text>
        </View>

      </View>

      {/* Encouragement strip */}
      <Pressable
        className="mt-4 flex-row items-center rounded-2xl p-3.5"
        style={{ backgroundColor: "#E6F7EF" }}
      >
        <Ionicons name="heart" size={19} color={colors.primary} />
        <View className="ml-2.5 flex-1">
          <ScriptText size={14} align="left" color={colors.navy}>
            “Stronger Today for a Brighter Tomorrow.”
          </ScriptText>
        </View>
        <Ionicons name="chevron-forward" size={17} color={colors.primary} />
      </Pressable>

      {/* Personal information */}
      <View className="mb-2.5 mt-5 flex-row items-center justify-between">
        <Text className="text-[17px] font-bold" style={{ color: colors.navy }}>
          {tr("profile.personalInfo")}
        </Text>
        {editing ? (
          <View className="flex-row items-center">
            <Pressable
              onPress={cancelEdit}
              className="mr-2 h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.slate100 }}
              accessibilityLabel="Cancel editing profile"
            >
              <Ionicons name="close" size={19} color={colors.slate500} />
            </Pressable>
            <Pressable
              onPress={commit}
              disabled={savingProfile}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.primary }}
              accessibilityLabel="Save profile"
            >
              <Ionicons name={savingProfile ? "cloud-upload-outline" : "checkmark"} size={19} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={startEdit}
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primarySoft }}
            accessibilityLabel="Edit personal information"
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </Pressable>
        )}
      </View>
      <Card className="px-4">
        {PERSONAL.map((r, i) => {
          const value = editing ? draft[r.key] : saved[r.key];
          const rowStyle = { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border };

          if (!editing) {
            return (
              <Pressable
                key={r.key}
                onPress={startEdit}
                className="flex-row items-center py-3.5"
                style={rowStyle}
              >
                <Ionicons name={r.icon} size={18} color={colors.primary} />
                <Text className="ml-3 w-[104px] text-[13px] text-slate-500">{tr(r.label)}</Text>
                <Text
                  className="flex-1 text-right text-[13px] font-semibold"
                  style={{ color: colors.navy }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  {value}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.slate400}
                  style={{ marginLeft: 8 }}
                />
              </Pressable>
            );
          }

          return (
            <View key={r.key} className="flex-row items-center py-2.5" style={rowStyle}>
              <Ionicons name={r.icon} size={18} color={colors.primary} />
              <Text className="ml-3 w-[104px] text-[13px] text-slate-500">{tr(r.label)}</Text>

              {r.pick ? (
                <Pressable
                  onPress={() => setPicking(r.key)}
                  className="ml-2 flex-1 flex-row items-center justify-end rounded-xl border px-2.5 py-2"
                  style={{ borderColor: colors.border, backgroundColor: "#F8FBFD" }}
                >
                  <Text
                    className="text-[13px] font-semibold"
                    style={{ color: colors.navy }}
                    numberOfLines={1}
                  >
                    {value}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color={colors.slate400}
                    style={{ marginLeft: 4 }}
                  />
                </Pressable>
              ) : (
                <TextInput
                  value={value}
                  onChangeText={(text) => setDraft((d) => ({ ...d, [r.key]: text }))}
                  placeholder={tr(r.label)}
                  placeholderTextColor={colors.slate400}
                  className="ml-2 flex-1 rounded-xl border px-2.5 py-2 text-right text-[13px] font-semibold"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "#F8FBFD",
                    color: colors.navy,
                    minWidth: 0,
                  }}
                />
              )}
            </View>
          );
        })}
      </Card>

      <Text className="mb-2.5 mt-5 text-[17px] font-bold" style={{ color: colors.navy }}>
        Contact Details
      </Text>
      <Card className="px-4">
        <Pressable className="flex-row items-center py-3.5" onPress={() => openContactChange("email")}>
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: "#E6F1FD" }}
          >
            <Ionicons name="mail-outline" size={18} color={colors.blue} />
          </View>
          <View className="ml-3 min-w-0 flex-1">
            <Text className="text-[12px] text-slate-500">Email address</Text>
            <Text className="mt-0.5 text-[13px] font-semibold" style={{ color: colors.navy }}>
              {saved.email || "Email not available"}
            </Text>
          </View>
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </Pressable>
        <Pressable className="flex-row items-center border-t py-3.5" style={{ borderTopColor: colors.border }} onPress={() => openContactChange("mobile")}>
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: "#E6F7EF" }}
          >
            <Ionicons name="call-outline" size={18} color={colors.primary} />
          </View>
          <View className="ml-3 min-w-0 flex-1">
            <Text className="text-[12px] text-slate-500">Mobile number</Text>
            <Text className="mt-0.5 text-[13px] font-semibold" style={{ color: colors.navy }}>
              {saved.mobile || "Mobile not available"}
            </Text>
          </View>
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </Pressable>
      </Card>

      <Modal visible={contactType !== null} transparent animationType="none" onRequestClose={closeContactSheet}>
        <Animated.View
          className="flex-1 justify-end"
          style={{
            backgroundColor: "rgba(15,44,82,0.35)",
            paddingBottom: keyboardOffset,
            opacity: sheetOpacity,
          }}
        >
          <Animated.View
            className="max-h-[88%] rounded-t-3xl bg-white px-5 pb-8 pt-5"
            style={{ transform: [{ translateY: sheetTranslateY }] }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              bounces={false}
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
            >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[19px] font-bold" style={{ color: colors.navy }}>
                Change {contactType === "email" ? "email" : "mobile number"}
              </Text>
              <Pressable disabled={contactBusy} onPress={closeContactSheet}>
                <Ionicons name="close" size={24} color={colors.slate500} />
              </Pressable>
            </View>
            {contactStep === "value" ? (
              <>
                <Text className="mb-2 text-[13px] text-slate-500">
                  {contactType === "email"
                    ? "We will send one OTP to your current email and another to the new email."
                    : "We will send an OTP to your current email to verify this change."}
                </Text>
                <TextInput
                  value={contactValue}
                  onChangeText={setContactValue}
                  placeholder={contactType === "email" ? "New email address" : "New mobile number"}
                  keyboardType={contactType === "email" ? "email-address" : "phone-pad"}
                  autoCapitalize="none"
                  className="rounded-xl border px-3 py-3 text-[15px]"
                  style={{ borderColor: colors.border, color: colors.navy }}
                />
                <Pressable disabled={contactBusy} onPress={sendContactCode} className="mt-4 items-center rounded-xl py-3.5" style={{ backgroundColor: colors.primary }}>
                  <Text className="font-bold text-white">{contactBusy ? "Sending..." : "Send verification code"}</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text className="mb-3 text-[13px] text-slate-500">
                  Enter the OTP sent to your current email{contactType === "email" ? " and the OTP sent to your new email" : ""}.
                </Text>
                <TextInput value={currentCode} onChangeText={setCurrentCode} placeholder="Current email OTP" keyboardType="number-pad" maxLength={6} className="mb-3 rounded-xl border px-3 py-3 text-[15px]" style={{ borderColor: colors.border, color: colors.navy }} />
                {contactType === "email" && (
                  <TextInput value={newCode} onChangeText={setNewCode} placeholder="New email OTP" keyboardType="number-pad" maxLength={6} className="rounded-xl border px-3 py-3 text-[15px]" style={{ borderColor: colors.border, color: colors.navy }} />
                )}
                <Pressable disabled={contactBusy} onPress={verifyContactCode} className="mt-4 items-center rounded-xl py-3.5" style={{ backgroundColor: colors.primary }}>
                  <Text className="font-bold text-white">{contactBusy ? "Verifying..." : "Verify and update"}</Text>
                </Pressable>
                <Pressable disabled={contactBusy} onPress={() => setContactStep("value")} className="mt-3 items-center py-2">
                  <Text className="font-semibold" style={{ color: colors.primary }}>Use a different value</Text>
                </Pressable>
              </>
            )}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Account settings */}
      <Text className="mb-2.5 mt-5 text-[17px] font-bold" style={{ color: colors.navy }}>
        {tr("profile.accountSettings")}
      </Text>
      <Card className="px-4">
        {SETTINGS.map((r, i) => (
          <Pressable
            key={r.id}
            onPress={() => {
              if (r.id === "language") setShowLanguage(true);
              if (r.id === "logout") logout();
            }}
            className="flex-row items-center py-3.5"
            style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border }}
          >
            <Ionicons name={r.icon} size={18} color={r.danger ? "#E11D48" : colors.primary} />
            <Text
              className="ml-3 flex-1 text-[14px] font-semibold"
              style={{ color: r.danger ? "#E11D48" : colors.navy }}
            >
              {tr(r.label)}
            </Text>
            {r.id === "language" && (
              <Text className="mr-2 text-[13px] text-slate-500">{LANGUAGE_NAMES[lang]}</Text>
            )}
            {!r.danger && <Ionicons name="chevron-forward" size={16} color={colors.slate400} />}
          </Pressable>
        ))}
      </Card>

      </ScrollView>

      {toast && (
        <Animated.View
          className="absolute bottom-24 left-4 right-4 flex-row items-center rounded-2xl px-4 py-3.5"
          style={{
            backgroundColor: toast.error ? "#BE123C" : colors.navy,
            opacity: toastAnimation,
            transform: [{
              translateY: toastAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            }],
            shadowColor: "#0F2C52",
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
          }}
        >
          <Ionicons
            name={toast.error ? "alert-circle-outline" : "checkmark-circle-outline"}
            size={20}
            color="#fff"
          />
          <Text className="ml-2.5 flex-1 text-[13px] font-semibold text-white">
            {toast.message}
          </Text>
        </Animated.View>
      )}

      <OptionSheet
        visible={picking !== null}
        title={pickField ? tr(pickField.label) : ""}
        options={pickOptions ?? []}
        value={picking ? draft[picking] : undefined}
        onSelect={(_id, label) => picking && setDraft((d) => ({ ...d, [picking]: label }))}
        onClose={() => setPicking(null)}
      />

      <LanguageSheet visible={showLanguage} onClose={() => setShowLanguage(false)} />
    </View>
  );
}
