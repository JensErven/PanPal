import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "@/constants/ScreenParams";
import HeaderStandard from "@/components/shared/HeaderStandard";

const AddLayout = () => {
  const screenTitle = "Add custom recipe";

  const children = null;
  return (
    <Stack>
      <Stack.Screen
        name="customRecipe"
        options={{
          headerShown: true,

          header: () => (
            <HeaderStandard
              screenTitle={"Add custom recipe"}
              hasGoBackButton={true}
              children={children}
            ></HeaderStandard>
          ),
        }}
      />
    </Stack>
  );
};

export default AddLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dde1e7",
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: SCREEN_WIDTH,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  headerContainer: {
    display: "flex",
    height: "auto",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
  },
  goBackButtonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dde1e7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
});
