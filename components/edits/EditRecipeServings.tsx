import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import { RecipeType } from "@/models/RecipeType";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import { LinearGradient } from "expo-linear-gradient";

const EditRecipeServings = ({
  recipe = {} as RecipeType,
  setRecipe,
  title = "Servings",
}: {
  title?: string;
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
}) => {
  const [servingsInput, setServingsInput] = React.useState<string>(
    recipe.servings?.toString() || ""
  );

  const handleServingsChange = (text: string) => {
    setServingsInput(text);
    setRecipe({ ...recipe, servings: parseInt(text) });
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
            style={styles.contentItemInput}
            start={[0.5, 0]}
            end={[0.5, 1]}
          >
            <TextInput
              maxLength={2}
              keyboardType="numeric"
              style={styles.textInput}
              value={servingsInput}
              placeholder="ex. 4"
              onChangeText={handleServingsChange}
              placeholderTextColor={
                Colors.light.components.inputField.placeholderTextColor
              }
            />
          </LinearGradient>

          <LinearGradient
            colors={[Colors.white, Colors.secondaryWhite]}
            style={styles.gradientContainer}
            start={[0, 0]}
            end={[1, 1]}
          >
            <Text style={styles.unitText}>Servings</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default EditRecipeServings;

const styles = StyleSheet.create({
  contentItemInput: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderBottomLeftRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    borderRightColor: Colors.white,
    borderRightWidth: 1,
    borderLeftWidth: 0.15,
    borderLeftColor: Colors.white,
  },
  gradientContainer: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    borderRightColor: Colors.white,
    borderRightWidth: 0.25,
    flexDirection: "row",
    paddingHorizontal: wp(4),
    minHeight: hp(ComponentParams.button.height.medium),
    borderTopRightRadius: hp(ComponentParams.button.height.medium / 2),
    borderBottomRightRadius: hp(ComponentParams.button.height.medium / 2),
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  textInput: {
    minHeight: hp(ComponentParams.button.height.medium),
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
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
  contentItemRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
