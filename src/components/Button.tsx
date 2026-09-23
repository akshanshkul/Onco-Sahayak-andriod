import React from "react";
import { Pressable, Text } from "react-native";

export default function Button({children,onPress,variant="primary"}: {children:React.ReactNode; onPress?:()=>void; variant?:"primary"|"secondary"}) {
  const cls = variant==="primary" ? "bg-primary" : "border border-slate-200 bg-white";
  return <Pressable onPress={onPress} className={`rounded-2xl py-4 ${cls}`}>
    <Text className={`text-center font-bold ${variant==="primary" ? "text-white" : "text-dark"}`}>{children}</Text>
  </Pressable>;
}