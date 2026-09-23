import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { hospitals, hospitalFilters } from "../data/hospitals";
import HospitalCard from "../components/HospitalCard";
import { Card, Chip } from "../components/ui";
import { useT } from "../i18n";

export default function Hospitals({ navigation }: { navigation: any }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Nearest");
  const tr = useT();

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const matched = hospitals.filter((h) =>
      `${h.name} ${h.city} ${h.specialty} ${h.pin}`.toLowerCase().includes(needle)
    );

    if (filter === "Government" || filter === "Private") {
      return matched.filter((h) => h.kind === filter);
    }
    if (filter === "Best Rated") {
      return [...matched].sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    // "Nearest" — the distance strings are authored shortest-first, so parse them.
    return [...matched].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [q, filter]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-row items-center">
        <Ionicons name="business" size={22} color={colors.primary} />
        <Text className="ml-2 text-[24px] font-extrabold" style={{ color: colors.navy }}>
          {tr("hospitals.title")}
        </Text>
      </View>
      <Text className="mt-0.5 text-[13px] text-slate-500">
        {tr("hospitals.near")} Kaithal, Haryana · 136027
      </Text>

      <Card className="mt-4 flex-row items-center px-4">
        <Ionicons name="search" size={18} color={colors.slate400} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={tr("hospitals.searchHint")}
          placeholderTextColor={colors.slate400}
          className="flex-1 py-3.5 text-[14px]"
          style={{ color: colors.dark }}
        />
        {!!q && (
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.slate400}
            onPress={() => setQ("")}
          />
        )}
      </Card>

      <View className="mt-4 flex-row flex-wrap">
        {hospitalFilters.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>

      <Text className="mb-3 mt-1 text-[12px] text-slate-500">
        {list.length} {tr("hospitals.title")} {tr("hospitals.found")}
      </Text>

      {list.map((h) => (
        <HospitalCard
          key={h.id}
          hospital={h}
          onPress={() => navigation.navigate("HospitalDetails", { hospital: h })}
        />
      ))}

      {list.length === 0 && (
        <Card className="items-center px-5 py-10">
          <Ionicons name="search" size={30} color={colors.slate400} />
          <Text className="mt-2 text-[15px] font-bold" style={{ color: colors.navy }}>
            {tr("hospitals.none")}
          </Text>
          <Text className="mt-1 text-center text-[13px] text-slate-500">
            {tr("hospitals.noneHint")}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}
