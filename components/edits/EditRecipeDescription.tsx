import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import { RecipeType } from "@/models/RecipeType";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import RoundButton from "@/components/buttons/RoundButton";

const EditRecipeDescription = ({
  recipe,
  setRecipe,
  maxCharAmount,
}: {
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
  maxCharAmount: number;
}) => {
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
        <Text style={styles.contentItemTitle}>Description</Text>
        <Text style={styles.text}>
          {recipe?.description?.length || 0}/{maxCharAmount}
        </Text>
      </View>

      <TextInput
        maxLength={maxCharAmount}
        multiline={true}
        style={styles.contentItemInput}
        value={recipe?.description}
        placeholder="about this recipe"
        placeholderTextColor={"#A0B7D6"}
        onChangeText={(text: string) => {
          if (recipe) setRecipe({ ...recipe, description: text });
        }}
      />
    </View>
  );
};

export default EditRecipeDescription;

const styles = StyleSheet.create({
  contentItemInput: {
    flex: 1,
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
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
});
