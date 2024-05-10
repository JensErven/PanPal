import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import CustomHeader from "@/components/CustomHeader";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="intro"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
