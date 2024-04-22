import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type MessageProps = {
  state: string;
  message: string;
};

const Message = ({ state, message }: MessageProps) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={state === "error" ? "close" : "checkmark"}
        size={24}
        color={state === "error" ? "red" : "green"}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    width: "80%",
  },
  text: {
    marginLeft: 10,
  },
});
