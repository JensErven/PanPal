import { View, Text } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import CustomHeader from "@/components/CustomHeader";

const _layout = () => {
  return (
    <>
      <CustomHeader
        headerTitle={"add"}
        hasGoBack={true}
        isTransparent={false}
      />
      <Slot initialRouteName="add" />
    </>
  );
};

export default _layout;
