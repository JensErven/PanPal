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
import { LinearGradient } from "expo-linear-gradient";

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

      <LinearGradient
        colors={[Colors.primarySkyBlue, Colors.secondaryWhite]}
        style={styles.contentItemInput}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <TextInput
          maxLength={maxCharAmount}
          multiline={true}
          style={styles.textInput}
          value={recipe?.description}
          placeholder="about this recipe"
          placeholderTextColor={
            Colors.light.components.inputField.placeholderTextColor
          }
          onChangeText={(text: string) => {
            if (recipe) setRecipe({ ...recipe, description: text });
          }}
        />
      </LinearGradient>
    </View>
  );
};

export default EditRecipeDescription;

const styles = StyleSheet.create({
  contentItemInput: {
    flex: 1,
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
  textInput: {
    width: "100%",
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),

    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
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
