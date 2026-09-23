import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { hospitals } from "../data/hospitals";
import HospitalCard from "../components/HospitalCard";
import LocationSheet from "../components/LocationSheet";
import { useLocation } from "../location";
import { useT } from "../i18n";
import {
  Card,
  IconTile,
  SectionTitle,
  ScriptText,
  type IconName,
} from "../components/ui";

const QUICK: { key: any; icon: IconName; tone: any; tab: string }[] = [
  { key: "nav.hospitals", icon: "business", tone: "sky", tab: "Hospitals" },
  { key: "home.quickNgos", icon: "heart-circle", tone: "rose", tab: "Assistance" },
  { key: "nav.documents", icon: "document-text", tone: "violet", tab: "Documents" },
  { key: "home.quickSupport", icon: "chatbubble-ellipses", tone: "green", tab: "AI" },
];

export default function Home({
  navigation,
  onTab,
}: {
  navigation: any;
  onTab?: (tab: string) => void;
}) {
  const { location } = useLocation();
  const tr = useT();
  const [showLocation, setShowLocation] = useState(false);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: "#E6F1FD" }}
          >
            <Ionicons name="person" size={22} color={colors.blue} />
          </View>
          <View className="ml-3">
            <Text className="text-[12px] text-slate-500">{tr("home.hello")}</Text>
            <Text className="text-[17px] font-bold" style={{ color: colors.navy }}>
              Ravi Sharma
            </Text>
          </View>
        </View>
        <Pressable hitSlop={10}>
          <Ionicons name="notifications-outline" size={24} color={colors.navy} />
          <View
            className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.pink }}
          >
            <Text className="text-[9px] font-bold text-white">3</Text>
          </View>
        </Pressable>
      </View>

      {/* Reassurance banner */}
      <View
        className="mt-4 overflow-hidden rounded-3xl p-5"
        style={{ backgroundColor: colors.lavender }}
      >
        <Text className="text-[22px] font-extrabold" style={{ color: colors.violet }}>
          {tr("home.notAlone")}
        </Text>
        <Text className="mt-1 text-[14px] text-slate-500">
          {tr("home.hereToSupport")}
        </Text>
        <View className="absolute right-4 top-4 opacity-40">
          <Ionicons name="ribbon" size={54} color={colors.violet} />
        </View>
      </View>

      {/* Saved location */}
      <Card className="mt-3 flex-row items-center px-4 py-3.5">
        <Ionicons name="location" size={20} color={colors.primary} />
        <View className="ml-2.5 flex-1">
          <Text className="text-[11px] text-slate-500">{tr("home.yourLocation")}</Text>
          <Text className="text-[14px] font-bold" style={{ color: colors.navy }}>
            {location.city}
            {location.pin && location.pin !== "—" ? ` - ${location.pin}` : ""}
          </Text>
        </View>
        <Pressable hitSlop={8} onPress={() => setShowLocation(true)}>
          <Text className="text-[13px] font-bold" style={{ color: colors.primary }}>
            {tr("common.edit")}
          </Text>
        </Pressable>
      </Card>

      {/* Search */}
      <View className="mt-3 flex-row items-center">
        <View className="flex-1">
          <Card className="flex-row items-center px-4">
            <Ionicons name="search" size={18} color={colors.slate400} />
            <TextInput
              placeholder={tr("home.searchHint")}
              placeholderTextColor={colors.slate400}
              className="flex-1 py-3.5 text-[14px]"
              style={{ color: colors.dark }}
              onFocus={() => onTab?.("Hospitals")}
            />
          </Card>
        </View>
        <Pressable
          onPress={() => onTab?.("Hospitals")}
          className="ml-2 h-[50px] w-[50px] items-center justify-center rounded-2xl"
          style={{ backgroundColor: colors.primary }}
        >
          <Ionicons name="search" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Quick actions */}
      <View className="mt-4 flex-row justify-between">
        {QUICK.map((q) => (
          <Pressable
            key={q.tab}
            onPress={() => (q.tab === "AI" ? navigation.navigate("AISupport") : onTab?.(q.tab))}
            className="items-center"
            style={{ width: "23%" }}
          >
            <IconTile icon={q.icon} tone={q.tone} size={56} radius={28} />
            <Text
              className="mt-1.5 text-[12px] font-semibold"
              style={{ color: colors.navy }}
            >
              {tr(q.key)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Recommended hospitals */}
      <View className="mt-6">
        <SectionTitle
          title={tr("home.recommended")}
          action={tr("common.viewAll")}
          onAction={() => onTab?.("Hospitals")}
        />
        {hospitals.slice(0, 2).map((h) => (
          <HospitalCard
            key={h.id}
            hospital={h}
            onPress={() => navigation.navigate("HospitalDetails", { hospital: h })}
          />
        ))}
      </View>

      {/* AI support entry */}
      <Pressable onPress={() => navigation.navigate("AISupport")} className="mt-2">
        <View
          className="flex-row items-center rounded-3xl p-4"
          style={{ backgroundColor: "#E6F7EF" }}
        >
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#fff" }}
          >
            <Ionicons name="chatbubble-ellipses" size={22} color={colors.primary} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[15px] font-bold" style={{ color: colors.navy }}>
              {tr("home.aiTitle")}
            </Text>
            <Text className="mt-0.5 text-[12px] text-slate-500">
              {tr("home.aiSubtitle")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </View>
      </Pressable>

      <View className="mt-5 items-center">
        <ScriptText size={13} color={colors.slate500}>
          “Better Information · Better Support · Brighter Tomorrows”
        </ScriptText>
      </View>
      <LocationSheet visible={showLocation} onClose={() => setShowLocation(false)} />
    </ScrollView>
  );
}
