import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import CustomHeader from "@/components/navigation/CustomHeader";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="chat"
        options={{
          title: "PanPal Chat",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
