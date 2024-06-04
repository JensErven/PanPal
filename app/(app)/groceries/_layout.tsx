import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add" />
      <Stack.Screen name="details/[id]" />
      <Stack.Screen name="join" />
    </Stack>
  );
};

export default _layout;
