import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

interface CoinCountProps {
  count: number;
  isTransparent?: boolean;
  textColor?: string;
}
const CoinCount: React.FC<CoinCountProps> = ({
  count,
  isTransparent,
  textColor,
}) => {
  return (
    <View
      style={[
        styles.container,
        isTransparent
          ? { backgroundColor: "rgba(0, 0, 0, 0.2)" }
          : { backgroundColor: "transparent", shadowColor: "transparent" },
      ]}
    >
      <Text
        style={[styles.text, { color: textColor ? textColor : Colors.white }]}
      >
        {count}
      </Text>
      <View style={styles.panpalCoinContainer}>
        <LinearGradient
          style={styles.panPalCreditsGradientContainer}
          colors={[
            Colors.light.components.button.gold.background[0],
            Colors.light.components.button.gold.background[1],
          ]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        />

        <Text style={styles.panpalCoinText}>pp</Text>
      </View>
    </View>
  );
};

export default CoinCount;

const styles = StyleSheet.create({
  panpalCoinText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    lineHeight: Fonts.text_3.lineHeight,
    color: Colors.darkGold,
  },
  text: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
  },
  panPalCreditsGradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panpalCoinContainer: {
    borderBottomWidth: 1,
    borderRightColor: Colors.darkGold,
    borderRightWidth: 1,
    borderBottomColor: Colors.darkGold,
    borderRadius: hp(ComponentParams.button.height.small / 2),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: hp(ComponentParams.button.height.small),
    aspectRatio: 1,
    gap: wp(1),
  },
  container: {
    gap: wp(1),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: wp(2),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    elevation: 10,
    shadowColor: Colors.cardDropShadow,
  },
});
