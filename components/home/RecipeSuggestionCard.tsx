import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { RecipeType } from "@/models/RecipeType";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import OptionTagButton from "../buttons/OptionTagButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RoundButton from "../buttons/RoundButton";

interface RecipeSuggestionCardProps {
  username: string;
  recipe: RecipeType | null;
  saveRecipe?: () => void;
  loading?: boolean;
}

const RecipeSuggestionCard: React.FC<RecipeSuggestionCardProps> = ({
  recipe,
  username,
  saveRecipe,
  loading,
}) => {
  return (
    <>
      {recipe && (
        <View style={[styles.container]}>
          <LinearGradient
            style={styles.gradientContainer}
            colors={[
              Colors.white,
              Colors.secondaryWhite,
              Colors.primarySkyBlue,
            ]}
            start={[0, 0]}
            end={[1, 1]}
          />
          <View style={styles.saveButtonContainer}>
            <RoundButton
              handlePress={() => saveRecipe && saveRecipe()}
              transparent={false}
              backgroundColor={Colors.secondaryWhite}
              height={ComponentParams.button.height.medium}
              children={
                loading ? (
                  <ActivityIndicator size="small" color={Colors.mediumPurple} />
                ) : (
                  <Ionicons
                    name="bookmark"
                    size={hp(2.7)}
                    color={Colors.primarySkyBlue}
                  />
                )
              }
            />
          </View>
          <View style={[{}, styles.isGeneratedIconContainer]}>
            <Ionicons
              name="sparkles"
              size={hp(2)}
              color={Colors.mediumPurple}
            />
          </View>

          <View style={styles.recipeTextContainer}>
            <Text
              style={styles.usernameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >{`${username}'s`}</Text>
            <Text
              style={styles.recipeTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {recipe.title}
            </Text>

            <Text
              style={styles.recipeInfoText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {recipe.description ? recipe.description : ""}
            </Text>
          </View>
          <View style={styles.recipeTagsContainer}>
            {recipe.cuisineType && (
              <OptionTagButton
                option={recipe.cuisineType}
                selected={true}
                selectOption={() => {
                  return;
                }}
              />
            )}
            {recipe.mealType && (
              <OptionTagButton
                option={recipe.mealType}
                selected={true}
                selectOption={() => {
                  return;
                }}
              />
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default RecipeSuggestionCard;

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    flexDirection: "column",
    gap: hp(2),
    display: "flex",
    paddingTop: hp(6),
    paddingBottom: hp(2),
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.large / 2),
    height: hp(38),
    overflow: "visible",
  },
  isGeneratedIconContainer: {
    position: "absolute",
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.small),
    backgroundColor: Colors.white,
    shadowColor: Colors.darkBlue,
    elevation: 1,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: hp(ComponentParams.button.height.large / 2),
    borderTopLeftRadius: hp(ComponentParams.button.height.large / 2),
    top: wp(0),
    left: wp(0),
    zIndex: 1,
  },
  usernameText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkGrey,
    textTransform: "capitalize",
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  recipeTextContainer: {
    paddingHorizontal: wp(4),
    alignItems: "stretch",
    display: "flex",
    justifyContent: "space-between",
  },
  recipeTitle: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
  recipeInfoText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkGrey,
    textTransform: "capitalize",
  },
  recipeTagsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: wp(2),
    paddingHorizontal: wp(4),
  },
  saveButtonContainer: {
    backgroundColor: Colors.white,
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    elevation: 2,
    shadowColor: Colors.cardDropShadow,
    position: "absolute",
    top: hp(1),
    right: wp(2),
  },
});
