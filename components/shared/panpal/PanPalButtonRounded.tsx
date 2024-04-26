import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PanPalButtonRounded = () => {
  const [hasMessage, setHasMessage] = useState(true);
  const handlePanPalButtonPress = () => {
    router.navigate("(generate)");
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.panPalButtonContainer}
      onPress={() => handlePanPalButtonPress()}
    >
      {/* Add a conditional rendering for the message icon */}
      <View style={styles.panPalButtonContent}>
        <Text className="font-extrabold text-lg">PP</Text>
        {hasMessage && <View style={styles.messageAlertContainer}></View>}
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
    backgroundColor: "#dde1e7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 58,
    height: 58,
    borderRadius: 29,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ECF0F3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
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
