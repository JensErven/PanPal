import React from "react";
import { Slot } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const _layout = () => {
  return (
    <BottomSheetModalProvider>
      <Slot initialRouteName="edit" />
    </BottomSheetModalProvider>
  );
};

export default _layout;
