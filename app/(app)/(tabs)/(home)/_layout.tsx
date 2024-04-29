import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  BUTTON_HEIGHT_LARGE,
  BUTTON_HEIGHT_MEDIUM,
  ICON_SIZE_MEDIUM,
  NAVIGATION_BOTTOM_TABS_HEIGHT,
  SCREEN_WIDTH,
} from "@/constants/ScreenParams";
import HeaderStandard from "@/components/shared/HeaderStandard";
import Colors from "@/constants/Colors";
const HomeLayout = () => {
  // give components to the header as content prop
  const children = (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.profileButtonContainer}
        onPress={() => router.navigate("profile")}
      >
        <Ionicons name="person" size={ICON_SIZE_MEDIUM} color={Colors.steel} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: true,
          header: () => (
            <HeaderStandard
              screenTitle={"home"}
              hasGoBackButton={false}
              children={children}
            ></HeaderStandard>
          ),
        }}
      />
    </Stack>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingHorizontal: 15,
    width: SCREEN_WIDTH,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContainer: {
    width: "100%",
    display: "flex",
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
  },
  profileButtonContainer: {
    display: "flex",

    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_HEIGHT_MEDIUM,
    height: BUTTON_HEIGHT_MEDIUM,
    borderRadius: BUTTON_HEIGHT_MEDIUM / 2,
    shadowColor: Colors.midnight,
    backgroundColor: Colors.pearl,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 2,
  },
});
