import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SavedRecipeType } from "@/app/(app)/(tabs)/saved";
import Colors from "@/constants/Colors";
import { blurhash } from "@/utils/common";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { recipeService } from "@/services/db/recipe.services";

const RecipeCard = ({ recipe }: { recipe: SavedRecipeType }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleNavigateToRecipe = async (recipeId: string) => {
    router.push({ pathname: `/recipe/details/`, params: { recipeId } });
  };

  const handleLongPress = () => {
    setShowOverlay(!showOverlay);
  };

  const handleDelete = async () => {
    if (
      recipe.data?.image &&
      recipe.data.image.startsWith("https://firebasestorage.googleapis.com")
    ) {
      await recipeService.deleteImageFromFirebase(recipe.data.image);
    }
    recipeService.deleteRecipe(recipe.id);
    setShowOverlay(false);
  };

  const handleEdit = async (recipeId: string) => {
    router.push({ pathname: `/recipe/edit/`, params: { recipeId } });
    setShowOverlay(false);
  };

  return (
    <LinearGradient
      colors={[Colors.white, "#DDEBF3"]}
      key={recipe.id}
      style={styles.recipeContainer}
    >
      {recipe.data.isGenerated && (
        <View style={[{}, styles.isGeneratedIconContainer]}>
          {recipe.data.isGenerated && (
            <Ionicons
              name="sparkles"
              size={hp(2)}
              color={Colors.mediumPurple}
            />
          )}
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.recipeInnerContainer}
        key={recipe.id}
        onPress={() => handleNavigateToRecipe(recipe.id)}
        onLongPress={handleLongPress}
      >
        {recipe.data.image ? (
          <Image
            style={styles.recipeImage}
            source={recipe.data.image ? recipe.data.image : blurhash}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
        ) : (
          <View style={styles.recipeImage}>
            <Ionicons name="image" size={hp(5)} color={Colors.white} />
          </View>
        )}
        <View style={styles.recipeTextContainer}>
          <Text style={styles.recipeTitle}>{recipe.data.title}</Text>

          <Text style={styles.recipeInfoText}>
            {recipe.data.cuisineType ? recipe.data.cuisineType + " | " : ""}
            {recipe.data.mealType ? recipe.data.mealType + " | " : ""}
            {recipe.data.prepTime && recipe.data.cookTime
              ? recipe.data.prepTime + recipe.data.cookTime + "min"
              : ""}
          </Text>
        </View>
      </TouchableOpacity>
      {showOverlay && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1}>
          <View style={styles.overlayLeft}>
            <LinearGradient
              style={styles.addButton}
              colors={[Colors.darkBlue, Colors.darkBlue]}
            >
              <TouchableOpacity
                onPress={handleLongPress}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="close" size={hp(2.7)} color={Colors.white} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={styles.overlayRight}>
            <LinearGradient
              style={styles.addButton}
              colors={[Colors.darkBlue, Colors.darkBlue]}
            >
              <TouchableOpacity
                onPress={() => handleEdit(recipe.id)}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              style={styles.addButton}
              colors={[Colors.darkBlue, Colors.darkBlue]}
            >
              <TouchableOpacity
                onPress={handleDelete}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="trash" size={hp(2.7)} color={"#FF6666"} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  recipeContainer: {
    flex: 1,
    display: "flex",
    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 4,
    height: hp(15),
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  recipeInnerContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    padding: wp(2),
  },
  isGeneratedIconContainer: {
    position: "absolute",
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.small),
    backgroundColor: Colors.white,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: hp(ComponentParams.button.height.small),
    borderTopLeftRadius: hp(ComponentParams.button.height.small),
    top: wp(0),
    left: wp(0),
    zIndex: 1,
  },
  overlayRight: {
    display: "flex",
    flexDirection: "row",
    gap: wp(2),
  },
  overlayLeft: {
    display: "flex",
    flexDirection: "row",
    gap: wp(2),
  },
  recipeImage: {
    aspectRatio: 1,
    height: "100%",
    borderRadius: hp(3),
    backgroundColor: Colors.secondaryWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeTextContainer: {
    alignItems: "stretch",
    display: "flex",
    justifyContent: "space-between",

    flex: 1,
    height: "100%",
  },
  recipeTitle: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
  recipeInfoText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },

  // overlay
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: hp(ComponentParams.button.height.small),
  },
  overlayButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  addButton: {
    display: "flex",
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
  },
});
