import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import React from "react";

const ios = Platform.OS === "ios";
const CustomKeyBoardView = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.RefObject<ScrollView>;
}) => {
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        ref={ref}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyBoardView;
