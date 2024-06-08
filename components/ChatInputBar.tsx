import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
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
import AnsweringAnimationItem from "./chat/AnsweringAnimationItem";

const ChatInputBar = ({
  sendMessage,
  isLoading,
  isDisabled = false,
}: {
  sendMessage: (message: Message) => void;
  isLoading?: boolean;
  isDisabled: boolean;
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
        style={styles.gradientContainer}
        colors={[Colors.white, Colors.secondaryWhite]}
        start={[0, 0]}
        end={[1, 1]}
      />
      {isLoading && (
        <View style={styles.animationContainer}>
          <AnsweringAnimationItem />
        </View>
      )}
      <LinearGradient
        colors={[Colors.primarySkyBlue, Colors.secondaryWhite, Colors.white]}
        style={styles.bottomChatbar}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <TextInput
          editable={!isLoading && !isDisabled}
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          placeholderTextColor={"#A0B7D6"}
          onSubmitEditing={handleSend}
        />
      </LinearGradient>

      <TouchableOpacity
        disabled={isLoading || isDisabled}
        onPress={handleSend}
        style={styles.sendButton}
      >
        <LinearGradient
          style={styles.sendButtonGradientContainer}
          start={[0, 0]}
          end={[1, 1]}
          colors={Colors.light.components.button.purple.background}
        />
        <Ionicons name="send" size={hp(2.7)} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInputBar;

const styles = StyleSheet.create({
  bottomChatbarContainer: {
    borderTopWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    height: hp(8),
    width: wp(100),
    zIndex: 49,
    gap: wp(2),
    elevation: 5,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  animationContainer: {
    position: "absolute",
    right: wp(4),
    left: wp(4),
    top: hp(-8),
    zIndex: 50,
    alignItems: "center",
  },
  sendButtonGradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    flex: 1,
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    paddingHorizontal: wp(1),
    paddingVertical: hp(1),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  sendButton: {
    justifyContent: "center",
    borderBottomColor: Colors.darkBlue,
    borderLeftColor: Colors.darkBlue,
    borderLeftWidth: 0.25,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderRightColor: Colors.darkBlue,
    backgroundColor: Colors.darkBlue,
    alignItems: "center",
    elevation: 10,
    shadowColor: Colors.cardDropShadow,
    flexDirection: "row",
    gap: wp(2),
    height: hp(ComponentParams.button.height.medium),
    aspectRatio: 1,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  sendButtonInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  imageIconContainer: {
    marginLeft: wp(2),
  },
});
