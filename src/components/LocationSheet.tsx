import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { useLocation } from "../location";
import { OptionSheet } from "./pickers";
import { states, getDistrictsByState } from "../data/state";
import { useT } from "../i18n";

/**
 * Location chooser for the header pill: detect from GPS, or drill down
 * state -> district. Reuses OptionSheet so it matches every other picker.
 */
export default function LocationSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { setLocation, detect, detecting } = useLocation();
  const tr = useT();
  const [stage, setStage] = useState<"state" | "district">("state");
  const [stateId, setStateId] = useState("");
  const [stateLabel, setStateLabel] = useState("");

  const districts = useMemo(
    () => (stateId ? getDistrictsByState(stateId) : []),
    [stateId]
  );

  const runDetect = async () => {
    const err = await detect();
    if (err) Alert.alert("Location", err);
    else onClose();
  };

  // Step 2: district list for the chosen state
  if (stage === "district") {
    return (
      <OptionSheet
        visible={visible}
        title={stateLabel}
        options={districts}
        onSelect={(_id, label) => {
          setLocation({ city: `${label}, ${stateLabel}`, pin: "—" });
          setStage("state");
        }}
        onClose={() => {
          setStage("state");
          onClose();
        }}
      />
    );
  }

  // Step 1: state list, with a "use current location" action pinned on top
  return (
    <OptionSheet
      visible={visible}
      title={tr("loc.choose")}
      options={states}
      value={stateId}
      onSelect={(id, label) => {
        setStateId(id);
        setStateLabel(label);
        setStage("district");
      }}
      onClose={onClose}
      header={
        <Pressable
          onPress={runDetect}
          disabled={detecting}
          className="mb-2 flex-row items-center rounded-2xl px-3.5 py-3"
          style={{ backgroundColor: "#E6F7EF", opacity: detecting ? 0.6 : 1 }}
        >
          {detecting ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="navigate" size={18} color={colors.primary} />
          )}
          <View className="ml-2.5 flex-1">
            <Text className="text-[14px] font-bold" style={{ color: colors.primary }}>
              {detecting ? tr("loc.finding") : tr("loc.useCurrent")}
            </Text>
            <Text className="text-[11.5px] text-slate-500">
              {tr("loc.detects")}
            </Text>
          </View>
          {!detecting && (
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          )}
        </Pressable>
      }
    />
  );
}
