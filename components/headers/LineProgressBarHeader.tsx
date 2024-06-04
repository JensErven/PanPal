import { View, Text, Platform, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";

import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";

import LineProgress from "../LineProgress";

const ios = Platform.OS === "ios";
const LineProgressBarHeader = ({
  checkedItems,
  totalItems,
}: {
  checkedItems: number;
  totalItems: number;
}) => {
  const { top } = useSafeAreaInsets();

  const progress = useMemo(() => {
    return totalItems === 0 ? 0 : (checkedItems / totalItems) * 100;
  }, [checkedItems, totalItems]);

  return (
    <View
      style={[
        {
          backgroundColor: "transparent",
        },
        styles.container,
      ]}
    >
      <View
        style={{
          paddingHorizontal: wp(4),
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          gap: wp(2),
        }}
      >
        <View style={{ flex: 1 }}>
          <LineProgress
            height={hp(1.5)}
            progress={progress}
            strokeColor={Colors.mediumPurple}
            backgroundColor="rgba(0, 0, 0, 0.2)"
          />
        </View>

        <Text style={styles.subTitle}>
          {checkedItems.toString()}/{totalItems.toString()}
        </Text>
      </View>
    </View>
  );
};

export default LineProgressBarHeader;

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.darkBlue,
    height: "auto",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingBottom: hp(1),
    gap: hp(1),
  },
  inputGradientContainer: {
    flex: 1,
    gap: wp(2),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: hp(ComponentParams.button.height.medium),
    paddingRight: wp(2),
    paddingLeft: wp(4),
    paddingVertical: hp(1),
    borderRadius: hp(ComponentParams.button.height.medium / 2),

    // borderColor: Colors.white, // "#DDEBF3"
    // borderWidth: 1,
  },
  input: {
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    fontSize: Fonts.text_2.fontSize,
    flex: 1,
    color: Colors.white,
  },
  clearInputValueButton: {
    height: hp(ComponentParams.button.height.small),
    width: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  subTitle: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.white,
    textAlignVertical: "center",
  },
});
