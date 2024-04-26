import { View, Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
const NAVIGATION_BOTTOM_TABS_HEIGHT = 67; // Adjust as needed
const HomeLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <Text>Home</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <Pressable
                onPress={() => router.push("/(app)/(tabs)/(home)/profile")}
              >
                {({ pressed }) => (
                  <Ionicons
                    name="person-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="preferences" options={{ title: "Preferences" }} />
    </Stack>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#dde1e7",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
  },
});
