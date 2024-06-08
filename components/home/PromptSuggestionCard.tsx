import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Svg, Path } from "react-native-svg";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

interface PromptSuggestionCardProps {
  topic: string;
}

const PromptSuggestionCard: React.FC<PromptSuggestionCardProps> = ({
  topic,
}) => {
  const keywords: string[] = [
    "don’t",
    "don't",
    "without",
    "quick and easy",
    "ingredients",
    "healthy",
    "diet",
    "picky",
    "busy",
    "allergy",
    "recipes",
    "cuisine",
    "vegan",
  ];

  const handleNavigateToPanPalChat = (prompt: string) => {
    router.push({
      pathname: `/panpal/chat`,
      params: { prompt },
    });
  };

  const boldTextStyle = (text: string) => {
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isKeyword = keywords.includes(part.toLowerCase());
      return (
        <Text
          key={index}
          style={isKeyword ? styles.boldText : styles.normalText}
        >
          {part}
        </Text>
      );
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleNavigateToPanPalChat(topic)}
      activeOpacity={0.8}
    >
      <LinearGradient
        style={styles.gradientContainer}
        colors={[Colors.white, Colors.secondaryWhite, Colors.primarySkyBlue]}
        start={[0, 0]}
        end={[1, 1]}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{boldTextStyle(topic)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PromptSuggestionCard;

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    flexDirection: "column",
    gap: hp(2),
    display: "flex",
    padding: wp(4),
    shadowColor: Colors.darkBlue,
    elevation: 10,
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    textAlign: "center",
  },
  boldText: {
    fontFamily: Fonts.text_1.fontFamily,
    color: Colors.darkBlue, // or any color you want
  },
  normalText: {
    color: Colors.darkGrey, // or any default text color
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
