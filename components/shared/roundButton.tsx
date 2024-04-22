import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const RoundButton = ({ onButtonClick, icon, buttonId, size, type }: any) => {
  const handleOnClick = () => {
    onButtonClick(buttonId);
  };

  const buttonSize = size || 30; // Default size is 30 if size prop is not provided

  const buttonStyles = StyleSheet.create({
    button: {
      backgroundColor: type === "dependent" ? "white" : "blue",
      borderRadius: buttonSize / 2,
      width: buttonSize,
      height: buttonSize,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      color: type === "dependent" ? "blue" : "white",
      fontWeight: "bold",
    },
  });

  return (
    <TouchableOpacity style={buttonStyles.button} onPress={handleOnClick}>
      <Ionicons
        name={icon}
        size={buttonSize / 2}
        color={type === "dependent" ? "blue" : "white"}
      />
    </TouchableOpacity>
  );
};

export default RoundButton;
