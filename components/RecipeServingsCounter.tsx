import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const RecipeServingsCounter = ({
  servings,
  setServings,
}: {
  servings: number;
  setServings: (servings: number) => void;
}) => {
  const servingTitle = useMemo(() => {
    return servings === 1 ? "serving" : "servings";
  }, [servings]);

  return (
    <View style={styles.container}>
      <View style={styles.servingsCounter}>
        <LinearGradient
          colors={[
            Colors.light.components.button.white.background[1],
            Colors.light.components.button.white.background[0],
          ]}
          style={{
            borderRadius: hp(ComponentParams.button.height.small),
            width: hp(ComponentParams.button.height.small),
            height: hp(ComponentParams.button.height.small),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (servings > 1) {
                setServings(servings - 1);
              }
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: hp(ComponentParams.button.height.small),
              borderWidth: 1,
              borderColor: Colors.primarySkyBlue,
              width: hp(ComponentParams.button.height.small),
              height: hp(ComponentParams.button.height.small),
            }}
          >
            <Ionicons name="remove" size={hp(2.7)} color={Colors.darkGrey} />
          </TouchableOpacity>
        </LinearGradient>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: wp(1),
          }}
        >
          <Text style={styles.servingsTextBold}>{servings}</Text>
          <Text style={styles.servingsText}>{servingTitle}</Text>
        </View>

        <View style={styles.servingsCounterButtons}>
          <LinearGradient
            colors={[
              Colors.light.components.button.white.background[1],
              Colors.light.components.button.white.background[0],
            ]}
            style={{
              borderRadius: hp(ComponentParams.button.height.small),
              width: hp(ComponentParams.button.height.small),
              height: hp(ComponentParams.button.height.small),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setServings(servings + 1)}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: hp(ComponentParams.button.height.small),
                borderWidth: 1,
                borderColor: Colors.primarySkyBlue,
                width: hp(ComponentParams.button.height.small),
                height: hp(ComponentParams.button.height.small),
              }}
            >
              <Ionicons name="add" size={hp(2.7)} color={Colors.darkGrey} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default RecipeServingsCounter;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  servingsTextBold: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkBlue,
  },

  servingsCounter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(2),
  },
  servingsText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkBlue,
  },
  servingsCounterButtons: {
    flexDirection: "row",
    gap: wp(2),
  },
});
