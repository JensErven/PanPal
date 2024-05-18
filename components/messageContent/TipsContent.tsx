import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { recipeOptionsExampleJsonType } from "@/models/openai/recipeOptionsExampleJsonType";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { tipsExampleJsonType } from "@/models/openai/tipsExampleJsonType";
const TipsContent = ({ content }: { content: tipsExampleJsonType }) => {
  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{content.intro}</Text>
      <View style={styles.optionListContainer}>
        {content.tips.map((option: any, index: number) => (
          <Text style={styles.text} key={index}>
            {index + 1}. {option}
          </Text>
        ))}
      </View>
      <Text style={styles.text}>{content.outro}</Text>
    </View>
  );
};

export default TipsContent;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    gap: hp(2),
  },
  title: {
    fontFamily: Fonts.QuickSandBold.fontFamily,
    fontSize: Fonts.QuickSandBold.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.QuickSandBold.lineHeight,
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
