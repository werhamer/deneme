import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useColorScheme } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useAppStore } from "@/store/appStore";

export const unstable_settings = {
  initialRouteName: "onboarding",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const { hasOnboarded } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Handle redirects based on onboarding status
  useEffect(() => {
    if (!loaded) return;

    const inAuthGroup = segments[0] === "onboarding";
    const inAppGroup = segments[0] === "(tabs)";

    if (hasOnboarded && inAuthGroup) {
      // Redirect to app if already onboarded but trying to access onboarding
      router.replace("/(tabs)");
    } else if (!hasOnboarded && inAppGroup) {
      // Redirect to onboarding if not onboarded but trying to access app
      router.replace("/onboarding");
    }
  }, [hasOnboarded, loaded, segments, router]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Geri",
        headerStyle: {
          backgroundColor: "#4CAF50",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="emergency" 
        options={{ 
          presentation: "modal",
          title: "Kriz Anı Desteği",
          headerStyle: {
            backgroundColor: "#FF5252",
          },
        }} 
      />
      <Stack.Screen 
        name="milestone/[id]" 
        options={{ 
          title: "Kilometre Taşı",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Ayarlar",
          presentation: "card",
        }} 
      />
    </Stack>
  );
}