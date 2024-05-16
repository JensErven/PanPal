import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { recipeOptionsExampleJsonType } from "@/models/openai/recipeOptionsExampleJsonType";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
const RecipeOptionsContent = ({
  content,
}: {
  content: recipeOptionsExampleJsonType;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{content.intro}</Text>
      <View style={styles.optionListContainer}>
        {content.options.map((option: any, index: number) => (
          <Text style={styles.text} key={index}>
            {index + 1}. {option}
          </Text>
        ))}
      </View>
      <Text style={styles.text}>{content.callToAction}</Text>
    </View>
  );
};

export default RecipeOptionsContent;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    gap: hp(2),
  },
  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
  },
  optionListContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
});
