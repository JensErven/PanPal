import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
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
        <View style={[styles.container, styles.userMessageContainer]}>
          <LinearGradient
            style={styles.gradientContainer}
            colors={[
              Colors.light.components.button.purple.background[0],
              Colors.light.components.button.purple.background[1],
            ]}
            start={[0.5, 0]}
            end={[0.5, 1]}
          />
          <View style={styles.messageContent}>
            <Text style={[{ color: Colors.white }, styles.messageText]}>
              {message.content}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.container, styles.assistantMessageContainer]}>
          <LinearGradient
            colors={[
              Colors.white,
              Colors.secondaryWhite,
              Colors.primarySkyBlue,
            ]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientContainer}
          />
          <View style={styles.messageContent}>
            {message.imageUrl && (
              <Image
                style={styles.messageImage}
                source={{ uri: message.imageUrl }} // Use uri for local file or network image
                resizeMode="cover" // Adjust resizeMode as per your requirement
              />
            )}
            {renderContent(
              message.content,
              handleSelectRecipeOption,
              disableSelectOption
            )}
          </View>
        </View>
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
    backgroundColor: Colors.darkBlue,
    borderTopColor: Colors.darkBlue,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderRightColor: Colors.darkBlue,
    borderLeftColor: Colors.darkBlue,
    borderLeftWidth: 1,
    alignSelf: "flex-end",
  },
  messageImage: {
    aspectRatio: 1,
    height: hp(ComponentParams.button.height.large * 2),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  assistantMessageContainer: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    alignSelf: "flex-start",
  },
  container: {
    maxWidth: wp(80),
    elevation: 10,
    shadowColor: Colors.cardDropShadow,
    minHeight: hp(ComponentParams.button.height.large),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(ComponentParams.button.height.large / 2),
    display: "flex",
  },
  messageContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.large / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  messageText: {
    color: Colors.white,
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
  },
});

export default MessageCard;
