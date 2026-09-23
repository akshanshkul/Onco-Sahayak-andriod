import React from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TextInputProps,
  ViewProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, screenWash, tilePalettes, TileTone } from "../theme";
import { useLocation } from "../location";
import Logo from "./Logo";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];

/** Soft gradient page background used by every screen in the designs. */
export function ScreenWash({ children, style }: ViewProps) {
  return (
    <LinearGradient
      colors={[...screenWash]}
      // Explicit so the wash runs top-to-bottom on web as well as native;
      // without it the web build emits a 90deg (left-to-right) gradient.
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}

/** White rounded surface. */
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={"rounded-3xl border border-border bg-white " + className}
      style={{
        shadowColor: "#0F2C52",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
      }}
    >
      {children}
    </View>
  );
}

/** Top bar: optional back button, centred logo, optional right-hand slot. */
export function AppHeader({
  onBack,
  right,
  backLabel = "Back",
}: {
  onBack?: () => void;
  right?: React.ReactNode;
  backLabel?: string;
}) {
  return (
    <View className="flex-row items-center justify-between px-3 pb-3 pt-2">
      <View className="flex-shrink-0">
        {onBack && (
          <Pressable onPress={onBack} hitSlop={10} className="flex-row items-center">
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
            {!!backLabel && (
              <Text
                className="ml-0.5 text-[15px] font-semibold"
                style={{ color: colors.primary }}
              >
                {backLabel}
              </Text>
            )}
          </Pressable>
        )}
      </View>
      <View className="mx-1.5 flex-shrink">
        <Logo size="sm" />
      </View>
      <View className="flex-shrink-0 items-end">{right}</View>
    </View>
  );
}

/**
 * "Kaithal, Haryana / 136027" pill shown top-right on several screens.
 * Reads the shared location unless explicit values are passed, and opens the
 * location picker when given an `onPress`.
 */
export function LocationPill({
  city,
  pin,
  onPress,
}: {
  city?: string;
  pin?: string;
  onPress?: () => void;
}) {
  const { location } = useLocation();
  const shownCity = city ?? location.city;
  const shownPin = pin ?? location.pin;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center"
      hitSlop={8}
    >
      <View
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <Ionicons
          name={location.fromDevice ? "navigate" : "location"}
          size={15}
          color="#fff"
        />
      </View>
      <View className="ml-1.5">
        <View className="flex-row items-center">
          <Text
            className="max-w-[92px] text-[11.5px] font-semibold"
            style={{ color: colors.navy }}
            numberOfLines={1}
          >
            {shownCity}
          </Text>
          {!!onPress && <Ionicons name="chevron-down" size={12} color={colors.navy} />}
        </View>
        <Text className="text-[10px] text-slate-500">{shownPin}</Text>
      </View>
    </Pressable>
  );
}

/** Selectable filter pill (All / NGOs / Reports / ...). */
export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-2 mr-2 rounded-full px-4 py-2.5"
      style={{ backgroundColor: active ? colors.primary : "#EEF4FA" }}
    >
      <Text
        className="text-[13px] font-semibold"
        style={{ color: active ? "#fff" : colors.navy }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Small non-interactive status tag, e.g. "Government Hospital", "Reports". */
export function Tag({ label, tone = "green" }: { label: string; tone?: TileTone }) {
  const p = tilePalettes[tone];
  return (
    <View className="self-start rounded-full px-2.5 py-1" style={{ backgroundColor: p.bg }}>
      <Text className="text-[11px] font-bold" style={{ color: p.fg }}>
        {label}
      </Text>
    </View>
  );
}

/** Rounded square icon badge used in tiles, list rows and NGO logos. */
export function IconTile({
  icon,
  tone = "green",
  size = 44,
  radius = 16,
}: {
  icon: IconName;
  tone?: TileTone;
  size?: number;
  radius?: number;
}) {
  const p = tilePalettes[tone];
  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: p.bg }}
    >
      <Ionicons name={icon} size={size * 0.46} color={p.fg} />
    </View>
  );
}

/** Section heading with an optional right-hand action. */
export function SectionTitle({
  title,
  action,
  onAction,
  icon,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  icon?: IconName;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center">
        {icon && (
          <Ionicons name={icon} size={18} color={colors.primary} style={{ marginRight: 6 }} />
        )}
        <Text className="text-lg font-bold" style={{ color: colors.navy }}>
          {title}
        </Text>
      </View>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-[13px] font-semibold" style={{ color: colors.primary }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/** Labelled form input with a leading icon, matching the signup screen. */
export function Field({
  label,
  required,
  icon,
  rightIcon,
  onRightIconPress,
  className = "",
  dense,
  textSize,
  ...inputProps
}: {
  label?: string;
  required?: boolean;
  icon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  className?: string;
  /** Tighter type and padding, for fields sitting two-up in a narrow column. */
  dense?: boolean;
  textSize?: number;
} & TextInputProps) {
  return (
    <View className={className}>
      {!!label && (
        <Text
          className="mb-1.5 font-semibold"
          style={{ color: colors.navy, fontSize: dense ? 12 : 13 }}
        >
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      <View
        className="flex-row items-center rounded-2xl border border-border bg-white"
        // minWidth 0 lets the field shrink inside a narrow column instead of
        // overflowing to its input's intrinsic width.
        style={{ minWidth: 0, paddingHorizontal: dense ? 10 : 14 }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={dense ? 15 : 18}
            color={colors.slate400}
            style={{ marginRight: dense ? 5 : 8 }}
          />
        )}
        <TextInput
          placeholderTextColor={colors.slate400}
          className="flex-1"
          style={{
            color: colors.dark,
            minWidth: 0,
            fontSize: textSize ?? (dense ? 12.5 : 15),
            paddingVertical: dense ? 12 : 14,
          }}
          {...inputProps}
        />
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={8}
            style={{ marginLeft: dense ? 4 : 6 }}
          >
            <Ionicons name={rightIcon} size={dense ? 16 : 19} color={colors.slate400} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

/**
 * A read-only field that opens a picker. The inner field ignores pointer events
 * so the whole row is one tap target rather than the disabled TextInput
 * swallowing the press.
 */
export function SelectField({
  onPress,
  ...props
}: React.ComponentProps<typeof Field> & { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View pointerEvents="none">
        <Field {...props} editable={false} rightIcon="chevron-down" />
      </View>
    </Pressable>
  );
}

/**
 * Stand-in for the photography and illustration in the mockups. The project has
 * no `assets/` folder, so hero imagery renders as a tinted panel with an icon.
 * Replace with an <Image /> once real artwork is added.
 */
export function ArtPanel({
  icon = "image",
  tone = "green",
  height = 160,
  radius = 24,
  label,
  children,
}: {
  icon?: IconName;
  tone?: TileTone;
  height?: number;
  radius?: number;
  label?: string;
  children?: React.ReactNode;
}) {
  const p = tilePalettes[tone];
  return (
    <View
      className="overflow-hidden"
      style={{ height, borderRadius: radius, backgroundColor: p.bg }}
    >
      <View className="absolute inset-0 items-center justify-center">
        <Ionicons name={icon} size={height * 0.26} color={p.fg} style={{ opacity: 0.45 }} />
        {!!label && (
          <Text className="mt-2 text-[11px] font-semibold" style={{ color: p.fg }}>
            {label}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}

/** The handwritten-script accents ("You Are Not Alone") from the designs. */
export function ScriptText({
  children,
  size = 15,
  color = colors.navy,
  align = "center",
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
}) {
  return (
    <Text
      style={{
        fontSize: size,
        color,
        textAlign: align,
        fontStyle: "italic",
        lineHeight: size * 1.5,
      }}
    >
      {children}
    </Text>
  );
}

/** Full-width primary/outline/soft CTA with an optional trailing chevron. */
export function CTA({
  label,
  onPress,
  variant = "primary",
  icon,
  chevron,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "outline" | "soft";
  icon?: IconName;
  chevron?: boolean;
}) {
  const isPrimary = variant === "primary";
  const bg = isPrimary ? colors.primary : variant === "soft" ? colors.primarySoft : "#fff";
  const fg = isPrimary ? "#fff" : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center rounded-2xl px-5 py-4"
      style={{
        backgroundColor: bg,
        borderWidth: variant === "outline" ? 1.5 : 0,
        borderColor: colors.primary,
      }}
    >
      {icon && <Ionicons name={icon} size={18} color={fg} style={{ marginRight: 8 }} />}
      <Text className="text-[16px] font-bold" style={{ color: fg }}>
        {label}
      </Text>
      {chevron && (
        <Ionicons name="chevron-forward" size={18} color={fg} style={{ marginLeft: 6 }} />
      )}
    </Pressable>
  );
}

/** Divider with a centred label, used for the "OR" rule on the login screen. */
export function OrDivider({
  label = "OR",
  spacing = 20,
}: {
  label?: string;
  spacing?: number;
}) {
  return (
    <View className="flex-row items-center" style={{ marginVertical: spacing }}>
      <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
      <Text className="mx-3 text-[13px] font-semibold text-slate-500">{label}</Text>
      <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
    </View>
  );
}

/** Informational strip, e.g. the security note under the document list. */
export function NoteBar({
  icon = "information-circle",
  text,
  tone = "green",
}: {
  icon?: IconName;
  text: string;
  tone?: TileTone;
}) {
  const p = tilePalettes[tone];
  return (
    <View
      className="mt-4 flex-row items-center rounded-2xl px-4 py-3"
      style={{ backgroundColor: p.bg }}
    >
      <Ionicons name={icon} size={16} color={p.fg} />
      <Text className="ml-2 flex-1 text-[12px]" style={{ color: colors.slate500 }}>
        {text}
      </Text>
    </View>
  );
}
