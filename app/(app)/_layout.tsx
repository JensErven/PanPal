import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useSession } from "@/context/auth";
import { Stack, Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
export default function AppEntry() {
  const { session, isLoading } = useSession();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return <Text>Loading....</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add"
        options={{
          headerShown: false,
          title: "Add custom recipe",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="generate"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="profile"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_right",
        }}
      ></Stack.Screen>
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
