import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
const Generatelayout = () => {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="generate"
        options={{
          title: "PanPal Assistant",
        }}
      />
    </Stack>
  );
};

export default Generatelayout;

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
