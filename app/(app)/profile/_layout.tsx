import React from "react";
import { Stack } from "expo-router";
import HeaderStandard from "@/components/shared/HeaderStandard";

const AddLayout = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          presentation: "modal",
          animation: "slide_from_right",
          headerShown: true,

          header: () => (
            <HeaderStandard screenTitle={"profile"} hasGoBackButton={true} />
          ),
        }}
      />
      <Stack.Screen
        name="preferences"
        options={{
          presentation: "modal",
          animation: "slide_from_right",
          headerShown: true,
          header: () => (
            <HeaderStandard
              screenTitle={"preferences"}
              hasGoBackButton={true}
            />
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: "modal",
          animation: "slide_from_right",
          headerShown: true,

          header: () => (
            <HeaderStandard screenTitle={"settings"} hasGoBackButton={true} />
          ),
        }}
      />
    </Stack>
  );
};

export default AddLayout;
