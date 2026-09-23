import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { MONTHS, daysInMonth } from "../data/options";

const ROW = 44;

function Sheet({
  visible,
  title,
  onClose,
  children,
  footer,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      // Android runs edge-to-edge by default from SDK 57. Without these the
      // modal stops short of the system bars, leaving a strip at the bottom
      // where the screen underneath (and its buttons) shows through.
      // navigationBarTranslucent requires statusBarTranslucent.
      statusBarTranslucent
      navigationBarTranslucent
    >
      {/* Tapping the scrim dismisses, matching a native sheet. */}
      <Pressable
        className="flex-1"
        style={{ backgroundColor: "rgba(15,44,82,0.35)" }}
        onPress={onClose}
      />
      <View
        className="rounded-t-3xl bg-white px-4 pt-4"
        style={{
          maxHeight: "75%",
          // Clear the gesture pill / nav buttons now that we draw under them.
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        }}
      >
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[17px] font-bold" style={{ color: colors.navy }}>
            {title}
          </Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={22} color={colors.slate500} />
          </Pressable>
        </View>
        {children}
        {footer}
      </View>
    </Modal>
  );
}

/** An option is either a plain label, or an id/label pair for keyed data. */
export type Option = string | { id: string; name: string };

const optId = (o: Option) => (typeof o === "string" ? o : o.id);
const optLabel = (o: Option) => (typeof o === "string" ? o : o.name);

/**
 * Single-select list in a bottom sheet. Used for Gender, State and District.
 * Shows a search box once the list is long enough to need one.
 */
export function OptionSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  searchable,
  header,
}: {
  visible: boolean;
  title: string;
  options: Option[];
  /** The selected option's id (or its label, for plain string lists). */
  value?: string;
  onSelect: (id: string, label: string) => void;
  onClose: () => void;
  searchable?: boolean;
  /** Optional block pinned above the search box, e.g. a "detect me" action. */
  header?: React.ReactNode;
}) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (visible) setQ("");
  }, [visible]);

  const showSearch = searchable ?? options.length > 12;
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle
      ? options.filter((o) => optLabel(o).toLowerCase().includes(needle))
      : options;
  }, [options, q]);

  return (
    <Sheet visible={visible} title={title} onClose={onClose}>
      {header}
      {showSearch && (
        <View className="mb-2 flex-row items-center rounded-2xl border border-border px-3.5">
          <Ionicons name="search" size={17} color={colors.slate400} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={`Search ${title.toLowerCase()}`}
            placeholderTextColor={colors.slate400}
            className="flex-1 py-3 text-[14px]"
            style={{ color: colors.dark, minWidth: 0 }}
          />
        </View>
      )}

      {/* flexShrink lets the list shrink inside the sheet's maxHeight and
          become scrollable. Without it the ScrollView takes its full content
          height and the sheet simply clips any rows past the cut-off. */}
      <ScrollView
        style={{ flexShrink: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {list.map((o) => {
          const id = optId(o);
          const label = optLabel(o);
          const on = id === value;
          return (
            <Pressable
              key={id}
              onPress={() => {
                onSelect(id, label);
                onClose();
              }}
              className="flex-row items-center border-b py-3.5"
              style={{ borderBottomColor: colors.border }}
            >
              <Text
                className="flex-1 text-[15px]"
                style={{ color: on ? colors.primary : colors.navy, fontWeight: on ? "700" : "400" }}
              >
                {label}
              </Text>
              {on && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </Pressable>
          );
        })}

        {list.length === 0 && (
          <Text className="py-8 text-center text-[14px] text-slate-500">No matches</Text>
        )}
      </ScrollView>
    </Sheet>
  );
}

/** One scrolling wheel column of the date sheet. */
function Column({
  items,
  index,
  onChange,
}: {
  items: (string | number)[];
  index: number;
  onChange: (i: number) => void;
}) {
  const ref = useRef<ScrollView>(null);

  // Keep the selected row in view when the sheet opens or the value changes
  // from outside (e.g. clamping the day when the month gets shorter).
  useEffect(() => {
    const id = setTimeout(
      () => ref.current?.scrollTo({ y: Math.max(0, index - 1) * ROW, animated: false }),
      0
    );
    return () => clearTimeout(id);
  }, [index, items.length]);

  return (
    <ScrollView
      ref={ref}
      className="flex-1"
      style={{ height: ROW * 5 }}
      showsVerticalScrollIndicator={false}
    >
      {items.map((it, i) => {
        const on = i === index;
        return (
          <Pressable
            key={String(it)}
            onPress={() => onChange(i)}
            className="items-center justify-center"
            style={{ height: ROW }}
          >
            <Text
              style={{
                fontSize: on ? 17 : 15,
                fontWeight: on ? "700" : "400",
                color: on ? colors.primary : colors.slate500,
              }}
            >
              {it}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * Day / month / year picker. Built from plain views rather than
 * @react-native-community/datetimepicker so it renders identically in Expo Go,
 * on both platforms and in the web preview, with no extra native module.
 */
export function DateSheet({
  visible,
  value,
  onConfirm,
  onClose,
  minYear,
  maxYear = new Date().getFullYear(),
  title = "Date of Birth",
}: {
  visible: boolean;
  value?: Date;
  onConfirm: (d: Date) => void;
  onClose: () => void;
  minYear?: number;
  maxYear?: number;
  title?: string;
}) {
  const years = useMemo(() => {
    const from = minYear ?? maxYear - 100;
    // Newest first: a date of birth is usually nearer the recent end.
    return Array.from({ length: maxYear - from + 1 }, (_, i) => maxYear - i);
  }, [minYear, maxYear]);

  const initial = value ?? new Date(maxYear - 30, 0, 1);
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [day, setDay] = useState(initial.getDate());

  // Re-seed from the current value each time the sheet opens.
  useEffect(() => {
    if (!visible) return;
    const d = value ?? new Date(maxYear - 30, 0, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setDay(d.getDate());
  }, [visible]);

  const maxDay = daysInMonth(month, year);
  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay]
  );

  // 31 Jan -> Feb must not leave an impossible day selected.
  useEffect(() => {
    if (day > maxDay) setDay(maxDay);
  }, [maxDay]);

  return (
    <Sheet
      visible={visible}
      title={title}
      onClose={onClose}
      footer={
        <Pressable
          onPress={() => {
            onConfirm(new Date(year, month, day));
            onClose();
          }}
          className="mt-3 items-center rounded-2xl py-3.5"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-[15px] font-bold text-white">Confirm</Text>
        </Pressable>
      }
    >
      <View className="flex-row items-center">
        <Text className="w-1/3 text-center text-[11px] font-semibold text-slate-400">DAY</Text>
        <Text className="w-1/3 text-center text-[11px] font-semibold text-slate-400">MONTH</Text>
        <Text className="w-1/3 text-center text-[11px] font-semibold text-slate-400">YEAR</Text>
      </View>

      <View
        className="mt-1 flex-row rounded-2xl border"
        style={{ borderColor: colors.border, backgroundColor: "#F8FBFD" }}
      >
        <Column items={days} index={day - 1} onChange={(i) => setDay(days[i])} />
        <Column items={MONTHS} index={month} onChange={setMonth} />
        <Column items={years} index={years.indexOf(year)} onChange={(i) => setYear(years[i])} />
      </View>
    </Sheet>
  );
}
