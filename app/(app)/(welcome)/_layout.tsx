import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import CustomHeader from "@/components/CustomHeader";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="setPreferences"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
