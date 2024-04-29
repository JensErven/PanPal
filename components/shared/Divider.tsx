import { View, Text, useColorScheme, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

const Divider = () => {
  const colorScheme = useColorScheme();
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;
  return <View style={[styles.container, themeContainerStyle]}></View>;
};

export default Divider;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 1,
  },
  lightContainer: {
    backgroundColor: Colors.frost,
  },
  darkContainer: {
    backgroundColor: Colors.midnight,
  },
});
