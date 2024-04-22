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
        name="modal"
        options={{
          headerShown: true,
          title: "Modal",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(add)/customRecipe"
        options={{
          title: "Add custom recipe",
          presentation: "modal",
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <Pressable onPress={() => console.log("save recipe")}>
                {({ pressed }) => (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="(add)/browseRecipe"
        options={{ title: "Browse recipe", presentation: "modal" }}
      ></Stack.Screen>
      <Stack.Screen
        name="(generate)"
        options={{
          title: "PanPal Assistant",
          presentation: "modal",
          headerShown: false,
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
