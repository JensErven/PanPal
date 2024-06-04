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
          <View
            style={{
              backgroundColor: Colors.secondaryWhite,
              borderRadius: hp(ComponentParams.button.height.medium / 2),
              height: hp(ComponentParams.button.height.medium),
              paddingVertical: hp(1),
              paddingHorizontal: wp(2),
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: wp(2),
            }}
          >
            <TextInput
              maxLength={2}
              keyboardType="numeric"
              style={styles.contentItemInput}
              value={servingsInput}
              placeholder="ex. 4"
              onChangeText={handleServingsChange}
              placeholderTextColor={
                Colors.light.components.inputField.placeholderTextColor
              }
            />
            <Text style={styles.unitText}>Servings</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditRecipeServings;

const styles = StyleSheet.create({
  contentItemInput: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(2),
    height: hp(ComponentParams.button.height.medium),
    borderRightColor: Colors.primarySkyBlue,
    borderRightWidth: 1,
    textAlign: "center",
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
    gap: wp(2),
  },
  unitText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    marginRight: wp(2),
  },
});
