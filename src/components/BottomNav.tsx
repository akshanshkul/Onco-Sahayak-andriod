import React from "react";
import { View, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import type { IconName } from "./ui";
import { useT } from "../i18n";
import type { StringKey } from "../i18n";

export const TABS: {
  label: string;
  key: StringKey;
  icon: IconName;
  activeIcon: IconName;
}[] = [
  { label: "Home", key: "nav.home", icon: "home-outline", activeIcon: "home" },
  { label: "Hospitals", key: "nav.hospitals", icon: "business-outline", activeIcon: "business" },
  { label: "Assistance", key: "nav.assistance", icon: "people-outline", activeIcon: "people" },
  { label: "Documents", key: "nav.documents", icon: "document-text-outline", activeIcon: "document-text" },
  { label: "Profile", key: "nav.profile", icon: "person-outline", activeIcon: "person" },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const tr = useT();

  return (
    <View
      className="flex-row border-t bg-white px-1 pt-2"
      style={{
        borderTopColor: colors.border,
        // Sit above the home indicator / gesture bar without a fixed guess.
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      {TABS.map((t) => {
        const on = active === t.label;
        return (
          <Pressable
            key={t.label}
            onPress={() => onChange(t.label)}
            className="flex-1 items-center py-1"
          >
            <Ionicons
              name={on ? t.activeIcon : t.icon}
              size={22}
              color={on ? colors.primary : colors.slate400}
            />
            <Text
              className="mt-1 text-[11px]"
              style={{
                color: on ? colors.primary : colors.slate400,
                fontWeight: on ? "700" : "500",
              }}
            >
              {tr(t.key)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
