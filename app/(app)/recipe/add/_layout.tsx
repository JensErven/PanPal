import { View, Text } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import CustomHeader from "@/components/CustomHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const _layout = () => {
  return (
    <BottomSheetModalProvider>
      <Slot initialRouteName="add" />
    </BottomSheetModalProvider>
  );
};

export default _layout;
