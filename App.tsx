import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocationProvider } from "./src/location";
import { I18nProvider } from "./src/i18n";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import Welcome from "./src/screens/Welcome";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import DocumentsUpload from "./src/screens/DocumentsUpload";
import MainTabs from "./src/navigation/MainTabs";
import HospitalDetails from "./src/screens/HospitalDetails";
import NgoDetails from "./src/screens/NgoDetails";
import AISupport from "./src/screens/AISupport";
import type { Hospital } from "./src/data/hospitals";
import type { Ngo } from "./src/data/ngos";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  DocumentsUpload: undefined;
  Main: { tab?: string } | undefined;
  HospitalDetails: { hospital: Hospital };
  NgoDetails: { ngo: Ngo };
  AISupport: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList, undefined>();

export default function App() {
  return (
    // SafeAreaProvider must wrap the tree so every screen's SafeAreaView and
    // useSafeAreaInsets() get real notch / status-bar / gesture-bar values.
    <SafeAreaProvider>
      <I18nProvider>
      <LocationProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="DocumentsUpload" component={DocumentsUpload} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="HospitalDetails" component={HospitalDetails} />
          <Stack.Screen name="NgoDetails" component={NgoDetails} />
          <Stack.Screen name="AISupport" component={AISupport} />
        </Stack.Navigator>
      </NavigationContainer>
      </LocationProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
