import { View, Text, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import { measurements } from "@/constants/Measurements";
import { getIngredientImage } from "@/utils/file.utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";

type IngredientListItemProps = {
  ingredient: string;
};

const IngredientListItem: React.FC<IngredientListItemProps> = ({
  ingredient,
}) => {
  const ingredientImage = useMemo(() => {
    try {
      return getIngredientImage(ingredient);
    } catch (error) {
      return "";
    }
  }, [ingredient]);

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
      <LinearGradient
        style={styles.gradientContainer}
        colors={[Colors.white, Colors.secondaryWhite]}
        start={[0, 0]}
        end={[1, 1]}
      />

      <View style={styles.ingredientImageContainer}>
        <LinearGradient
          style={styles.ingredientImageGradientContainer}
          colors={[Colors.white, Colors.secondaryWhite]}
          start={[0, 0]}
          end={[1, 1]}
        />
        {ingredientImage ? (
          <Image
            style={styles.ingredientImage}
            source={ingredientImage}
            placeholder={blurhash}
            contentFit="cover"
            transition={500}
          />
        ) : (
          <Ionicons name="image" size={hp(2.7)} color={Colors.primarySkyBlue} />
        )}
      </View>

      <Text style={styles.text}>
        {formatIngredient(ingredient, measurements)}
      </Text>
    </View>
  );
};

export default IngredientListItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    backgroundColor: Colors.white,
    alignItems: "center",
    elevation: 10,
    shadowColor: Colors.cardDropShadow,
    flexDirection: "row",
    gap: wp(2),
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
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
    width: "100%",
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlignVertical: "center",
    marginBottom: hp(0.5),
  },
  ingredientImageContainer: {
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    aspectRatio: 1,
    width: hp(ComponentParams.button.height.medium) - 1,
  },
  ingredientImageGradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ingredientImage: {
    backgroundColor: "transparent",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    width: hp(ComponentParams.button.height.small),
    aspectRatio: 1,
  },
});
