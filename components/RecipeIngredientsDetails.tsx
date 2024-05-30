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
import { measurements } from "@/constants/Measurements";
import { Image } from "expo-image";
import { getIngredientImage } from "@/utils/file.utils";
import { blurhash } from "@/utils/general.utils";
import StandardButton from "./buttons/StandardButton";
import { LinearGradient } from "expo-linear-gradient";

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

  /**
   * Formats an ingredient with bold text for measurements and normal font weight for the rest.
   * @param {string} value - The ingredient value.
   * @param {string[]} measurements - An array of measurement words.
   * @returns {JSX.Element} - The formatted ingredient as JSX.
   */
  const formatIngredient = (value: string, measurements: string[]) => {
    const parts = value.split(" ");

    // Check if each part is a measurement word
    const formattedParts = parts.map((part, index) => {
      const isMeasurement = measurements.includes(part.toLowerCase());
      return isMeasurement ? (
        <Text key={index} style={{ fontFamily: Fonts.text_1.fontFamily }}>
          {part}
        </Text>
      ) : (
        part
      );
    });

    return (
      <Text>
        {formattedParts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 ? " " : ""}
            {part}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.ingredientsList}>
        {changedIngredients.map((ingredient: string, index: number) => (
          <View key={index} style={styles.ingredientItem}>
            <LinearGradient
              style={styles.stepNumber}
              colors={[Colors.white, Colors.primarySkyBlue]}
            >
              {ingredientImages[index] ? (
                <Image
                  style={styles.ingredientImage}
                  source={ingredientImages[index]}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={500}
                />
              ) : (
                <Ionicons
                  name="image"
                  size={hp(2.7)}
                  color={Colors.primarySkyBlue}
                />
              )}
            </LinearGradient>
            <Text style={[styles.text]}>
              {formatIngredient(ingredient, measurements)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecipeIngredientsDetails;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: hp(4),
  },
  ingredientsList: {
    gap: hp(2),
    flexDirection: "column",
    paddingBottom: hp(4),
  },
  text: {
    width: "100%",
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlignVertical: "center",
  },
  stepNumber: {
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    aspectRatio: 1,
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
  },
  ingredientImage: {
    backgroundColor: "transparent",
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
  },
  ingredientItem: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    minHeight: hp(ComponentParams.button.height.large),
    width: "100%",
    paddingVertical: wp(1),
    paddingHorizontal: wp(1),
    borderWidth: 1,
    borderColor: Colors.primarySkyBlue,
    borderRadius: hp(ComponentParams.button.height.large / 2),
  },
});
