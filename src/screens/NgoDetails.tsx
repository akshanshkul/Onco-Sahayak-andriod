import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Linking, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import type { Ngo } from "../data/ngos";
import { useT } from "../i18n";
import {
  AppHeader,
  Card,
  CTA,
  IconTile,
  NoteBar,
  SectionTitle,
  Tag,
  type IconName,
} from "../components/ui";

/** Bulleted list with a leading icon, used for coverage / eligibility / docs. */
function CheckList({
  items,
  icon = "checkmark-circle",
  tint,
}: {
  items: string[];
  icon?: IconName;
  tint?: string;
}) {
  return (
    <Card className="p-4">
      {items.map((t, i) => (
        <View
          key={t}
          className="flex-row items-start py-2.5"
          style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border }}
        >
          <Ionicons
            name={icon}
            size={16}
            color={tint ?? colors.primary}
            style={{ marginTop: 1 }}
          />
          <Text
            className="ml-2.5 flex-1 text-[13.5px] leading-[19px]"
            style={{ color: colors.navy }}
          >
            {t}
          </Text>
        </View>
      ))}
    </Card>
  );
}

/** Numbered steps for the application process. */
function Steps({ items }: { items: string[] }) {
  return (
    <Card className="p-4">
      {items.map((t, i) => (
        <View key={t} className="flex-row items-start pb-3.5">
          <View className="items-center">
            <View
              className="h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-[11px] font-bold text-white">{i + 1}</Text>
            </View>
            {i < items.length - 1 && (
              <View
                className="mt-1 w-[2px] flex-1"
                style={{ backgroundColor: "#D9E8E1", minHeight: 18 }}
              />
            )}
          </View>
          <Text
            className="ml-3 flex-1 text-[13.5px] leading-[19px]"
            style={{ color: colors.navy }}
          >
            {t}
          </Text>
        </View>
      ))}
    </Card>
  );
}

export default function NgoDetails({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const n: Ngo | undefined = route.params?.ngo;
  const [saved, setSaved] = useState(false);
  const tr = useT();

  if (!n) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text style={{ color: colors.navy }}>No organisation selected.</Text>
      </SafeAreaView>
    );
  }

  const isGov = n.kind === "Government";

  return (
    <SafeAreaView className="flex-1" edges={["top"]} style={{ backgroundColor: colors.bg }}>
      <AppHeader
        onBack={() => navigation.goBack()}
        right={
          <View className="flex-row items-center">
            <Pressable onPress={() => setSaved((v) => !v)} hitSlop={8}>
              <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={21}
                color={saved ? colors.primary : colors.navy}
              />
            </Pressable>
            <Pressable
              className="ml-4"
              hitSlop={8}
              onPress={() =>
                Share.share({
                  message: `${n.name} — ${n.summary} (${n.amountLabel}: ${n.amount}). More: ${n.website}`,
                })
              }
            >
              <Ionicons name="share-social-outline" size={21} color={colors.navy} />
            </Pressable>
          </View>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* Identity */}
        <View className="px-4">
          <Card className="p-4">
            <View className="flex-row">
              <View
                className="h-[62px] w-[62px] items-center justify-center rounded-2xl"
                style={{ backgroundColor: "#F5F8FB" }}
              >
                <IconTile icon={n.logoIcon} tone={n.logoTone} size={46} radius={14} />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[18px] font-extrabold" style={{ color: colors.navy }}>
                  {n.name}
                </Text>
                <View className="mt-1.5 flex-row">
                  <Tag label={n.kindLabel} tone={isGov ? "green" : "rose"} />
                </View>
                <View className="mt-1.5 flex-row items-start">
                  <Ionicons name="location-outline" size={12} color={colors.slate400} />
                  <Text className="ml-1 flex-1 text-[11.5px] text-slate-500">{n.region}</Text>
                </View>
              </View>
            </View>

            {/* Headline numbers */}
            <View className="mt-3.5 flex-row">
              <View
                className="flex-1 items-center rounded-2xl px-3 py-2.5"
                style={{ backgroundColor: "#E6F7EF" }}
              >
                <Text className="text-[10.5px] text-slate-500">{n.amountLabel}</Text>
                <Text
                  className="mt-0.5 text-center text-[14px] font-extrabold"
                  style={{ color: colors.primary }}
                >
                  {n.amount}
                </Text>
              </View>
              <View className="w-2.5" />
              <View
                className="flex-1 items-center rounded-2xl px-3 py-2.5"
                style={{ backgroundColor: "#E6F1FD" }}
              >
                <Text className="text-[10.5px] text-slate-500">{tr("ngo.processingTime")}</Text>
                <Text
                  className="mt-0.5 text-center text-[14px] font-extrabold"
                  style={{ color: colors.blue }}
                >
                  {n.processingTime}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* About */}
        <View className="mt-5 px-4">
          <SectionTitle title={tr("ngo.about")} icon="information-circle-outline" />
          <Card className="p-4">
            <Text className="text-[13.5px] leading-[20px] text-slate-600">{n.about}</Text>
          </Card>
        </View>

        {/* Coverage */}
        <View className="mt-5 px-4">
          <SectionTitle title={tr("ngo.covered")} icon="shield-checkmark-outline" />
          <CheckList items={n.coverage} />
        </View>

        {/* Eligibility */}
        <View className="mt-5 px-4">
          <SectionTitle title={tr("ngo.eligibility")} icon="person-circle-outline" />
          <CheckList items={n.eligibility} icon="ellipse" />
        </View>

        {/* Documents */}
        <View className="mt-5 px-4">
          <SectionTitle title={tr("ngo.documents")} icon="document-text-outline" />
          <CheckList items={n.documents} icon="document-attach-outline" tint={colors.blue} />
        </View>

        {/* How to apply */}
        <View className="mt-5 px-4">
          <SectionTitle title={tr("ngo.howToApply")} icon="footsteps-outline" />
          <Steps items={n.howToApply} />
        </View>

        {/* Contact */}
        <View className="mt-5 px-4">
          <SectionTitle title={tr("ngo.contact")} icon="call-outline" />
          <Card className="p-2">
            <Pressable
              onPress={() => Linking.openURL(`tel:${n.phone.replace(/\s/g, "")}`)}
              className="flex-row items-center p-2.5"
            >
              <IconTile icon="call" tone="green" size={38} radius={12} />
              <View className="ml-3 flex-1">
                <Text className="text-[11px] text-slate-500">{tr("ngo.helpline")}</Text>
                <Text className="text-[14px] font-bold" style={{ color: colors.navy }}>
                  {n.phone}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={colors.slate400} />
            </Pressable>

            <View className="h-px" style={{ backgroundColor: colors.border }} />

            <Pressable
              onPress={() => Linking.openURL(`https://${n.website}`)}
              className="flex-row items-center p-2.5"
            >
              <IconTile icon="globe-outline" tone="sky" size={38} radius={12} />
              <View className="ml-3 flex-1">
                <Text className="text-[11px] text-slate-500">{tr("ngo.website")}</Text>
                <Text className="text-[14px] font-bold" style={{ color: colors.navy }}>
                  {n.website}
                </Text>
              </View>
              <Ionicons name="open-outline" size={17} color={colors.slate400} />
            </Pressable>
          </Card>
        </View>

        {/* Actions */}
        <View className="mt-6 flex-row px-4">
          <View className="flex-1">
            <CTA
              label={tr("ngo.callHelpline")}
              variant="outline"
              icon="call"
              onPress={() => Linking.openURL(`tel:${n.phone.replace(/\s/g, "")}`)}
            />
          </View>
          <View className="w-3" />
          <View className="flex-1">
            <CTA
              label={tr("ngo.startApplication")}
              chevron
              onPress={() => Linking.openURL(`https://${n.website}`)}
            />
          </View>
        </View>

        <View className="px-4">
          <NoteBar
            tone="amber"
            icon="alert-circle"
            text={tr("ngo.disclaimer")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
