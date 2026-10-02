import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { hospitalFilters, type Hospital } from "../data/hospitals";
import HospitalCard from "../components/HospitalCard";
import { Card, Chip, LocationPill, SkeletonCard } from "../components/ui";
import LocationSheet from "../components/LocationSheet";
import { useT } from "../i18n";
import { clearCatalogCache, getHospitals } from "../services/api";

export default function Hospitals({ navigation }: { navigation: any }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Nearest");
  const [showLocation, setShowLocation] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const tr = useT();

  const loadHospitals = async (hardRefresh = false) => {
    if (hardRefresh) {
      clearCatalogCache();
      setRefreshing(true);
    }
    try {
      const items = await getHospitals();
      setHospitals(items
        .filter((item) => item && typeof item.name === "string")
        .map((item) => ({
          ...item,
          city: item.city || "",
          pin: item.pin || "",
          distance: item.distance || "Distance unavailable",
          rating: item.rating || "—",
          reviews: Number(item.reviews || 0),
          specialty: item.specialty || "Cancer Care",
          kind: item.kind === "Government" ? "Government" : "Private",
          driveTime: item.driveTime || item.drive_time || "",
          photoCount: item.photoCount || item.photo_count || 1,
          departments: item.departments || [],
          specialties: item.specialties || [],
          costs: item.costs || [],
          doctors: item.doctors || [],
          facilities: item.facilities || [],
          schemes: item.schemes || [],
          website: item.website || "",
          contactEmail: item.contactEmail || item.contact_email || "",
          emergencyPhone: item.emergencyPhone || item.emergency_phone || "",
          hours: item.hours || "",
          bannerUrl: item.bannerUrl || item.banner_url || "",
        })) as Hospital[]);
    } catch {
      setHospitals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadHospitals();
  }, []);

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
    return [...matched].sort((a, b) => {
      const distanceA = parseFloat(a.distance);
      const distanceB = parseFloat(b.distance);
      if (!Number.isFinite(distanceA) && !Number.isFinite(distanceB)) return 0;
      if (!Number.isFinite(distanceA)) return 1;
      if (!Number.isFinite(distanceB)) return -1;
      return distanceA - distanceB;
    });
  }, [hospitals, q, filter]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadHospitals(true)} tintColor={colors.primary} colors={[colors.primary]} />}
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-row items-center justify-end px-0 pb-2 pt-1">
        <LocationPill onPress={() => setShowLocation(true)} />
      </View>

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

      {loading && <><SkeletonCard /><SkeletonCard /></>}
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
      <LocationSheet visible={showLocation} onClose={() => setShowLocation(false)} />
    </ScrollView>
  );
}
