import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import { getIngredientImage } from "@/utils/file.utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";

type StepListItemProps = {
  step: string;
  index: number;
  selected?: boolean;
  selectedStep: (index: number) => void;
};
const StepListItem: React.FC<StepListItemProps> = ({
  step,
  index,
  selected,
  selectedStep,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => selectedStep(index)}
    >
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
        <Text style={styles.bulletPointText}>{index + 1}</Text>
      </View>

      <Text
        style={[
          styles.text,
          {
            textDecorationLine: selected ? "line-through" : "none",
            textDecorationColor: Colors.mediumPurple,
          },
        ]}
      >
        {step}
      </Text>
    </TouchableOpacity>
  );
};

export default StepListItem;

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
    paddingVertical: hp(1),
    paddingRight: wp(4),
    width: "100%",
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlignVertical: "center",
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
  bulletPointText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
