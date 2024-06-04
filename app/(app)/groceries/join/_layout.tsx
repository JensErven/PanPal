import React from "react";
import { Slot } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const _layout = () => {
  return <Slot initialRouteName="join" />;
};

export default _layout;
