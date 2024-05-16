import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import StandardButton from "../buttons/StandardButton";
import { router } from "expo-router";

const UnderDevelopmentCard = ({ featureName }: { featureName?: string }) => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.white, Colors.secondaryWhite]}
      start={[0.5, 0]}
      end={[0.5, 1]}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Ionicons name="construct" size={hp(2.7)} color={Colors.darkBlue} />
          <Text style={styles.title}>Under Development</Text>
        </View>
        <Text style={styles.subTitle}>
          {featureName
            ? `The "${featureName}" feature is currently under development. Please check back later.`
            : "This feature is currently under development. Please check back later."}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default UnderDevelopmentCard;

const styles = StyleSheet.create({
  container: {
    padding: hp(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 3,
    shadowColor: Colors.darkBlue,
    marginHorizontal: wp(4),
  },
  content: {
    width: "100%",
    gap: hp(2.5),
  },

  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_1.lineHeight,
  },
  titleContainer: {
    paddingLeft: hp(1),
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: wp(2), // 8px (2dp
    display: "flex",
  },
  subTitle: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    marginBottom: hp(1),
  },
});
