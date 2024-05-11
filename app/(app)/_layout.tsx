import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import CustomHeader from "@/components/CustomHeader";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="panpal"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="recipe"
        options={{
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(welcome)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
    </Stack>
  );
};

export default _layout;
