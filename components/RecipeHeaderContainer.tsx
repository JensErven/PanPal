import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import SmallInfoTag from "./recipe-details/SmallInfoTag";

type RecipeHeaderContainerProps = {
  title?: string;
  description?: string;
  cuisineType?: string;
  mealType?: string;
  cookTime?: number;
  prepTime?: number;
  extraTime?: number;
  isGenerated?: boolean;
};

const RecipeHeaderContainer = ({
  headerData,
}: {
  headerData: RecipeHeaderContainerProps;
}) => {
  return (
    <LinearGradient
      colors={["transparent", "transparent"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.firstContent}>
          <Text
            style={{
              fontFamily: Fonts.heading_2.fontFamily,
              fontSize: Fonts.heading_2.fontSize,
              lineHeight: Fonts.heading_2.lineHeight,
              textTransform: "capitalize",
              color: Colors.darkBlue,
            }}
          >
            {headerData.title}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.text_2.fontFamily,
              fontSize: Fonts.text_2.fontSize,
              lineHeight: Fonts.text_2.lineHeight,
              color: Colors.darkGrey,
            }}
          >
            {headerData.description}
          </Text>
        </View>

        <View style={styles.secondContent}>
          {headerData.isGenerated && (
            <SmallInfoTag
              text={"generated"}
              icon={
                <Ionicons
                  name="sparkles"
                  size={hp(2)}
                  color={Colors.mediumPurple}
                />
              }
            />
          )}
          {headerData.cuisineType && (
            <SmallInfoTag text={headerData.cuisineType} />
          )}
          {headerData.mealType && (
            <SmallInfoTag
              text={headerData.mealType}
              icon={
                <Ionicons
                  name="restaurant"
                  size={hp(2)}
                  color={Colors.darkGrey}
                />
              }
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default RecipeHeaderContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    padding: wp(4),
    justifyContent: "center",
    alignItems: "center",
    gap: hp(2),
  },
  firstContent: {
    width: "100%",
    gap: hp(1),
  },
  secondContent: {
    width: "100%",
    gap: wp(2),
    rowGap: hp(1),
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
});
