import React, { useMemo, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { IMG } from "../assets";
import { ngos, assistanceFilters, assistanceFilterMap, type Ngo } from "../data/ngos";
import { Card, Chip, IconTile, LocationPill, Tag } from "../components/ui";
import { OptionSheet } from "../components/pickers";
import LocationSheet from "../components/LocationSheet";
import { useT } from "../i18n";

const SORTS = [
  "Recommended",
  "Highest support first",
  "Name (A-Z)",
  "Haryana first",
];

/** Parses the leading rupee figure out of an amount label for sorting. */
function amountValue(n: Ngo): number {
  const digits = n.amount.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function NgoCard({ n, onPress }: { n: Ngo; onPress: () => void }) {
  const tr = useT();
  return (
    <Pressable onPress={onPress}>
      <Card className="mb-3 p-3.5">
      <View className="flex-row">
        {/* Logo slot */}
        <View
          className="h-[52px] w-[52px] items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#F5F8FB" }}
        >
          <IconTile icon={n.logoIcon} tone={n.logoTone} size={38} radius={12} />
        </View>

        <View className="ml-2.5 flex-1">
          <Text className="text-[14.5px] font-bold" style={{ color: colors.navy }}>
            {n.name}
          </Text>
          <View className="mt-1 flex-row">
            <Tag label={n.kindLabel} tone={n.kind === "Government" ? "green" : "rose"} />
          </View>
          <Text className="mt-1.5 text-[12px] leading-[16px] text-slate-500">
            {n.summary}
          </Text>
        </View>
      </View>

      <View className="mt-2">
        <View className="flex-row items-start">
          <Ionicons name="location-outline" size={12} color={colors.slate400} />
          <Text className="ml-1 flex-1 text-[11.5px] text-slate-500">{n.region}</Text>
        </View>
        <View className="mt-0.5 flex-row items-start">
          <Ionicons name="document-text-outline" size={12} color={colors.slate400} />
          <Text className="ml-1 flex-1 text-[11.5px] text-slate-500">{n.covers}</Text>
        </View>
      </View>

      <View className="mt-2.5 flex-row items-center">
        <View
          className="flex-1 flex-row items-center rounded-2xl px-3 py-2"
          style={{ backgroundColor: "#E6F7EF" }}
        >
          <Text className="text-[10.5px] text-slate-500">{n.amountLabel} </Text>
          <Text className="flex-1 text-[10.5px] font-extrabold" style={{ color: colors.primary }}>
            {n.amount}
          </Text>
        </View>

        <Pressable
          onPress={onPress}
          className="ml-2 flex-row items-center rounded-2xl px-3 py-2.5"
          style={{ backgroundColor: "#EAF4EF" }}
        >
          <Text className="text-[10.5px] font-bold" style={{ color: colors.primary }}>
            {tr("common.viewDetails")}
          </Text>
          <Ionicons name="arrow-forward" size={12} color={colors.primary} />
        </Pressable>
        </View>
      </Card>
    </Pressable>
  );
}

export default function Assistance({ navigation }: { navigation: any }) {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(SORTS[0]);
  const [showSort, setShowSort] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const tr = useT();

  const list = useMemo(() => {
    const kinds = assistanceFilterMap[filter];
    const needle = q.trim().toLowerCase();
    const matched = ngos.filter((n) => {
      const kindOk = !kinds || kinds.includes(n.kind);
      const textOk = `${n.name} ${n.summary} ${n.region} ${n.covers}`
        .toLowerCase()
        .includes(needle);
      return kindOk && textOk;
    });

    if (sort === "Highest support first") {
      return [...matched].sort((a, b) => amountValue(b) - amountValue(a));
    }
    if (sort === "Name (A-Z)") {
      return [...matched].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "Haryana first") {
      return [...matched].sort(
        (a, b) => Number(b.region.includes("Haryana")) - Number(a.region.includes("Haryana"))
      );
    }
    return matched;
  }, [filter, q, sort]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-row items-center justify-end px-4 pb-2 pt-1">
        <LocationPill onPress={() => setShowLocation(true)} />
      </View>

      {/* Hero */}
      <View className="px-4">
        <View
          className="overflow-hidden"
          style={{ height: 186, borderRadius: 22, backgroundColor: "#E6F7F1" }}
        >
          {/* Clasped-hands photo from the design (carries its own script text) */}
          <Image
            source={IMG.assistHands}
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "42%" }}
            resizeMode="cover"
          />
          <View className="absolute bottom-4 left-4 top-4 w-[57%] justify-center">
            <Text
              className="text-[22px] font-extrabold"
              style={{ color: colors.navy, lineHeight: 27 }}
            >
              {tr("assist.heroTitle")}
            </Text>
            <Text className="mt-1.5 text-[12px] leading-[16px] text-slate-600">
              {tr("assist.heroSubtitle")}
            </Text>
            <View className="mt-2 flex-row items-start">
              <Ionicons name="chatbox-ellipses" size={12} color={colors.primary} />
              <Text
                className="ml-1 flex-1 text-[11.5px] font-semibold"
                style={{ color: colors.primary, lineHeight: 15 }}
              >
                {tr("assist.quote")}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View className="mt-4 flex-row flex-wrap px-4">
        {assistanceFilters.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>

      {/* Search */}
      <View className="mt-1 flex-row items-center px-4">
        <View className="flex-1">
          <Card className="flex-row items-center px-4">
            <Ionicons name="search" size={18} color={colors.slate400} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={tr("assist.searchHint")}
              placeholderTextColor={colors.slate400}
              className="flex-1 py-3.5 text-[13.5px]"
              style={{ color: colors.dark }}
            />
          </Card>
        </View>
        <Pressable
          onPress={() => setShowSort(true)}
          className="ml-2 flex-row items-center rounded-2xl px-3.5 py-3.5"
          style={{ backgroundColor: sort === SORTS[0] ? "#EEF4FA" : "#E6F7EF" }}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={sort === SORTS[0] ? colors.navy : colors.primary}
          />
          <Text
            className="ml-1.5 text-[13px] font-semibold"
            style={{ color: sort === SORTS[0] ? colors.navy : colors.primary }}
          >
            {tr("common.sort")}
          </Text>
        </Pressable>
      </View>

      {/* Results */}
      <View className="mt-4 px-4">
        <Text className="mb-2 text-[12px] text-slate-500">
          {list.length} {list.length === 1 ? tr("common.result") : tr("common.results")}
          {filter !== "All" ? ` in ${filter}` : ""}
        </Text>
        {list.map((n) => (
          <NgoCard
            key={n.id}
            n={n}
            onPress={() => navigation.navigate("NgoDetails", { ngo: n })}
          />
        ))}

        {list.length === 0 && (
          <Card className="items-center px-5 py-10">
            <Ionicons name="search" size={30} color={colors.slate400} />
            <Text className="mt-2 text-[15px] font-bold" style={{ color: colors.navy }}>
              {tr("common.noMatches")}
            </Text>
            <Text className="mt-1 text-center text-[13px] text-slate-500">
              {tr("common.tryAnother")}
            </Text>
          </Card>
        )}
      </View>

      {/* Guidance CTA */}
      <View className="mt-1 px-4">
        <View
          className="flex-row items-center rounded-3xl p-4"
          style={{ backgroundColor: "#FDECEF" }}
        >
          <Ionicons name="heart-circle" size={30} color={colors.pink} />
          <View className="ml-2.5 flex-1">
            <Text className="text-[14px] font-bold" style={{ color: colors.navy }}>
              {tr("assist.needHelp")}
            </Text>
            <Text className="mt-0.5 text-[12px] text-slate-500">
              {tr("assist.needHelpText")}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("AISupport")}
            className="flex-row items-center rounded-full bg-white px-3 py-2.5"
          >
            <Text className="text-[12px] font-bold" style={{ color: colors.pink }}>
              {tr("assist.getGuidance")}
            </Text>
            <Ionicons name="arrow-forward" size={13} color={colors.pink} />
          </Pressable>
        </View>
      </View>
      <LocationSheet visible={showLocation} onClose={() => setShowLocation(false)} />

      <OptionSheet
        visible={showSort}
        title={tr("common.sortBy")}
        options={SORTS}
        value={sort}
        onSelect={(_id, label) => setSort(label)}
        onClose={() => setShowSort(false)}
      />
    </ScrollView>
  );
}
