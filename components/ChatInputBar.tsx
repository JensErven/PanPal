import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import { Message } from "@/models/Message";

const ChatInputBar = ({
  sendMessage,
}: {
  sendMessage: (message: Message) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSend = () => {
    if (!inputValue) return;
    sendMessage({ role: "user", content: inputValue.trim() });
    setInputValue("");
  };

  return (
    <View style={styles.bottomChatbarContainer}>
      <LinearGradient
        colors={[Colors.white, "#DDEBF3"]}
        style={styles.bottomChatbar}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
      </LinearGradient>
      <LinearGradient
        style={styles.sendButton}
        colors={Colors.light.components.button.purple.background}
      >
        <TouchableOpacity
          disabled={!inputValue}
          onPress={handleSend}
          style={styles.sendButtonInnerContainer}
        >
          <Ionicons name="send" size={hp(2.7)} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ChatInputBar;

const styles = StyleSheet.create({
  bottomChatbarContainer: {
    borderTopWidth: 1,
    borderColor: "#DDEBF3",
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    height: hp(8),
    width: wp(100),
    zIndex: 50,
    gap: wp(2),
  },
  bottomChatbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: hp(5),
    paddingHorizontal: wp(4),
    height: hp(ComponentParams.button.height.medium),
    flex: 1,
  },
  textInput: {
    height: "100%",
    width: "100%",
    flex: 1,
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkBlue,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    width: hp(ComponentParams.button.height.medium),
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 2,
    borderColor: Colors.light.components.button.purple.background[0],
    backgroundColor: Colors.light.components.button.purple.background[0],
  },
  sendButtonInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
