import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

export const SIGNUP_STEPS = ["Personal Details", "Documents", "Get Started"];

/** Three-dot progress rail shown across the signup flow. `current` is 1-based. */
export default function Stepper({
  current,
  steps = SIGNUP_STEPS,
}: {
  current: number;
  steps?: string[];
}) {
  return (
    <View className="px-2">
      <View className="flex-row items-center">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          const filled = done || active;
          return (
            <React.Fragment key={label}>
              <View
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: filled ? colors.primary : "#E3E9F0" }}
              >
                {done ? (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                ) : (
                  <Text
                    className="text-[14px] font-bold"
                    style={{ color: active ? "#fff" : colors.slate500 }}
                  >
                    {n}
                  </Text>
                )}
              </View>
              {i < steps.length - 1 && (
                <View
                  className="h-[3px] flex-1 rounded-full"
                  style={{ backgroundColor: done ? colors.primary : "#E3E9F0" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <View className="mt-1.5 flex-row">
        {steps.map((label, i) => (
          <Text
            key={label}
            className="text-[12px]"
            style={{
              flex: 1,
              textAlign: i === 0 ? "left" : i === steps.length - 1 ? "right" : "center",
              color: i + 1 === current ? colors.primary : colors.slate500,
              fontWeight: i + 1 === current ? "700" : "500",
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
