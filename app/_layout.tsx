import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { StyleSheet } from "react-native";
import { AuthContextProvider, useAuth } from "@/context/authContext";
import { PlusButtonProvider } from "@/context/PlusButtonContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActiveTabContextProvider } from "@/context/activeTabContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    FredokaBold: require("../assets/fonts/fredoka/Fredoka-Bold.ttf"),
    FredokaRegular: require("../assets/fonts/fredoka/Fredoka-Regular.ttf"),
    FredokaMedium: require("../assets/fonts/fredoka/Fredoka-Medium.ttf"),
    FredokaLight: require("../assets/fonts/fredoka/Fredoka-Light.ttf"),
    FredokaSemiBold: require("../assets/fonts/fredoka/Fredoka-SemiBold.ttf"),
    QuickSandRegular: require("../assets/fonts/quicksand/Quicksand-Regular.ttf"),
    QuickSandMedium: require("../assets/fonts/quicksand/Quicksand-Medium.ttf"),
    QuickSandBold: require("../assets/fonts/quicksand/Quicksand-Bold.ttf"),
    QuickSandLight: require("../assets/fonts/quicksand/Quicksand-Light.ttf"),
    QuickSandSemiBold: require("../assets/fonts/quicksand/Quicksand-SemiBold.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated or not
    if (typeof isAuthenticated === "undefined") return;
    const inApp = segments[0] == "(app)";
    if (isAuthenticated && !inApp) {
      // redirect to home
      router.replace("/home");
    } else if (isAuthenticated == false) {
      // redirect to login
      router.replace("/signIn");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthContextProvider>
      <ActiveTabContextProvider>
        <GestureHandlerRootView>
          <PlusButtonProvider>
            <MainLayout />
          </PlusButtonProvider>
        </GestureHandlerRootView>
      </ActiveTabContextProvider>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
