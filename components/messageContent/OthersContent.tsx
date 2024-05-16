import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { recipeOptionsExampleJsonType } from "@/models/openai/recipeOptionsExampleJsonType";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { tipsExampleJsonType } from "@/models/openai/tipsExampleJsonType";
import { othersExampleJsonType } from "@/models/openai/othersExampleJsonType.ts";
const OthersContent = ({ content }: { content: othersExampleJsonType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{content.intro}</Text>
      <Text style={styles.text}>{content.text}</Text>
    </View>
  );
};

export default OthersContent;

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
});