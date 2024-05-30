import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Message } from "@/models/Message";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import { LinearGradient } from "expo-linear-gradient";
import RecipeOptionsContent from "./messageContent/RecipeOptionsContent";
import TipsContent from "./messageContent/TipsContent";
import OthersContent from "./messageContent/OthersContent";
import RecipeContent from "./messageContent/RecipeContent";

const MessageCard = ({
  disableSelectOption,
  message,
  index,
  selectRecipeOption,
}: {
  disableSelectOption: boolean;
  message: Message;
  index: number;
  selectRecipeOption: (message: Message) => void;
}) => {
  const handleSelectRecipeOption = (option: string) => {
    const message: Message = {
      role: "user",
      content: option,
    };
    selectRecipeOption(message);
  };

  return (
    <View key={index}>
      {message.role === "system" ? (
        <Text style={{ textAlign: "center" }}>{message.content}</Text>
      ) : message.role === "user" ? (
        <LinearGradient
          colors={[
            Colors.light.components.button.purple.background[1],
            Colors.light.components.button.purple.background[0],
          ]}
          start={[0.5, 0]}
          end={[0.5, 1]}
          style={styles.userMessageContainer}
        >
          <View style={styles.messageContent}>
            <Text style={[{ color: Colors.white }, styles.messageText]}>
              {message.content}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={[Colors.white, Colors.secondaryWhite]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.assistantMessageContainer}
        >
          <View style={styles.messageContent}>
            {renderContent(
              message.content,
              handleSelectRecipeOption,
              disableSelectOption
            )}
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

const renderContent = (
  content: string,
  selectRecipeOption: (option: string) => void,
  disableSelectContent: boolean
) => {
  if (typeof content === "string") {
    const parsedContent = JSON.parse(content);

    // Check the type of content and render accordingly
    if (parsedContent.responseType === "recipe") {
      return <RecipeContent content={parsedContent} />;
    } else if (parsedContent.responseType === "tips") {
      return <TipsContent content={parsedContent} />;
    } else if (parsedContent.responseType === "recipeOptions") {
      return (
        <RecipeOptionsContent
          disableSelectContent={disableSelectContent}
          content={parsedContent}
          selectOption={selectRecipeOption}
        />
      );
    } else if (parsedContent.responseType === "others") {
      return <OthersContent content={parsedContent} />;
    } else {
      // Default case: Render as JSON
      return <JsonViewer content={parsedContent} />;
    }
  }
  return <Text>{content}</Text>;
};

const JsonViewer = ({ content }: { content: any }) => {
  return (
    <View>
      <Text>{JSON.stringify(content, null, 2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userMessageContainer: {
    maxWidth: wp(80),
    elevation: 3,
    shadowColor: Colors.darkGrey,
    backgroundColor: Colors.mediumPurple,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(ComponentParams.button.height.small),
    alignSelf: "flex-end",
  },
  assistantMessageContainer: {
    maxWidth: wp(80),
    width: wp(80),
    elevation: 3,
    shadowColor: Colors.darkGrey,
    backgroundColor: Colors.mediumPurple,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(ComponentParams.button.height.small),
    alignSelf: "flex-start",
    display: "flex",
  },
  messageContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  messageText: {
    color: Colors.white,
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
  },
});

export default MessageCard;
