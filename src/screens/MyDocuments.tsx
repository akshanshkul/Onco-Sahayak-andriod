import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import type { Doc } from "../data/documents";
import { Card, Chip, IconTile, NoteBar, SkeletonCard, Tag } from "../components/ui";
import Logo from "../components/Logo";
import { useT } from "../i18n";
import { getDocumentUrl, getProfile, type DocumentMetadata, updateProfile, uploadFile } from "../services/api";

export default function MyDocuments({ navigation }: { navigation?: any }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Doc["category"]>("Reports");
  const [actionDoc, setActionDoc] = useState<Doc | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [openingDoc, setOpeningDoc] = useState(false);
  const [filter, setFilter] = useState("All");
  const docFilters = ["All", "Prescriptions", "Reports", "Insurance", "Other"];
  const otherCategories = ["Lab Tests", "Identity", "Other"];
  const tr = useT();

  const metadataToDoc = (item: string | DocumentMetadata, index: number): Doc => {
    const data = typeof item === "string"
      ? { key: item, name: item.split("/").pop() || `Document ${index + 1}` }
      : item;
    const image = /\.(jpg|jpeg|png|heic|webp)$/i.test(data.name);
    const category = (data.category || "Other") as Doc["category"];
    return {
      id: data.key,
      key: data.key,
      name: data.name,
      date: data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-GB") : "Uploaded",
      size: data.size ? `${(data.size / 1024 / 1024).toFixed(1)} MB` : "—",
      category: ["Prescriptions", "Reports", "Insurance", "Lab Tests", "Identity"].includes(category)
        ? category
        : "Other",
      icon: image ? "image" : "document-text",
      tone: image ? "mint" : "rose",
    };
  };

  useEffect(() => {
    AsyncStorage.getItem("auth_token")
      .then((token) => setAuthenticated(Boolean(token)))
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    getProfile()
      .then((profile) => {
        const items = profile.documentMetadata || profile.document_metadata || [];
        setDocs(items.map(metadataToDoc));
      })
      .catch((error) => Alert.alert("Unable to load documents", error instanceof Error ? error.message : "Please try again."))
      .finally(() => setLoading(false));
  }, [authenticated]);

  const list = useMemo(() => {
    if (filter === "All") return docs;
    if (filter === "Other") return docs.filter((d) => otherCategories.includes(d.category));
    return docs.filter((d) => d.category === filter);
  }, [docs, filter]);

  const uploadFileForCategory = async (category: Doc["category"]) => {
    if (uploading) return;
    const r = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (r.canceled) return;
    const a = r.assets[0];
    setUploading(true);
    try {
      const uploaded = await uploadFile(
        { uri: a.uri, name: a.name, mimeType: a.mimeType },
        "document"
      );
      const metadata: DocumentMetadata = {
        key: uploaded.key,
        name: a.name,
        mimeType: a.mimeType,
        size: a.size,
        category,
        createdAt: new Date().toISOString(),
      };
      const next = [metadata, ...docs.filter((doc) => doc.key).map((doc) => ({
        key: doc.key!,
        name: doc.name,
        category: doc.category,
      }))];
      await updateProfile({ documentMetadata: next });
      setDocs(next.map(metadataToDoc));
    } catch (error) {
      Alert.alert("Upload failed", error instanceof Error ? error.message : "Unable to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const upload = () => {
    setCategoryModal(true);
  };

  if (authChecking) {
    return (
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: colors.bg }}>
        <Ionicons name="document-text-outline" size={64} color={colors.primary} />
        <Text className="mt-4 text-center text-[18px] font-bold" style={{ color: colors.navy }}>
          Loading your documents
        </Text>
      </View>
    );
  }

  if (!authenticated) {
    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: "#E6F1FD" }}
        >
          <Ionicons name="folder-open-outline" size={46} color={colors.blue} />
        </View>
        <Text className="mt-5 text-center text-[25px] font-extrabold" style={{ color: colors.navy }}>
          Your documents are secure
        </Text>
        <Text className="mt-2 max-w-[320px] text-center text-[14px] leading-5 text-slate-500">
          Log in to upload, view, and manage your medical documents securely.
        </Text>
        <Pressable
          onPress={() => navigation?.navigate("Login")}
          className="mt-6 w-full max-w-[320px] items-center rounded-2xl py-3.5"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-[15px] font-bold text-white">Log in to view documents</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation?.navigate("Signup")}
          className="mt-3 w-full max-w-[320px] items-center rounded-2xl border py-3.5"
          style={{ borderColor: colors.primary }}
        >
          <Text className="text-[15px] font-bold" style={{ color: colors.primary }}>
            Create an account
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  const openDocument = async (doc: Doc) => {
    if (!doc.key || openingDoc) return;
    setOpeningDoc(true);
    try {
      const url = await getDocumentUrl(doc.key!);
      const result = await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        enableBarCollapsing: true,
      });
      if (result.type === "cancel" || result.type === "dismiss") {
        return;
      }
    } catch (error) {
      Alert.alert("Unable to open document", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setOpeningDoc(false);
    }
  };

  const removeDocument = (doc: Doc) => {
    Alert.alert("Remove document?", `Remove "${doc.name}" from your account?`, [
      { text: "Keep document", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const next = docs.filter((item) => item.id !== doc.id);
          try {
            await updateProfile({
              documentMetadata: next.filter((item) => item.key).map((item) => ({
                key: item.key!,
                name: item.name,
                category: item.category,
              })),
            });
            setDocs(next);
          } catch (error) {
            Alert.alert("Unable to remove", error instanceof Error ? error.message : "Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Logo size="sm" showTagline={false} />
        <Pressable hitSlop={10}>
          <Ionicons name="notifications-outline" size={23} color={colors.navy} />
          <View
            className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.pink }}
          >
            <Text className="text-[9px] font-bold text-white">3</Text>
          </View>
        </Pressable>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text
          className="flex-1 text-[24px] font-extrabold"
          style={{ color: colors.navy }}
          numberOfLines={1}
        >
          {tr("docs.title")}
        </Text>
        <Pressable
          onPress={upload}
          disabled={uploading}
          className="ml-2 flex-row items-center rounded-2xl px-3 py-2.5"
          style={{ backgroundColor: colors.primary }}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text className="ml-1 text-[12.5px] font-bold text-white">{uploading ? "Uploading..." : tr("upload.upload")}</Text>
        </Pressable>
      </View>
      <Text className="mt-1 text-[13px] leading-[18px] text-slate-500">
        {tr("docs.subtitle")}
      </Text>

      {/* Filters */}
      <View className="mt-4 flex-row flex-wrap">
        {docFilters.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>

      {/* List */}
      <View className="mt-1">
        {loading && <><SkeletonCard /><SkeletonCard /></>}
        {!loading && list.map((d) => (
          <Card key={d.id} className="mb-2.5 flex-row items-center p-3.5">
            <IconTile icon={d.icon} tone={d.tone} size={42} radius={12} />
            <View className="ml-3 flex-1">
              <Text
                className="text-[14.5px] font-bold"
                style={{ color: colors.navy }}
                numberOfLines={1}
              >
                {d.name}
              </Text>
              <Text className="mt-0.5 text-[12px] text-slate-500">
                {d.date} · {d.size}
              </Text>
            </View>
            <View className="mr-2">
              <Tag
                label={d.category}
                tone={
                  d.category === "Reports"
                    ? "violet"
                    : d.category === "Prescriptions"
                      ? "rose"
                      : d.category === "Insurance"
                        ? "sky"
                        : "mint"
                }
              />
            </View>
            <Pressable
              hitSlop={8}
              onPress={() => setActionDoc(d)}
            >
              <Ionicons name="ellipsis-vertical" size={18} color={colors.slate400} />
            </Pressable>
          </Card>
        ))}

        {list.length === 0 && (
          <Card className="items-center px-5 py-10">
            <Ionicons name="folder-open-outline" size={32} color={colors.slate400} />
            <Text className="mt-2 text-[15px] font-bold" style={{ color: colors.navy }}>
              {tr("docs.empty")}
            </Text>
            <Text className="mt-1 text-center text-[13px] text-slate-500">
              {tr("docs.emptyHint")}
            </Text>
          </Card>
        )}
      </View>

      <NoteBar
        icon="shield-checkmark"
        text={tr("docs.secure")}
      />

      <Modal
        visible={actionDoc !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActionDoc(null)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,44,82,0.35)" }}>
          <View className="rounded-t-3xl bg-white px-5 pb-8 pt-5">
            <View className="mb-5 flex-row items-center">
              <IconTile icon={actionDoc?.icon || "document-text"} tone={actionDoc?.tone || "rose"} size={48} radius={14} />
              <View className="ml-3 flex-1">
                <Text className="text-[16px] font-bold" style={{ color: colors.navy }} numberOfLines={2}>
                  {actionDoc?.name}
                </Text>
                <Text className="mt-0.5 text-[12px] text-slate-500">
                  {actionDoc?.category} · {actionDoc?.size}
                </Text>
              </View>
              <Pressable
                onPress={() => setActionDoc(null)}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: "#F1F5F9" }}
              >
                <Ionicons name="close" size={20} color={colors.slate500} />
              </Pressable>
            </View>
            <Text className="mb-2 text-[12px] font-bold text-slate-500">DOCUMENT ACTIONS</Text>
            <Pressable
              onPress={() => {
                const doc = actionDoc;
                if (doc?.key && !openingDoc) {
                  setActionDoc(null);
                  openDocument(doc);
                }
              }}
              disabled={openingDoc}
              className="mb-2 flex-row items-center rounded-2xl px-4 py-3.5"
              style={{ backgroundColor: "#E6F1FD" }}
            >
              <Ionicons name="eye-outline" size={21} color={colors.blue} />
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-bold" style={{ color: colors.navy }}>
                  {openingDoc ? "Opening document..." : "View document"}
                </Text>
                <Text className="mt-0.5 text-[12px] text-slate-500">Open the secure copy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.slate400} />
            </Pressable>
            <Pressable
              onPress={() => {
                const doc = actionDoc;
                setActionDoc(null);
                if (doc) removeDocument(doc);
              }}
              className="flex-row items-center rounded-2xl px-4 py-3.5"
              style={{ backgroundColor: "#FDECEF" }}
            >
              <Ionicons name="trash-outline" size={21} color="#E11D48" />
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-bold" style={{ color: "#BE123C" }}>Remove document</Text>
                <Text className="mt-0.5 text-[12px] text-slate-500">Remove it from your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FB7185" />
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={categoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModal(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,44,82,0.35)" }}>
          <View className="rounded-t-3xl bg-white px-5 pb-8 pt-6">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[21px] font-extrabold" style={{ color: colors.navy }}>
                  Add a document
                </Text>
                <Text className="mt-1 text-[13px] leading-5 text-slate-500">
                  Select what kind of document you want to upload.
                </Text>
              </View>
              <Pressable
                onPress={() => setCategoryModal(false)}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: "#F1F5F9" }}
              >
                <Ionicons name="close" size={20} color={colors.slate500} />
              </Pressable>
            </View>

            <Text className="mb-2 mt-5 text-[12px] font-bold text-slate-500">
              DOCUMENT TYPE
            </Text>
            {([
              ["Reports", "Medical report", "document-text-outline"],
              ["Prescriptions", "Prescription", "medical-outline"],
              ["Insurance", "Insurance document", "shield-checkmark-outline"],
              ["Identity", "Identity document", "card-outline"],
              ["Other", "Other document", "folder-open-outline"],
            ] as const).map(([value, label, icon]) => (
              <Pressable
                key={value}
                onPress={() => setSelectedCategory(value)}
                className="mb-2 flex-row items-center rounded-2xl border px-3.5 py-3"
                style={{
                  borderColor: selectedCategory === value ? colors.primary : colors.border,
                  backgroundColor: selectedCategory === value ? "#E6F7EF" : "#fff",
                }}
              >
                <Ionicons
                  name={icon}
                  size={20}
                  color={selectedCategory === value ? colors.primary : colors.slate500}
                />
                <Text
                  className="ml-3 flex-1 text-[14px] font-semibold"
                  style={{ color: colors.navy }}
                >
                  {label}
                </Text>
                <Ionicons
                  name={selectedCategory === value ? "checkmark-circle" : "ellipse-outline"}
                  size={21}
                  color={selectedCategory === value ? colors.primary : colors.slate400}
                />
              </Pressable>
            ))}

            <Pressable
              disabled={uploading}
              onPress={() => {
                setCategoryModal(false);
                uploadFileForCategory(selectedCategory);
              }}
              className="mt-3 items-center rounded-2xl py-3.5"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-[15px] font-bold text-white">Choose file</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
