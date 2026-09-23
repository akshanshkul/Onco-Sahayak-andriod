import React from "react";
import { View, Text, Image } from "react-native";
import { colors } from "../theme";
import { IMG } from "../assets";

/** Aspect ratio of assets/images/logo-lockup.png (686 x 453). */
const LOCKUP_RATIO = 453 / 686;

/** The ribbon-heart mark on its own. */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <Image source={IMG.logoMark} style={{ width: size, height: size }} resizeMode="contain" />
  );
}

/**
 * The Onco Sahayak lock-up. `lg` uses the full artwork (mark + wordmark +
 * tagline); the smaller sizes pair the mark with live text so headers stay
 * crisp and the wordmark can scale with the type settings.
 */
export default function Logo({
  size = "md",
  showTagline = true,
  width,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  /** Overrides the lock-up width for `lg`; height follows the aspect ratio. */
  width?: number;
}) {
  if (size === "lg") {
    const w = width ?? 230;
    return (
      <Image
        source={IMG.logo}
        style={{ width: w, height: w * LOCKUP_RATIO }}
        resizeMode="contain"
      />
    );
  }

  const markSize = size === "md" ? 36 : 28;
  // "Onco Sahayak" is wider than a single word, so the header size steps down.
  const wordSize = size === "md" ? 18 : 14.5;

  return (
    <View className="flex-row items-center">
      <LogoMark size={markSize} />
      <View className="ml-1.5">
        <Text
          className="font-extrabold tracking-tight"
          style={{ fontSize: wordSize }}
          numberOfLines={1}
        >
          <Text style={{ color: colors.primary }}>Onco </Text>
          <Text style={{ color: colors.navy }}>Sahayak</Text>
        </Text>
        {showTagline && (
          <Text className="text-[9.5px] text-slate-500">Together Against Cancer</Text>
        )}
      </View>
    </View>
  );
}
