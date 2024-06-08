import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ViewToken,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/Colors";
import { blurhash } from "@/utils/general.utils";
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
import RoundButton from "../buttons/RoundButton";
import * as Haptics from "expo-haptics";
import { SavedRecipeType } from "@/models/SavedRecipeType";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const RecipeCard = ({
  viewableItems,
  recipe,
  allowedToEdit = false,
  allowedToDelete = false,
}: {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  recipe: SavedRecipeType;
  allowedToEdit: boolean;
  allowedToDelete: boolean;
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const { deleteRecipe, deleteImageFromFirebase } = recipeService;
  const handleNavigateToRecipe = async (recipeId: string) => {
    router.push({
      pathname: `/recipe/details/${recipeId}`,
    });
  };

  const rStyle = useAnimatedStyle(() => {
    const isVisible: boolean =
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItems) => viewableItems.item.id === recipe.id) !==
      undefined;

    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 250 }),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.7, { duration: 250 }),
        },
      ],
    };
  }, []);

  const handleLongPress = () => {
    setShowOverlay(!showOverlay);
    Haptics.selectionAsync();
  };

  const handleDelete = async () => {
    if (!allowedToDelete) return;
    if (!recipe) return;
    deleteImageFromFirebase(recipe.data.image as string);
    deleteRecipe(recipe.id);

    setShowOverlay(false);
  };

  const handleNavigateToEdit = async (recipeId: string) => {
    if (!allowedToEdit) return;
    router.push({ pathname: `/recipe/edit/${recipeId}` });
    setShowOverlay(false);
  };

  return (
    <Animated.View style={[rStyle, styles.container]}>
      <LinearGradient
        colors={[Colors.white, Colors.secondaryWhite]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradientContainer}
      />
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
            <Ionicons name="image" size={hp(5)} color={Colors.primarySkyBlue} />
          </View>
        )}
        <View style={styles.recipeTextContainer}>
          <Text
            style={styles.recipeTitle}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {recipe.data.title}
          </Text>

          <Text
            style={styles.recipeInfoText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {recipe.data.cuisineType ? recipe.data.cuisineType + " | " : ""}
            {recipe.data.mealType ? recipe.data.mealType : ""}
          </Text>
        </View>
      </TouchableOpacity>
      {showOverlay && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1}>
          <View style={styles.overlayLeft}>
            <RoundButton handlePress={handleLongPress}>
              <Ionicons name="close" size={hp(2.7)} color={Colors.white} />
            </RoundButton>
          </View>
          <View style={styles.overlayRight}>
            {!recipe.data.isGenerated && allowedToEdit && (
              <RoundButton
                transparent={false}
                handlePress={() => handleNavigateToEdit(recipe.id)}
                backgroundColor={Colors.mediumBlue}
              >
                <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
              </RoundButton>
            )}
            {allowedToDelete && (
              <RoundButton
                handlePress={handleDelete}
                transparent={false}
                backgroundColor="#C70000"
              >
                <Ionicons name="trash" size={hp(2.7)} color={Colors.white} />
              </RoundButton>
            )}
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
    marginHorizontal: wp(4),
    height: hp(14),
    borderRadius: hp(ComponentParams.button.height.large / 2),
    overflow: "hidden",
    shadowColor: Colors.cardDropShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.large / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingHorizontal: wp(4),
    height: hp(ComponentParams.button.height.small),
    backgroundColor: Colors.white,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: hp(ComponentParams.button.height.medium / 2),

    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
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
    marginLeft: wp(4.8),
  },
  recipeImage: {
    aspectRatio: 1,
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
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
    color: Colors.darkGrey,
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
    backgroundColor: "rgba(0, 0, 0, 0.50)",
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
