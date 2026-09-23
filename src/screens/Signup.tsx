import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import {
  AppHeader,
  Card,
  CTA,
  Field,
  SelectField,
  ScreenWash,
  ScriptText,
} from "../components/ui";
import Stepper from "../components/Stepper";
import { DateSheet, OptionSheet } from "../components/pickers";
import {
  GENDERS,
  INCOME_BANDS,
  RATION_CARDS,
  INSURANCE_STATUS,
  formatDob,
} from "../data/options";
import { states, getDistrictsByState } from "../data/state";
import DateTimePicker from "@react-native-community/datetimepicker";
/**
 * Two fields side by side, as the design pairs them. `minWidth: 0` lets each
 * column shrink below its input's intrinsic width — without it the right-hand
 * field pushes past the screen edge.
 */
function Pair({ children }: { children: React.ReactNode }) {
  const [a, b] = React.Children.toArray(children);
  // Paired fields get the dense variant so their labels and placeholders fit a
  // half-width column without truncating.
  const dense = (el: React.ReactNode) =>
    React.isValidElement(el) ? React.cloneElement(el, { dense: true } as any) : el;
  return (
    <View className="flex-row">
      <View style={{ flex: 1, minWidth: 0 }}>{dense(a)}</View>
      <View className="w-3" />
      <View style={{ flex: 1, minWidth: 0 }}>{dense(b)}</View>
    </View>
  );
}

function GroupHeading({ icon, title }: { icon: any; title: string }) {
  return (
    <View className="mb-3 flex-row items-center">
      <Ionicons name={icon} size={19} color={colors.primary} />
      <Text className="ml-2 text-[15px] font-bold" style={{ color: colors.navy }}>
        {title}
      </Text>
    </View>
  );
}

export default function Signup({ navigation }: { navigation: any }) {
  const [hidePwd, setHidePwd] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [gender, setGender] = useState("");
  const [showGender, setShowGender] = useState(false);

  // States and districts come from src/data/state.tsx. The state's id is held
  // so its districts can be looked up; the name is only for display.
  const [stateId, setStateId] = useState("");
  const [stateLabel, setStateLabel] = useState("");
  const [showState, setShowState] = useState(false);

  const [districtLabel, setDistrictLabel] = useState("");
  const [showDistrict, setShowDistrict] = useState(false);

  const districts = stateId ? getDistrictsByState(stateId) : [];

  // Optional family / income disclosure, collapsed until the row is tapped.
  const [showFamily, setShowFamily] = useState(false);
  const [income, setIncome] = useState("");
  const [showIncome, setShowIncome] = useState(false);
  const [rationCard, setRationCard] = useState("");
  const [showRation, setShowRation] = useState(false);
  const [insurance, setInsurance] = useState("");
  const [showInsurance, setShowInsurance] = useState(false);
  const [dependents, setDependents] = useState("");
  const [occupation, setOccupation] = useState("");

  const familyFilled = [income, rationCard, insurance, dependents, occupation].filter(
    Boolean
  ).length;

  const pickState = (id: string, label: string) => {
    setStateId(id);
    setStateLabel(label);
    // A district from the previous state would no longer be valid.
    setDistrictLabel("");
  };

  return (
    <ScreenWash>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <AppHeader
          onBack={() => navigation.goBack()}
          right={
            <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: "#E6F1FD" }}>
              <Text className="text-[12px] font-bold" style={{ color: colors.navy }}>
                Step 1 of 3
              </Text>
            </View>
          }
        />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="text-center text-[30px] font-extrabold"
            style={{ color: colors.navy }}
          >
            Create Your Account
          </Text>
          <Text className="mt-1 text-center text-[14px] text-slate-500">
            Fill in your details to get started.
          </Text>

          <View className="mt-5 px-6">
            <Stepper current={1} />
          </View>

          <View className="mt-5 px-4">
            <Card className="p-4">
              <View className="mb-3 flex-row items-start justify-between">
                <View className="flex-shrink">
                  <GroupHeading icon="person-circle-outline" title="Personal Information" />
                </View>
                <View
                  className="ml-2 max-w-[42%] flex-shrink flex-row items-center rounded-2xl px-2.5 py-1.5"
                  style={{ backgroundColor: "#E6F7EF" }}
                >
                  <Ionicons name="shield-checkmark" size={10} color={colors.primary} />
                  <Text
                    className="ml-1 flex-shrink text-[8.5px] font-semibold"
                    style={{ color: colors.primary, lineHeight: 8 }}
                  >
                    Your information is safe with us
                  </Text>
                </View>
              </View>

              <Field
                label="Full Name"
                required
                icon="person-outline"
                placeholder="Enter your full name"
              />
              <View className="h-3.5" />

              <Pair>
                <Field
                  label="Mobile Number"
                  required
                  icon="call-outline"
                  placeholder="98765 43210"
                  keyboardType="phone-pad"
                />
                <Field
                  label="Email Address"
                  required
                  icon="mail-outline"
                  placeholder="you@mail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Pair>
              <View className="h-3.5" />

              {/* SelectField handles its own press target, so these sit
                  directly in Pair and keep the dense two-up sizing. */}
              <Pair>
                <SelectField
                  label="Date of Birth"
                  required
                  icon="calendar-outline"
                  placeholder="DD/MM/YYYY"
                  value={dateOfBirth ? formatDob(dateOfBirth) : ""}
                  onPress={() => setShowDatePicker(true)}
                  textSize={10}
                />
                <SelectField
                  label="Gender"
                  required
                  icon="person-outline"
                  placeholder="Select"
                  value={gender}
                  onPress={() => setShowGender(true)}
                />
              </Pair>

              {/* The community picker is the OS-native dialog and has no web
                  build, so the web preview falls back to the in-app sheet. */}
              {showDatePicker &&
                (Platform.OS === "web" ? null : (
                  <DateTimePicker
                    value={dateOfBirth ?? new Date(2000, 0, 1)}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    // v9 API — `onChange` is deprecated in favour of these.
                    onValueChange={(_event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDateOfBirth(selectedDate);
                    }}
                    onDismiss={() => setShowDatePicker(false)}
                  />
                ))}

              <View className="my-5 h-px" style={{ backgroundColor: colors.border }} />

              <GroupHeading icon="location-outline" title="Address Information" />

              <Field
                label="Address"
                required
                icon="home-outline"
                placeholder="House No., Street, Area"
              />
              <View className="h-3.5" />

              <Pair>
                <SelectField
                  label="State"
                  required
                  icon="map-outline"
                  placeholder="Select"
                  value={stateLabel}
                  onPress={() => setShowState(true)}
                />
                <SelectField
                  label="District"
                  required
                  icon="business-outline"
                  // Districts depend on the state, so prompt for that first.
                  placeholder={stateId ? "Select" : "Pick state"}
                  value={districtLabel}
                  onPress={() => (stateId ? setShowDistrict(true) : setShowState(true))}
                />
              </Pair>
              <View className="h-3.5" />

              <Pair>
                <Field
                  label="PIN Code"
                  required
                  icon="location-outline"
                  placeholder="136027"
                  keyboardType="number-pad"
                />
                <Field
                  label="Emergency Contact"
                  required
                  icon="call-outline"
                  placeholder="98765 43210"
                  keyboardType="phone-pad"
                />
              </Pair>

              {/* Optional family / income disclosure. Expands in place rather
                  than pushing to another screen, so the form stays in one flow. */}
              <Pressable
                onPress={() => setShowFamily((v) => !v)}
                className="mt-4 flex-row items-center p-3.5"
                style={{
                  backgroundColor: "#E6F7EF",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderBottomLeftRadius: showFamily ? 0 : 16,
                  borderBottomRightRadius: showFamily ? 0 : 16,
                }}
              >
                <Ionicons name="people" size={20} color={colors.primary} />
                <View className="ml-2.5 flex-1">
                  <Text className="text-[13px] font-bold" style={{ color: colors.primary }}>
                    Family / Income Information{" "}
                    <Text className="font-normal text-slate-500">(Optional)</Text>
                  </Text>
                  <Text className="mt-0.5 text-[12px] text-slate-500">
                    This helps us suggest relevant financial assistance programs.
                  </Text>
                </View>
                {familyFilled > 0 && !showFamily && (
                  <View
                    className="mr-2 h-5 min-w-[20px] items-center justify-center rounded-full px-1"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-[11px] font-bold text-white">{familyFilled}</Text>
                  </View>
                )}
                <Ionicons
                  name={showFamily ? "chevron-up" : "chevron-forward"}
                  size={18}
                  color={colors.primary}
                />
              </Pressable>

              {showFamily && (
                <View
                  className="px-3.5 pb-3.5 pt-1"
                  style={{
                    backgroundColor: "#F2FAF6",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                  }}
                >
                  <SelectField
                    label="Annual Family Income"
                    icon="cash-outline"
                    placeholder="Select range"
                    value={income}
                    onPress={() => setShowIncome(true)}
                  />
                  <View className="h-3" />

                  <Pair>
                    <SelectField
                      label="Ration Card"
                      icon="card-outline"
                      placeholder="Select"
                      value={rationCard}
                      onPress={() => setShowRation(true)}
                    />
                    <Field
                      label="Family Members"
                      icon="people-outline"
                      placeholder="4"
                      keyboardType="number-pad"
                      value={dependents}
                      onChangeText={setDependents}
                    />
                  </Pair>
                  <View className="h-3" />

                  <Field
                    label="Primary Occupation"
                    icon="briefcase-outline"
                    placeholder="e.g. Farmer, Shopkeeper, Teacher"
                    value={occupation}
                    onChangeText={setOccupation}
                  />
                  <View className="h-3" />

                  <SelectField
                    label="Existing Health Insurance"
                    icon="shield-checkmark-outline"
                    placeholder="Select"
                    value={insurance}
                    onPress={() => setShowInsurance(true)}
                  />

                  <Text className="mt-3 text-[11px] leading-[15px] text-slate-500">
                    Shared only to match you with assistance schemes. You can skip this and
                    add it later from your profile.
                  </Text>
                </View>
              )}

              <View className="mt-4" />
              <Pair>
                <Field
                  label="Password"
                  required
                  icon="lock-closed-outline"
                  placeholder="Create password"
                  secureTextEntry={hidePwd}
                  rightIcon={hidePwd ? "eye-outline" : "eye-off-outline"}
                  onRightIconPress={() => setHidePwd((v) => !v)}
                />
                <Field
                  label="Confirm Password"
                  required
                  icon="lock-closed-outline"
                  placeholder="Re-enter password"
                  secureTextEntry={hideConfirm}
                  rightIcon={hideConfirm ? "eye-outline" : "eye-off-outline"}
                  onRightIconPress={() => setHideConfirm((v) => !v)}
                />
              </Pair>

              <View className="mt-5">
                <CTA
                  label="Continue to Documents"
                  chevron
                  onPress={() => navigation.navigate("DocumentsUpload")}
                />
              </View>
            </Card>
          </View>

          <View className="mt-5 items-center">
            <ScriptText size={14} color={colors.slate500}>
              “Together for a healthier, brighter tomorrow”
            </ScriptText>
            <Text className="mt-0.5" style={{ color: colors.pink }}>
              ♡
            </Text>
          </View>
        </ScrollView>

        <OptionSheet
          visible={showGender}
          title="Gender"
          options={GENDERS}
          value={gender}
          onSelect={(_id, label) => setGender(label)}
          onClose={() => setShowGender(false)}
        />

        <OptionSheet
          visible={showState}
          title="State"
          options={states}
          value={stateId}
          onSelect={pickState}
          onClose={() => setShowState(false)}
        />

        <OptionSheet
          visible={showIncome}
          title="Annual Family Income"
          options={INCOME_BANDS}
          value={income}
          onSelect={(_id, label) => setIncome(label)}
          onClose={() => setShowIncome(false)}
        />

        <OptionSheet
          visible={showRation}
          title="Ration Card"
          options={RATION_CARDS}
          value={rationCard}
          onSelect={(_id, label) => setRationCard(label)}
          onClose={() => setShowRation(false)}
        />

        <OptionSheet
          visible={showInsurance}
          title="Health Insurance"
          options={INSURANCE_STATUS}
          value={insurance}
          onSelect={(_id, label) => setInsurance(label)}
          onClose={() => setShowInsurance(false)}
        />

        <OptionSheet
          visible={showDistrict}
          title="District"
          options={districts}
          value={districts.find((d) => d.name === districtLabel)?.id}
          onSelect={(_id, label) => setDistrictLabel(label)}
          onClose={() => setShowDistrict(false)}
        />

        {/* Web has no native date dialog; this sheet stands in there. */}
        {Platform.OS === "web" && (
          <DateSheet
            visible={showDatePicker}
            value={dateOfBirth ?? undefined}
            onConfirm={setDateOfBirth}
            onClose={() => setShowDatePicker(false)}
          />
        )}
      </SafeAreaView>
    </ScreenWash>
  );
}
