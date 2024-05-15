import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

const StartPage = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[
        Colors.light.navHeader[2],
        Colors.light.navHeader[1],
        Colors.light.navHeader[0],
      ]}
      start={[0, 0]}
      end={[1, 1]}
    >
      <ActivityIndicator size="large" color={Colors.white} />
    </LinearGradient>
  );
};

export default StartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
