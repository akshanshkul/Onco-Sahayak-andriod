import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Card, Tag } from "./ui";
import type { Hospital } from "../data/hospitals";

/** Compact hospital row used in the Hospitals list and on Home. */
export default function HospitalCard({
  hospital,
  onPress,
}: {
  hospital: Hospital;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="mb-3">
      <Card className="flex-row items-center p-3">
        {/* Photo slot — replace with <Image source={...} /> once artwork exists. */}
        <View
          className="h-[68px] w-[68px] items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#E6F1FD" }}
        >
          <Ionicons name="business" size={28} color={colors.blue} />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-bold" style={{ color: colors.navy }}>
            {hospital.name}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Ionicons name="location-outline" size={13} color={colors.slate400} />
            <Text className="ml-1 text-[12px] text-slate-500">{hospital.distance}</Text>
          </View>

          <View className="mt-1 flex-row items-center">
            <Ionicons name="star" size={13} color={colors.amber} />
            <Text className="ml-1 text-[12px] font-semibold" style={{ color: colors.navy }}>
              {hospital.rating}
            </Text>
            <Text className="ml-1 text-[12px] text-slate-500">
              ({hospital.reviews} reviews)
            </Text>
          </View>

          <View className="mt-2 flex-row">
            <Tag label={hospital.kind} tone={hospital.kind === "Government" ? "green" : "violet"} />
            <View className="w-1.5" />
            <Tag label={hospital.specialty} tone="sky" />
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.slate400} />
      </Card>
    </Pressable>
  );
}
