import React from "react";
import { Slot } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const _layout = () => {
  return <Slot initialRouteName="add" />;
};

export default _layout;
