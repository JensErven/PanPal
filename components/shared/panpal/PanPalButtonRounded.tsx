import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BUTTON_HEIGHT_LARGE } from "@/constants/ScreenParams";
import Colors from "@/constants/Colors";

const PanPalButtonRounded = () => {
  const [hasMessage, setHasMessage] = useState(true);
  const handlePanPalButtonPress = () => {
    router.navigate("generate/chat");
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.panPalButtonContainer}
      onPress={() => handlePanPalButtonPress()}
    >
      {/* Add a conditional rendering for the message icon */}
      <View style={styles.panPalButtonContent}>
        <Text style={styles.panPalButtonText}>PP</Text>
        {!hasMessage && <View style={styles.messageAlertContainer}></View>}
      </View>
    </TouchableOpacity>
  );
};

export default PanPalButtonRounded;

const styles = StyleSheet.create({
  panPalButtonContainer: {
    position: "relative",
  },
  panPalButtonContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_HEIGHT_LARGE,
    height: BUTTON_HEIGHT_LARGE,
    borderRadius: BUTTON_HEIGHT_LARGE / 2,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.porcelain,
    shadowColor: Colors.slate,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 1,
    backgroundColor: Colors.midnight,
  },
  panPalButtonText: {
    color: Colors.pearl,
    fontWeight: "bold",
    fontSize: 18,
  },
  messageAlertContainer: {
    zIndex: 1,
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "lightgreen",
    width: 10,
    height: 10,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
