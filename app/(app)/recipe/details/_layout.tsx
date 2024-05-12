import React from "react";
import { Slot } from "expo-router";
import CustomHeader from "@/components/navigation/CustomHeader";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const _layout = () => {
  return (
    <>
      <BottomSheetModalProvider>
        <Slot initialRouteName="details" />
      </BottomSheetModalProvider>
    </>
  );
};

export default _layout;
