import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import RecipeServingsCounter from "./RecipeServingsCounter";
import { Ionicons } from "@expo/vector-icons";
import { updateIngredientQuantities } from "@/utils/general.utils";
import { Image } from "expo-image";
import { getIngredientImage } from "@/utils/file.utils";
import { blurhash } from "@/utils/general.utils";
import { LinearGradient } from "expo-linear-gradient";
import IngredientListItem from "./recipe/IngredientListItem";

const RecipeIngredientsDetails = ({
  ingredients,
  servings,
}: {
  ingredients: string[];
  servings: number;
}) => {
  const [changingServings, setChangingServings] = React.useState(servings);
  const [ingredientImages, setIngredientImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await Promise.all(
        ingredients.map(async (ingredient: string) => {
          try {
            const imageUrlString = getIngredientImage(ingredient);
            return imageUrlString;
          } catch (error) {
            return "";
          }
        })
      );
      setIngredientImages(images);
    };

    fetchImages();
  }, [ingredients]);

  const handleOpenConvertUnitsModal = () => {};

  const changedIngredients = useMemo(() => {
    return updateIngredientQuantities(ingredients, servings, changingServings);
  }, [changingServings, ingredients, servings]);

  return (
    <View style={styles.ingredientsList}>
      {changedIngredients.map((ingredient: string, index: number) => (
        <IngredientListItem key={index} ingredient={ingredient} />
      ))}
    </View>
  );
};

export default RecipeIngredientsDetails;

const styles = StyleSheet.create({
  ingredientsList: {
    gap: hp(2),
    flexDirection: "column",
    paddingTop: hp(2),
    paddingBottom: hp(8),
  },
});
