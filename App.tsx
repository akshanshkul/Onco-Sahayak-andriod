import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import RegistrationWaiting from "./src/screens/RegistrationWaiting";
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
  RegistrationWaiting: undefined;
  Main: { tab?: string } | undefined;
  HospitalDetails: { hospital: Hospital };
  NgoDetails: { ngo: Ngo };
  AISupport: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList, undefined>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<"Welcome" | "Main" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("auth_token")
      .then((token) => setInitialRoute(token ? "Main" : "Welcome"))
      .catch(() => setInitialRoute("Welcome"));
  }, []);

  if (!initialRoute) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5FAFD" }}>
          <ActivityIndicator size="large" color="#168A59" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    // SafeAreaProvider must wrap the tree so every screen's SafeAreaView and
    // useSafeAreaInsets() get real notch / status-bar / gesture-bar values.
    <SafeAreaProvider>
      <I18nProvider>
      <LocationProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 260,
            contentStyle: { backgroundColor: "#F5FAFD" },
          }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              presentation: "card",
              animation: "fade",
              animationDuration: 300,
              animationMatchesGesture: true,
              contentStyle: { backgroundColor: "#F5FAFD" },
              gestureEnabled: true,
            }}
          />
          <Stack.Screen name="DocumentsUpload" component={DocumentsUpload} />
          <Stack.Screen name="RegistrationWaiting" component={RegistrationWaiting} />
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
