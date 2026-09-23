import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { AppHeader, Card, CTA, Field, ScreenWash, NoteBar } from "../components/ui";
import Stepper from "../components/Stepper";

type Slot = { key: string; label: string; hint: string };

const SUPPORTING: Slot[] = [
  { key: "doc1", label: "Document 1 Name", hint: "e.g. Aadhaar Card" },
  { key: "doc2", label: "Document 2 Name", hint: "e.g. Income Certificate" },
  { key: "doc3", label: "Document 3 Name", hint: "e.g. Previous Treatment" },
];

export default function DocumentsUpload({ navigation }: { navigation: any }) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [names, setNames] = useState<Record<string, string>>({});

  const pick = async (key: string) => {
    const r = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: ["application/pdf", "image/*"],
    });
    if (!r.canceled) {
      setPicked((prev) => ({ ...prev, [key]: r.assets[0].name }));
    }
  };

  const medical = picked.medical;

  return (
    <ScreenWash>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <AppHeader
          onBack={() => navigation.goBack()}
          right={
            <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: "#E6F1FD" }}>
              <Text className="text-[12px] font-bold" style={{ color: colors.navy }}>
                Step 2 of 3
              </Text>
            </View>
          }
        />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-center text-[30px] font-extrabold" style={{ color: colors.navy }}>
            Upload Your Documents
          </Text>
          <Text className="mt-1 px-8 text-center text-[14px] leading-5 text-slate-500">
            Upload your medical report and up to 3 supporting documents. (JPG, PNG, PDF)
          </Text>

          <View className="mt-5 px-6">
            <Stepper current={2} />
          </View>

          <View className="mt-5 px-4">
            <Card className="p-4">
              {/* Required medical report */}
              <Text className="mb-2 text-[14px] font-bold" style={{ color: colors.pink }}>
                1. Medical Report (Required)
              </Text>
              <Pressable
                onPress={() => pick("medical")}
                className="items-center rounded-2xl border-2 border-dashed px-4 py-7"
                style={{
                  borderColor: medical ? colors.primary : "#F3B8C6",
                  backgroundColor: medical ? "#E6F7EF" : "#FDECEF",
                }}
              >
                <Ionicons
                  name={medical ? "checkmark-circle" : "cloud-upload-outline"}
                  size={30}
                  color={medical ? colors.primary : colors.pink}
                />
                <Text
                  className="mt-2 text-[14px] font-bold"
                  style={{ color: medical ? colors.primary : colors.navy }}
                >
                  {medical ?? "Upload Medical Report"}
                </Text>
                <Text className="mt-0.5 text-[12px] text-slate-500">
                  {medical ? "Tap to replace" : "(Cancer report, diagnosis, etc.)"}
                </Text>
              </Pressable>

              {/* Optional supporting documents */}
              <Text className="mb-3 mt-5 text-[14px] font-bold" style={{ color: colors.navy }}>
                2. Supporting Documents{" "}
                <Text className="font-normal text-slate-500">(Optional)</Text>
              </Text>

              {SUPPORTING.map((s) => {
                const file = picked[s.key];
                return (
                  <View key={s.key} className="mb-3 flex-row items-end">
                    <View className="flex-1">
                      <Field
                        label={s.label}
                        placeholder={s.hint}
                        value={names[s.key] ?? ""}
                        onChangeText={(t) => setNames((p) => ({ ...p, [s.key]: t }))}
                      />
                    </View>
                    <View className="w-3" />
                    <Pressable
                      onPress={() => pick(s.key)}
                      className="items-center rounded-2xl px-4 py-2.5"
                      style={{ backgroundColor: file ? "#E6F7EF" : "#EEF4FA" }}
                    >
                      <Ionicons
                        name={file ? "checkmark-circle" : "cloud-upload-outline"}
                        size={19}
                        color={colors.primary}
                      />
                      <Text
                        className="mt-0.5 text-[12px] font-bold"
                        style={{ color: colors.primary }}
                      >
                        {file ? "Added" : "Upload"}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}

              {!!Object.keys(picked).length && (
                <NoteBar
                  icon="checkmark-circle"
                  text={`${Object.keys(picked).length} file(s) attached. They stay on your device in this prototype.`}
                />
              )}

              <View className="mt-5">
                <CTA
                  label="Continue"
                  chevron
                  onPress={() => navigation.replace("Main")}
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWash>
  );
}
