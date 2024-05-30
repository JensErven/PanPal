import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { recipeOptionsExampleJsonType } from "@/models/openai/recipeOptionsExampleJsonType";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import ComponentParams from "@/constants/ComponentParams";
import { Ionicons } from "@expo/vector-icons";

const RecipeOptionsContent = ({
  selectOption,
  content,
  disableSelectContent,
}: {
  selectOption: (option: string) => void;
  content: recipeOptionsExampleJsonType;
  disableSelectContent: boolean;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{content.intro}</Text>
      <View style={styles.optionListContainer}>
        {content.options.map((option: any, index: number) => (
          <View key={index} style={styles.optionContainer}>
            <LinearGradient
              colors={Colors.light.components.button.purple.background}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.selectOptionButton}
            >
              <TouchableOpacity
                disabled={disableSelectContent}
                style={styles.touchable}
                key={index}
                onPress={() => selectOption(option)}
              >
                <Ionicons
                  name="checkmark"
                  size={hp(2.7)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </LinearGradient>
            <Text style={styles.text}>{option}</Text>
          </View>
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
    width: "100%",
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
    flex: 1,
  },

  optionListContainer: {
    gap: hp(1),
    flexDirection: "column",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "flex-start",
    width: "100%",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: wp(2),
    marginRight: wp(4),
    width: "100%",
    flexWrap: "wrap",
  },
  selectOptionButton: {
    borderRadius: hp(ComponentParams.button.height.small),
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
  },
  touchable: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.small),
    borderColor: Colors.darkBlue,
    borderWidth: 1,
  },
});
