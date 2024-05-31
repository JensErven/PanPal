// src/screens/groceries/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

const GroceriesLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default GroceriesLayout;
