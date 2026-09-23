import React, { useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { hospitalTabs, type Hospital } from "../data/hospitals";
import { IMG } from "../assets";
import {
  AppHeader,
  Card,
  CTA,
  IconTile,
  NoteBar,
  SectionTitle,
  Tag,
} from "../components/ui";

function PhotoCarousel({ h }: { h: Hospital }) {
  const [index, setIndex] = useState(0);
  const step = (d: number) =>
    setIndex((i) => (i + d + h.photoCount) % h.photoCount);

  return (
    <View className="mx-4">
      <View
        className="overflow-hidden"
        style={{ height: 190, borderRadius: 22, backgroundColor: "#E6F1FD" }}
      >
        <Image
          source={IMG.hospitalPhoto}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1">
          <Text className="text-[11px] font-bold text-white">
            {index + 1} / {h.photoCount}
          </Text>
        </View>

        <Pressable
          onPress={() => step(-1)}
          className="absolute left-3 top-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90"
          style={{ marginTop: -18 }}
        >
          <Ionicons name="chevron-back" size={19} color={colors.navy} />
        </Pressable>
        <Pressable
          onPress={() => step(1)}
          className="absolute right-3 top-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90"
          style={{ marginTop: -18 }}
        >
          <Ionicons name="chevron-forward" size={19} color={colors.navy} />
        </Pressable>

        <View className="absolute bottom-0 left-0 right-0 bg-black/35 px-4 py-2.5">
          <Text className="text-[13px] font-semibold text-white">{h.tagline}</Text>
        </View>
      </View>
    </View>
  );
}

function Overview({ h }: { h: Hospital }) {
  return (
    <View>
      {/* About + years badge */}
      <View className="flex-row">
        <Card className="flex-1 p-4">
          <View className="flex-row items-center">
            <Ionicons name="business" size={17} color={colors.primary} />
            <Text className="ml-1.5 text-[15px] font-bold" style={{ color: colors.navy }}>
              About Hospital
            </Text>
          </View>
          <Text className="mt-2 text-[13px] leading-5 text-slate-500">{h.about}</Text>
        </Card>

        <View className="w-3" />

        <View
          className="w-[108px] items-center justify-center rounded-3xl p-3"
          style={{ backgroundColor: "#E6F1FD" }}
        >
          <Text className="text-[26px] font-extrabold" style={{ color: colors.navy }}>
            {h.years}
          </Text>
          <Text className="text-center text-[11px] text-slate-500">Years of Service</Text>
          <View className="my-2 h-px w-full" style={{ backgroundColor: "#CFE0F5" }} />
          <Text className="text-center text-[11px] text-slate-500">
            Thousands of Lives Impacted
          </Text>
        </View>
      </View>

      {/* Specialty tiles */}
      <View className="mt-3 flex-row flex-wrap justify-between">
        {h.specialties.map((s) => (
          <View
            key={s.label}
            className="mb-2 items-center rounded-2xl p-3"
            style={{ width: "30.5%", backgroundColor: "#F7FAFC" }}
          >
            <IconTile icon={s.icon} tone={s.tone} size={40} radius={10} />
            <Text
              className="mt-1.5 text-center text-[10.5px] font-semibold"
              style={{ color: colors.navy, lineHeight: 13 }}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Schemes*/}
      <View className="mt-3 flex-row">
        <Card className="flex-1 p-4">
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
            <Text className="ml-1.5 text-[13px] font-bold" style={{ color: colors.navy }}>
              Insurance / Government Schemes
            </Text>
          </View>
          {h.schemes.map((s) => (
            <View key={s} className="mt-2 flex-row items-center">
              <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
              <Text className="ml-1.5 flex-1 text-[12px] text-slate-500">{s}</Text>
            </View>
          ))}
        </Card>
      </View>
    </View>
  );
}

function BulletList({ items, icon }: { items: string[]; icon: any }) {
  return (
    <Card className="p-4">
      {items.map((d, i) => (
        <View
          key={d}
          className="flex-row items-center py-2.5"
          style={{
            borderTopWidth: i === 0 ? 0 : 1,
            borderTopColor: colors.border,
          }}
        >
          <Ionicons name={icon} size={17} color={colors.primary} />
          <Text className="ml-2.5 flex-1 text-[14px]" style={{ color: colors.navy }}>
            {d}
          </Text>
        </View>
      ))}
    </Card>
  );
}

export default function HospitalDetails({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const h: Hospital = route.params?.hospital;
  const [tab, setTab] = useState(hospitalTabs[0]);
  const [saved, setSaved] = useState(false);

  if (!h) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text style={{ color: colors.navy }}>No hospital selected.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]} style={{ backgroundColor: colors.bg }}>
      <AppHeader
        onBack={() => navigation.goBack()}
        right={
          <View className="flex-row items-center">
            <Pressable onPress={() => setSaved((v) => !v)} hitSlop={8}>
              <Ionicons
                name={saved ? "heart" : "heart-outline"}
                size={22}
                color={saved ? colors.pink : colors.navy}
              />
            </Pressable>
            <Pressable className="ml-4" hitSlop={8}>
              <Ionicons name="share-social-outline" size={22} color={colors.navy} />
            </Pressable>
          </View>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <PhotoCarousel h={h} />

        {/* Title row */}
        <View className="mt-3 px-4">
          <View className="flex-row items-center">
            <Text
              className="flex-1 text-[21px] font-extrabold"
              style={{ color: colors.navy }}
              numberOfLines={1}
            >
              {h.name}
            </Text>
            <Ionicons name="star" size={15} color={colors.amber} />
            <Text className="ml-1 text-[13px] font-bold" style={{ color: colors.navy }}>
              {h.rating}
            </Text>
            <Text className="ml-1 text-[12px] text-slate-500">({h.reviews} reviews)</Text>
          </View>
          <View className="mt-1.5 flex-row">
            <Tag
              label={`${h.kind} Hospital`}
              tone={h.kind === "Government" ? "green" : "violet"}
            />
          </View>
        </View>

        {/* Location strip */}
        <View className="mt-2.5 flex-row items-center px-4">
          <Ionicons name="location" size={14} color={colors.primary} />
          <Text className="ml-1 text-[12px] text-slate-500">
            {h.city} - {h.pin}
          </Text>
          <View className="mx-2.5 h-3.5 w-px" style={{ backgroundColor: colors.border }} />
          <Ionicons name="car" size={14} color={colors.slate500} />
          <Text className="ml-1 text-[12px] text-slate-500">
            {h.distance} ({h.driveTime})
          </Text>
          <View className="flex-1" />
          <Pressable
            className="flex-row items-center rounded-full border px-3 py-1.5"
            style={{ borderColor: colors.primary }}
          >
            <Ionicons name="navigate" size={13} color={colors.primary} />
            <Text className="ml-1 text-[12px] font-bold" style={{ color: colors.primary }}>
              Get Directions
            </Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {hospitalTabs.map((t) => {
            const on = t === tab;
            return (
              <Pressable key={t} onPress={() => setTab(t)} className="mr-5 pb-2">
                <Text
                  className="text-[13.5px]"
                  style={{
                    color: on ? colors.primary : colors.slate500,
                    fontWeight: on ? "700" : "500",
                  }}
                >
                  {t}
                </Text>
                {on && (
                  <View
                    className="mt-1.5 h-[3px] rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
        <View className="h-px" style={{ backgroundColor: colors.border }} />

        {/* Tab body */}
        <View className="mt-4 px-4">
          {tab === "Overview" && <Overview h={h} />}

          {tab === "Departments" && (
            <>
              <SectionTitle title="Departments" icon="git-branch-outline" />
              <BulletList items={h.departments} icon="medkit-outline" />
            </>
          )}

          {tab === "Doctors" && (
            <>
              <SectionTitle title="Doctors" icon="people-outline" />
              <Card className="p-4">
                {h.doctors.map((d, i) => (
                  <View
                    key={d.name}
                    className="flex-row items-center py-3"
                    style={{
                      borderTopWidth: i === 0 ? 0 : 1,
                      borderTopColor: colors.border,
                    }}
                  >
                    <IconTile icon="person" tone="sky" size={44} radius={22} />
                    <View className="ml-3 flex-1">
                      <Text className="text-[14px] font-bold" style={{ color: colors.navy }}>
                        {d.name}
                      </Text>
                      <Text className="mt-0.5 text-[12px]" style={{ color: colors.primary }}>
                        {d.role}
                      </Text>
                      <Text className="text-[11px] text-slate-500">{d.exp}</Text>
                    </View>
                  </View>
                ))}
              </Card>
            </>
          )}

          {tab === "Treatment & Cost" && (
            <>
              <SectionTitle title="Treatment Cost (Estimated)" icon="cash-outline" />
              <Card className="p-4">
                {h.costs.map((c, i) => (
                  <View
                    key={c.label}
                    className="flex-row items-center py-3"
                    style={{
                      borderTopWidth: i === 0 ? 0 : 1,
                      borderTopColor: colors.border,
                    }}
                  >
                    <IconTile icon="pricetag" tone="green" size={38} radius={13} />
                    <View className="ml-3 flex-1">
                      <Text className="text-[14px] font-semibold" style={{ color: colors.navy }}>
                        {c.label}
                      </Text>
                      {!!c.note && (
                        <Text className="text-[11px] text-slate-400">{c.note}</Text>
                      )}
                    </View>
                    <Text className="text-[13px] font-extrabold" style={{ color: colors.navy }}>
                      {c.value}
                    </Text>
                  </View>
                ))}
              </Card>
              <NoteBar
                tone="amber"
                icon="alert-circle"
                text="These are estimated costs. Actual cost may vary depending on your condition and treatment plan."
              />
            </>
          )}

          {tab === "Facilities" && (
            <>
              <SectionTitle title="Facilities" icon="sparkles-outline" />
              <BulletList items={h.facilities} icon="checkmark-circle-outline" />
            </>
          )}

          {tab === "Reviews" && (
            <>
              <SectionTitle title={`Reviews (${h.reviews})`} icon="star-outline" />
              <Card className="items-center p-6">
                <Text className="text-[40px] font-extrabold" style={{ color: colors.navy }}>
                  {h.rating}
                </Text>
                <View className="mt-1 flex-row">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Ionicons
                      key={n}
                      name={n <= Math.round(Number(h.rating)) ? "star" : "star-outline"}
                      size={17}
                      color={colors.amber}
                    />
                  ))}
                </View>
                <Text className="mt-2 text-center text-[13px] text-slate-500">
                  Based on {h.reviews} patient reviews. Individual reviews are not part of this
                  prototype.
                </Text>
              </Card>
            </>
          )}
        </View>

        {/* Actions */}
        <View className="mt-5 flex-row px-4">
          <View className="flex-1">
            <CTA
              label="Call Hospital"
              variant="outline"
              icon="call"
              onPress={() => Linking.openURL(`tel:${h.phone.replace(/\s/g, "")}`)}
            />
          </View>
          <View className="w-3" />
          <View className="flex-1">
            <CTA
              label="Select"
              chevron
              onPress={() => navigation.navigate("Main")}
            />
          </View>
        </View>

        <View className="px-4">
          <NoteBar
            tone="sky"
            text="You can select this hospital to proceed with assistance and application for financial support."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
