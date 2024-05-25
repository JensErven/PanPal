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
      {icon && icon}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default SmallInfoTag;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: wp(2),
    backgroundColor: Colors.secondaryWhite,
    borderWidth: 1,
    borderColor: Colors.primarySkyBlue,
    elevation: 2,
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
    paddingLeft: wp(2),
    paddingRight: wp(3),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.darkGrey,
  },
  text: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    lineHeight: Fonts.text_3.lineHeight,
    color: Colors.darkGrey,
  },
});
