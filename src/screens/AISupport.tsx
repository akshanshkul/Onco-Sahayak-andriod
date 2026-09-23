import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, tilePalettes } from "../theme";
import {
  aiCategories,
  suggestedQuestions,
  aiReply,
  nowLabel,
  type ChatMessage,
} from "../data/ai";
import { AppHeader, Card, LocationPill, ScriptText } from "../components/ui";
import { IMG } from "../assets";
import BottomNav from "../components/BottomNav";
import LocationSheet from "../components/LocationSheet";

function Bubble({ m }: { m: ChatMessage }) {
  const mine = m.from === "user";

  if (mine) {
    return (
      <View className="mb-4 flex-row items-end justify-end">
        <View
          className="max-w-[78%] rounded-3xl rounded-br-md px-4 py-3"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-[14px] leading-5 text-white">{m.text}</Text>
          <View className="mt-1 flex-row items-center justify-end">
            <Text className="text-[10px] text-white/75">{m.time}</Text>
            <Ionicons
              name="checkmark-done"
              size={13}
              color="#BFEFD8"
              style={{ marginLeft: 3 }}
            />
          </View>
        </View>
        <View
          className="ml-2 h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "#E6F1FD" }}
        >
          <Ionicons name="person" size={18} color={colors.blue} />
        </View>
      </View>
    );
  }

  return (
    <View className="mb-4 flex-row items-end">
      <View
        className="mr-2 h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: "#E6F7EF" }}
      >
        <Ionicons name="hardware-chip" size={17} color={colors.primary} />
      </View>
      <View
        className="max-w-[82%] rounded-3xl rounded-bl-md px-4 py-3"
        style={{ backgroundColor: "#F2F5F8" }}
      >
        <Text className="text-[14px] leading-[21px]" style={{ color: colors.dark }}>
          {m.text}
        </Text>
        <Text className="mt-1 text-right text-[10px] text-slate-400">{m.time}</Text>
      </View>
    </View>
  );
}

export default function AISupport({ navigation }: { navigation: any }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [q, setQ] = useState("");
  const scroller = useRef<ScrollView>(null);
  const [showLocation, setShowLocation] = useState(false);

  const ask = (text: string) => {
    const question = text.trim();
    if (!question) return;
    const t = nowLabel();
    setQ("");
    setMessages((m) => [
      ...m,
      { id: `u${Date.now()}`, from: "user", text: question, time: t },
      { id: `a${Date.now() + 1}`, from: "ai", text: aiReply(question), time: t },
    ]);
    requestAnimationFrame(() => scroller.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AppHeader onBack={() => navigation.goBack()} right={<LocationPill onPress={() => setShowLocation(true)} />} />

        <ScrollView
          ref={scroller}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <View className="px-4">
            <View
              className="overflow-hidden"
              style={{ height: 186, borderRadius: 22, backgroundColor: "#E6F7F1" }}
            >
              {/* Robot illustration from the design */}
              <Image
                source={IMG.aiRobot}
                style={{
                  position: "absolute",
                  right: 62,
                  bottom: -6,
                  width: 92,
                  height: 132,
                }}
                resizeMode="contain"
              />

              <View className="absolute bottom-4 left-4 top-4 w-[54%] justify-center">
                <Text
                  className="text-[21px] font-extrabold"
                  style={{ color: colors.navy, lineHeight: 26 }}
                >
                  AI Support Assistant
                </Text>
                <Text className="mt-1.5 text-[11.5px] leading-[16px] text-slate-600">
                  Your guide for cancer care, support and resources. Ask anything, anytime.
                </Text>
                <View className="mt-2 flex-row items-start">
                  <Ionicons name="chatbox-ellipses" size={12} color={colors.primary} />
                  <Text
                    className="ml-1 flex-1 text-[11px] font-semibold"
                    style={{ color: colors.primary, lineHeight: 14 }}
                  >
                    “Better Questions. Brighter Tomorrows.”
                  </Text>
                </View>
              </View>

              <View className="absolute right-3 top-3 w-[86px]">
                <View className="rounded-2xl bg-white px-2.5 py-1.5">
                  <Text className="text-[10.5px] leading-[14px]" style={{ color: colors.navy }}>
                    How can I help you today?
                  </Text>
                </View>
                <View className="mt-2">
                  <ScriptText size={10} align="right" color={colors.navy}>
                    You{"\n"}Are{"\n"}Not Alone
                  </ScriptText>
                  <Text className="text-right text-[11px]" style={{ color: colors.pink }}>
                    ♡
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Category grid */}
          <View className="mt-3 flex-row flex-wrap justify-between px-4">
            {aiCategories.map((c) => {
              const p = tilePalettes[c.tone];
              return (
                <Pressable
                  key={c.id}
                  onPress={() => ask(c.prompt)}
                  className="mb-2.5 items-center justify-center rounded-2xl px-2 py-3.5"
                  style={{ width: "23.8%", backgroundColor: p.bg }}
                >
                  <Ionicons name={c.icon} size={24} color={p.fg} />
                  <Text
                    className="mt-1.5 text-center text-[11px] font-bold"
                    style={{ color: colors.navy, lineHeight: 14 }}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Conversation */}
          <View className="mt-2 px-4">
            {messages.length === 0 ? (
              <Card className="items-center px-5 py-7">
                <Ionicons name="chatbubbles-outline" size={30} color={colors.primary} />
                <Text className="mt-2 text-[15px] font-bold" style={{ color: colors.navy }}>
                  Ask your first question
                </Text>
                <Text className="mt-1 text-center text-[13px] leading-[18px] text-slate-500">
                  Pick a topic above or type below. This assistant explains options and app
                  features — it does not replace your doctor.
                </Text>
              </Card>
            ) : (
              messages.map((m) => <Bubble key={m.id} m={m} />)
            )}
          </View>

          {/* Suggested follow-ups */}
          <View className="mt-3 px-4">
            <View className="rounded-3xl p-3" style={{ backgroundColor: "#E9F6F0" }}>
              <View className="flex-row items-center">
                <Ionicons name="bulb-outline" size={17} color={colors.primary} />
                <Text className="ml-1.5 text-[14px] font-bold" style={{ color: colors.navy }}>
                  You can also ask
                </Text>
              </View>
              <View className="mt-3 flex-row flex-wrap">
                {suggestedQuestions.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => ask(s)}
                    className="mb-2 mr-2 rounded-full border bg-white px-2.5 py-2"
                    style={{ borderColor: "#D6E9E0" }}
                  >
                    <Text className="text-[11px]" style={{ color: colors.navy }}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Composer */}
        <View className="flex-row items-center px-4 pb-2 pt-2">
          <View className="flex-1">
            <Card className="flex-row items-center px-4">
              <Ionicons name="attach" size={20} color={colors.slate400} />
              <TextInput
                value={q}
                onChangeText={setQ}
                onSubmitEditing={() => ask(q)}
                returnKeyType="send"
                placeholder="Type your question here..."
                placeholderTextColor={colors.slate400}
                className="flex-1 py-3.5 text-[14px]"
                style={{ color: colors.dark }}
              />
            </Card>
          </View>
          <Pressable
            onPress={() => ask(q)}
            className="ml-2.5 h-[52px] w-[52px] items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primary, opacity: q.trim() ? 1 : 0.55 }}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>

        <BottomNav
          active="Assistance"
          onChange={(tab) => navigation.navigate("Main", { tab })}
        />
        <LocationSheet visible={showLocation} onClose={() => setShowLocation(false)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
