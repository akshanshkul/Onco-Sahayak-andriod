import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({title, subtitle, onBack}: {title:string; subtitle?:string; onBack?:()=>void}) {
  return (
    <View className="flex-row items-center px-5 pt-3 pb-4">
      {onBack && <Pressable onPress={onBack} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white">
        <Ionicons name="arrow-back" size={22} color="#183B35" />
      </Pressable>}
      <View className="flex-1">
        <Text className="text-2xl font-bold text-dark">{title}</Text>
        {subtitle && <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text>}
      </View>
      <View className="h-10 w-10 items-center justify-center rounded-full bg-mint">
        <Ionicons name="heart" size={19} color="#19A974" />
      </View>
    </View>
  );
}