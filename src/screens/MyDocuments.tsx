import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import {
  documents as seed,
  docFilters,
  otherCategories,
  type Doc,
} from "../data/documents";
import { Card, Chip, IconTile, NoteBar, Tag } from "../components/ui";
import Logo from "../components/Logo";
import { useT } from "../i18n";

export default function MyDocuments() {
  const [docs, setDocs] = useState<Doc[]>(seed);
  const [filter, setFilter] = useState("All");
  const tr = useT();

  const list = useMemo(() => {
    if (filter === "All") return docs;
    if (filter === "Other") return docs.filter((d) => otherCategories.includes(d.category));
    return docs.filter((d) => d.category === filter);
  }, [docs, filter]);

  const upload = async () => {
    const r = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (r.canceled) return;
    const a = r.assets[0];
    const isImage = /\.(jpg|jpeg|png|heic|webp)$/i.test(a.name);
    setDocs((prev) => [
      {
        id: String(Date.now()),
        name: a.name,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        size: a.size ? `${(a.size / 1024 / 1024).toFixed(1)} MB` : "—",
        category: "Other",
        icon: isImage ? "image" : "document-text",
        tone: isImage ? "mint" : "rose",
      },
      ...prev,
    ]);
  };

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

      <View className="mt-4 flex-row items-center justify-between">
        <Text
          className="flex-1 text-[24px] font-extrabold"
          style={{ color: colors.navy }}
          numberOfLines={1}
        >
          {tr("docs.title")}
        </Text>
        <Pressable
          onPress={upload}
          className="ml-2 flex-row items-center rounded-2xl px-3 py-2.5"
          style={{ backgroundColor: colors.primary }}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text className="ml-1 text-[12.5px] font-bold text-white">{tr("upload.upload")}</Text>
        </Pressable>
      </View>
      <Text className="mt-1 text-[13px] leading-[18px] text-slate-500">
        {tr("docs.subtitle")}
      </Text>

      {/* Filters */}
      <View className="mt-4 flex-row flex-wrap">
        {docFilters.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>

      {/* List */}
      <View className="mt-1">
        {list.map((d) => (
          <Card key={d.id} className="mb-2.5 flex-row items-center p-3.5">
            <IconTile icon={d.icon} tone={d.tone} size={42} radius={12} />
            <View className="ml-3 flex-1">
              <Text
                className="text-[14.5px] font-bold"
                style={{ color: colors.navy }}
                numberOfLines={1}
              >
                {d.name}
              </Text>
              <Text className="mt-0.5 text-[12px] text-slate-500">
                {d.date} · {d.size}
              </Text>
            </View>
            <View className="mr-2">
              <Tag
                label={d.category}
                tone={
                  d.category === "Reports"
                    ? "violet"
                    : d.category === "Prescriptions"
                      ? "rose"
                      : d.category === "Insurance"
                        ? "sky"
                        : "mint"
                }
              />
            </View>
            <Pressable
              hitSlop={8}
              onPress={() =>
                Alert.alert(d.name, "Choose an action", [
                  { text: "Open" },
                  { text: "Share" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => setDocs((p) => p.filter((x) => x.id !== d.id)),
                  },
                  { text: "Cancel", style: "cancel" },
                ])
              }
            >
              <Ionicons name="ellipsis-vertical" size={18} color={colors.slate400} />
            </Pressable>
          </Card>
        ))}

        {list.length === 0 && (
          <Card className="items-center px-5 py-10">
            <Ionicons name="folder-open-outline" size={32} color={colors.slate400} />
            <Text className="mt-2 text-[15px] font-bold" style={{ color: colors.navy }}>
              {tr("docs.empty")}
            </Text>
            <Text className="mt-1 text-center text-[13px] text-slate-500">
              {tr("docs.emptyHint")}
            </Text>
          </Card>
        )}
      </View>

      <NoteBar
        icon="shield-checkmark"
        text={tr("docs.secure")}
      />
    </ScrollView>
  );
}
