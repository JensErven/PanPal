import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  SCREEN_WIDTH,
  NAVIGATION_BOTTOM_TABS_HEIGHT,
} from "@/constants/ScreenParams";
import { message } from "@/models/message";

const BottomInputfield = ({
  sentMessageData,
  isInputDisabled,
}: {
  sentMessageData: (message: message) => void;
  isInputDisabled: boolean;
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleSendButtonPress = () => {
    if (inputMessage === "") return;
    // Create a message object
    const message: message = {
      message: inputMessage,
      role: "user",
    };
    sentMessageData(message);
    // Send the message
    setInputMessage("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        editable={!isInputDisabled}
        placeholder="Type a message"
        style={styles.inputfield}
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <TouchableOpacity
        style={styles.sendButtonContainer}
        activeOpacity={1}
        onPress={handleSendButtonPress}
      >
        <Ionicons name="send" size={24} color="#ECF0F3" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomInputfield;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
    backgroundColor: "#dde1e7",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    columnGap: 5,
  },
  inputfield: {
    fontSize: 16,
    flex: 1,
    height: 58,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  sendButtonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 58,
    height: 58,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#11263C",
    shadowColor: "#ECF0F3",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ECF0F3",
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 1,
  },
});
