import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import ComponentParams from "@/constants/ComponentParams";

const SmallInfoTag = ({
  text,
  icon,
}: {
  text: string | number;
  icon?: React.ReactNode;
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.white, Colors.secondaryWhite]}
        style={styles.gradientContainer}
        start={[0, 0]}
        end={[1, 1]}
      />
      {icon && icon}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default SmallInfoTag;

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    borderRightColor: Colors.white,
    borderRightWidth: 0.25,
    flexDirection: "row",
    gap: wp(2),
    paddingHorizontal: wp(4),
    minHeight: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.small / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    textAlignVertical: "center",
    marginBottom: hp(0.5),
    textTransform: "capitalize",
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    lineHeight: Fonts.text_3.lineHeight,
    color: Colors.darkGrey,
  },
});
