import React from "react";
import { Slot } from "expo-router";
import CustomHeader from "@/components/navigation/CustomHeader";

const _layout = () => {
  return (
    <>
      <CustomHeader
        headerTitle={"details"}
        hasGoBack={true}
        isTransparent={false}
      />
      <Slot initialRouteName="Details" />
    </>
  );
};

export default _layout;
