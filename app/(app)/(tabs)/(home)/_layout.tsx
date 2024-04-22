import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

const HomeLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
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
});
