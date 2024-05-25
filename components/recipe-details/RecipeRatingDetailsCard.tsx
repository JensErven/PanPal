import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
type ratingSummaryDataType = {
  thumbsUp: number;
  thumbsDown: number;
  fastReviewTags: {
    tag: string;
    count: number;
  }[];
};

const RecipeRatingDetailsCard = ({ data }: { data: ratingSummaryDataType }) => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.white, Colors.white]}
      start={[0.5, 0]}
      end={[0.5, 1]}
    >
      <View style={styles.content}>
        <View style={styles.contentTitleContainer}>
          <Text style={styles.cardTitle}>Rating Details</Text>
        </View>

        <View style={styles.itemList}></View>
      </View>
    </LinearGradient>
  );
};

export default RecipeRatingDetailsCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 3,
    shadowColor: Colors.darkGrey,
  },
  contentTitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  content: {
    width: "100%",
    gap: hp(2),
  },
  cardTitle: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_1.lineHeight,
  },
  cardText: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    marginBottom: hp(1),
    flexWrap: "wrap",
    marginRight: wp(2),
  },
  bulletPoint: {
    width: wp(2),
    height: wp(2),
    borderRadius: hp(1),
    marginTop: hp(1),
  },
  tipItem: {
    display: "flex",
    flexDirection: "row",
    gap: wp(2),
    alignItems: "flex-start",
  },
  itemList: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: hp(1),
  },
});
