import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Card, ScriptText, type IconName } from "../components/ui";
import { OptionSheet } from "../components/pickers";
import { GENDERS } from "../data/options";
import LanguageSheet from "../components/LanguageSheet";
import { useT, useI18n, LANGUAGE_NAMES } from "../i18n";
import type { StringKey } from "../i18n";
import Logo from "../components/Logo";

type FieldKey = "fullName" | "dob" | "gender" | "location" | "bloodGroup" | "condition";

/** Field schema. `pick` marks a value chosen from a list rather than typed. */
const PERSONAL: { key: FieldKey; icon: IconName; label: StringKey; pick?: string[] }[] = [
  { key: "fullName", icon: "person-outline", label: "signup.fullName" },
  { key: "dob", icon: "calendar-outline", label: "signup.dob" },
  { key: "gender", icon: "male-female-outline", label: "signup.gender", pick: GENDERS },
  { key: "location", icon: "location-outline", label: "profile.location" },
  {
    key: "bloodGroup",
    icon: "water-outline",
    label: "profile.bloodGroup",
    pick: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  { key: "condition", icon: "document-text-outline", label: "profile.condition" },
];

const INITIAL: Record<FieldKey, string> = {
  fullName: "Ravi Sharma",
  dob: "12 March 1985",
  gender: "Male",
  location: "Kaithal, Haryana - 136027",
  bloodGroup: "B+",
  condition: "Breast Cancer (Stage II)",
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
  const [saved, setSaved] = useState<Record<FieldKey, string>>(INITIAL);
  // `draft` holds unsaved edits so Cancel can discard them cleanly.
  const [draft, setDraft] = useState<Record<FieldKey, string>>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [picking, setPicking] = useState<FieldKey | null>(null);
  const [showLanguage, setShowLanguage] = useState(false);

  const tr = useT();
  const { lang } = useI18n();

  const startEdit = () => {
    setDraft(saved);
    setEditing(true);
  };
  const cancelEdit = () => {
    setDraft(saved);
    setEditing(false);
  };
  const commit = () => {
    if (!draft.fullName.trim()) {
      Alert.alert(tr("profile.nameRequired"));
      return;
    }
    setSaved(draft);
    setEditing(false);
  };

  const pickField = PERSONAL.find((f) => f.key === picking);

  return (
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
      <View className="mt-4 flex-row items-center">
        <View>
          <View
            className="h-[74px] w-[74px] items-center justify-center rounded-full"
            style={{ backgroundColor: "#E6F1FD" }}
          >
            <Ionicons name="person" size={36} color={colors.blue} />
          </View>
          <View
            className="absolute -bottom-0.5 -right-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Ionicons name="camera" size={13} color="#fff" />
          </View>
        </View>

        <View className="ml-3.5 flex-1">
          <Text className="text-[19px] font-extrabold" style={{ color: colors.navy }}>
            {saved.fullName}
          </Text>
          <Text className="text-[13px] text-slate-500">{tr("profile.patient")}</Text>
          <View className="mt-1.5 flex-row items-center">
            <Ionicons name="mail-outline" size={13} color={colors.slate400} />
            <Text className="ml-1.5 text-[12.5px] text-slate-500">ravi.sharma@gmail.com</Text>
          </View>
          <View className="mt-0.5 flex-row items-center">
            <Ionicons name="call-outline" size={13} color={colors.slate400} />
            <Text className="ml-1.5 text-[12.5px] text-slate-500">+91 98765 43210</Text>
          </View>
        </View>

        {editing ? (
          <View className="items-end">
            <Pressable
              onPress={commit}
              className="flex-row items-center rounded-2xl px-3 py-2.5"
              style={{ backgroundColor: colors.primary }}
            >
              <Ionicons name="checkmark" size={15} color="#fff" />
              <Text className="ml-1 text-[12.5px] font-bold text-white">
                {tr("common.save")}
              </Text>
            </Pressable>
            <Pressable onPress={cancelEdit} className="mt-1.5 px-1" hitSlop={8}>
              <Text className="text-[12px] font-semibold text-slate-500">
                {tr("common.cancel")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={startEdit}
            className="flex-row items-center rounded-2xl border px-3 py-2.5"
            style={{ borderColor: colors.border, backgroundColor: "#fff" }}
          >
            <Ionicons name="create-outline" size={15} color={colors.primary} />
            <Text className="ml-1 text-[12.5px] font-bold" style={{ color: colors.primary }}>
              {tr("profile.editProfile")}
            </Text>
          </Pressable>
        )}
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
      <Text className="mb-2.5 mt-5 text-[17px] font-bold" style={{ color: colors.navy }}>
        {tr("profile.personalInfo")}
      </Text>
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

      {/* Account settings */}
      <Text className="mb-2.5 mt-5 text-[17px] font-bold" style={{ color: colors.navy }}>
        {tr("profile.accountSettings")}
      </Text>
      <Card className="px-4">
        {SETTINGS.map((r, i) => (
          <Pressable
            key={r.id}
            onPress={() => r.id === "language" && setShowLanguage(true)}
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

      <OptionSheet
        visible={picking !== null}
        title={pickField ? tr(pickField.label) : ""}
        options={pickField?.pick ?? []}
        value={picking ? draft[picking] : undefined}
        onSelect={(_id, label) => picking && setDraft((d) => ({ ...d, [picking]: label }))}
        onClose={() => setPicking(null)}
      />

      <LanguageSheet visible={showLanguage} onClose={() => setShowLanguage(false)} />
    </ScrollView>
  );
}
