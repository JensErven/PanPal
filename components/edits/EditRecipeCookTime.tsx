import { View, StyleSheet, Text, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import { RecipeType } from "@/models/RecipeType";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";

const EditRecipeCookTime = ({
  recipe,
  setRecipe,
  title = "Cook Time",
}: {
  title?: string;
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
}) => {
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("0");

  useEffect(() => {
    if (recipe?.cookTime !== undefined) {
      setHours(Math.floor(recipe.cookTime / 60).toString());
      setMinutes((recipe.cookTime % 60).toString());
    }
  }, [recipe]);

  const handleHourChange = (text: string) => {
    setHours(text);
    updateCookTime(text, minutes);
  };

  const handleMinuteChange = (text: string) => {
    setMinutes(text);
    updateCookTime(hours, text);
  };

  const updateCookTime = (hours: string, minutes: string) => {
    const newHours = parseInt(hours, 10);
    const newMinutes = parseInt(minutes, 10);

    const totalMinutes =
      (isNaN(newHours) ? 0 : newHours * 60) +
      (isNaN(newMinutes) ? 0 : newMinutes);

    setRecipe({ ...recipe, cookTime: totalMinutes });
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={styles.contentItemTitle}>{title}</Text>
        <View style={styles.contentItemRight}>
          <LinearGradient
            colors={[Colors.primarySkyBlue, Colors.secondaryWhite]}
            style={styles.gradientContainer}
            start={[0.5, 0]}
            end={[0.5, 1]}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              maxLength={2}
              keyboardType="numeric"
              style={styles.contentItemInput}
              value={hours}
              placeholder="hh"
              onChangeText={handleHourChange}
              placeholderTextColor={
                Colors.light.components.inputField.placeholderTextColor
              }
              onEndEditing={() => updateCookTime(hours, minutes)}
            />
            <Text style={styles.unitText}>h</Text>
          </View>
          <View style={styles.verticalLine}></View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              maxLength={2}
              keyboardType="numeric"
              style={styles.contentItemInput}
              value={minutes}
              placeholder="mm"
              onChangeText={handleMinuteChange}
              placeholderTextColor={
                Colors.light.components.inputField.placeholderTextColor
              }
              onEndEditing={() => updateCookTime(hours, minutes)}
            />
            <Text style={styles.unitText}>m</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditRecipeCookTime;

const styles = StyleSheet.create({
  contentItemInput: {
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemTitle: {
    color: Colors.darkGrey,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
  },
  verticalLine: {
    height: hp(ComponentParams.button.height.medium),
    width: wp(1),
    backgroundColor: Colors.secondaryWhite,
  },
  contentItemRight: {
    gap: wp(2),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    borderRightColor: Colors.white,
    borderRightWidth: 1,
  },
  unitText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
