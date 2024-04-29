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
  BUTTON_HEIGHT_MEDIUM,
  BUTTON_HEIGHT_SMALL,
  BORDER_RADIUS_MEDIUM,
  BORDER_RADIUS_SMALL,
} from "@/constants/ScreenParams";
import { message } from "@/models/message";
import Colors from "@/constants/Colors";

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
      id: Math.random().toString(),
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
    backgroundColor: Colors.pearl,
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
    height: BUTTON_HEIGHT_MEDIUM,
    backgroundColor: Colors.porcelain,
    borderTopLeftRadius: BORDER_RADIUS_MEDIUM,
    borderBottomLeftRadius: BORDER_RADIUS_MEDIUM,
    borderTopRightRadius: BORDER_RADIUS_SMALL,
    borderBottomRightRadius: BORDER_RADIUS_SMALL,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.pearl,

    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sendButtonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_HEIGHT_MEDIUM,
    height: BUTTON_HEIGHT_MEDIUM,
    borderTopLeftRadius: BORDER_RADIUS_SMALL,
    borderBottomLeftRadius: BORDER_RADIUS_SMALL,
    borderTopRightRadius: BORDER_RADIUS_MEDIUM,
    borderBottomRightRadius: BORDER_RADIUS_MEDIUM,
    backgroundColor: Colors.midnight,
    borderWidth: 1,
    borderColor: Colors.pearl,

    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
