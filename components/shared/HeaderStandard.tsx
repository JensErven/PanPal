import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import {
  BORDER_RADIUS_MEDIUM,
  BUTTON_HEIGHT_MEDIUM,
  ICON_SIZE_MEDIUM,
  NAVIGATION_BOTTOM_TABS_HEIGHT,
  SCREEN_WIDTH,
} from "@/constants/ScreenParams";
import { SafeAreaView } from "react-native-safe-area-context";

const HeaderStandard = ({
  screenTitle,
  hasGoBackButton,
  children,
}: {
  screenTitle: string;
  hasGoBackButton: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContentLeftContainer}>
          {hasGoBackButton ? (
            <TouchableOpacity
              style={styles.goBackButtonContainer}
              activeOpacity={1}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={ICON_SIZE_MEDIUM}
                color={Colors.midnight}
              />
            </TouchableOpacity>
          ) : null}

          <Text style={styles.headerTitle}>{screenTitle}</Text>
        </View>
        <View>{children}</View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderStandard;

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
  headerContentLeftContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
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
  goBackButtonContainer: {
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
  headerTitle: {
    fontSize: 24,
    color: Colors.midnight,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
