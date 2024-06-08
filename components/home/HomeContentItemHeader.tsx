import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import RoundButton from "../buttons/RoundButton";
import ComponentParams from "@/constants/ComponentParams";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";

interface HomeContentItemHeaderProps {
  title: string;
  subTitleChildren?: React.ReactNode;
  contentRight?: React.ReactNode;
}

const HomeContentItemHeader: React.FC<HomeContentItemHeaderProps> = ({
  title,
  subTitleChildren,
  contentRight,
}) => {
  return (
    <View style={styles.contentHeader}>
      <View style={{ flex: 1, maxWidth: wp(60) }}>
        <Text style={styles.contentItemTitle}>{title}</Text>

        {subTitleChildren && (
          <View style={styles.contentItemSubTitleContainer}>
            {subTitleChildren}
          </View>
        )}
      </View>
      <View>{contentRight && contentRight}</View>
    </View>
  );
};

export default HomeContentItemHeader;

const styles = StyleSheet.create({
  contentHeader: {
    gap: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentItemTitle: {
    color: Colors.darkBlue,
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
  },

  contentItemSubTitleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(1),
  },
});
