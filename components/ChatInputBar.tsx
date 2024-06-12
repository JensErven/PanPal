import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
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
import RoundButton from "./buttons/RoundButton";
import CustomSheetModal from "./modals/CustomSheetModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import StandardButton from "./buttons/StandardButton";
import * as ImagePicker from "expo-image-picker";
import { blurhash } from "@/utils/general.utils";

type ChatInputBarProps = {
  sendMessage: (message: Message) => void;

  isLoading?: boolean;
  isDisabled: boolean;
};

export type MessageWithImage = {
  role: "system" | "user" | "assistant";
  content: {
    type?: "text" | "image_url";
    text?: string;
    image_url?: {
      url?: string;
    };
  };
};
const ChatInputBar: React.FC<ChatInputBarProps> = ({
  sendMessage,

  isLoading,
  isDisabled,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [image, setImage] = React.useState<string>("");

  const handleSend = () => {
    if (!inputValue) return;

    sendMessage({ role: "user", content: inputValue.trim() });

    setInputValue("");
    setImage("");
  };

  return (
    <>
      <View style={styles.bottomChatbarContainer}>
        <LinearGradient
          style={styles.gradientContainer}
          colors={[Colors.white, Colors.secondaryWhite]}
          start={[0, 0]}
          end={[1, 1]}
        />
        {image !== "" && (
          <View style={{ elevation: 10, shadowColor: Colors.cardDropShadow }}>
            <View style={styles.dismissImageButtonContainer}>
              <RoundButton
                children={
                  <Ionicons name="close" size={hp(2.7)} color={Colors.white} />
                }
                height={ComponentParams.button.height.small}
                transparent={true}
                handlePress={() => setImage("")}
              />
            </View>
            <Image
              style={styles.recipeImage}
              source={image ? image : blurhash}
              placeholder={blurhash}
              contentFit="cover"
              transition={1000}
            />
          </View>
        )}
        {isLoading && (
          <View style={styles.animationContainer}>
            <AnsweringAnimationItem />
          </View>
        )}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: wp(2),
          }}
        >
          <LinearGradient
            colors={[Colors.primarySkyBlue, Colors.secondaryWhite]}
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
              placeholderTextColor={
                Colors.light.components.inputField.placeholderTextColor
              }
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
      </View>
    </>
  );
};

export default ChatInputBar;

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
  modalContent: {
    width: wp(100),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    gap: hp(1),
  },
  bottomChatbarContainer: {
    borderTopWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    flexDirection: "column",
    paddingVertical: hp(1),
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: wp(4),
    minHeight: hp(8),
    width: wp(100),
    zIndex: 49,
    gap: wp(2),
    elevation: 5,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
  },
  dismissImageButtonContainer: {
    position: "absolute",
    top: hp(0.5),
    right: wp(1),
    zIndex: 50,
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  recipeImage: {
    aspectRatio: 1,
    height: hp(ComponentParams.button.height.large * 2),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    justifyContent: "center",
    alignItems: "center",
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
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    borderRightColor: Colors.white,
    borderRightWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    paddingLeft: wp(4),

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
