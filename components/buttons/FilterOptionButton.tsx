import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
const FilterOptionButton = ({
  index,
  option,
  clickHandler,
  selectedOptions,
}: {
  index: number;
  option: string;
  clickHandler: () => void;
  selectedOptions: string[];
}) => {
  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.option,
        selectedOptions.length > 0
          ? { paddingRight: wp(3) }
          : { paddingHorizontal: wp(3) },
      ]}
      onPress={clickHandler}
    >
      {selectedOptions.length > 0 && (
        <View style={[styles.counterContainer]}>
          <Text style={styles.counterContainerText}>
            {selectedOptions.length}
          </Text>
        </View>
      )}

      <Text style={styles.optionText}>{option}</Text>
    </TouchableOpacity>
  );
};

export default FilterOptionButton;

const styles = StyleSheet.create({
  option: {
    marginRight: wp(2),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    gap: wp(2),
  },
  optionText: {
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    color: Colors.white,
    lineHeight: Fonts.text_3.lineHeight,
  },
  counterContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    width: hp(ComponentParams.button.height.small),
    height: "100%",
    borderRadius: wp(4),
  },
  counterContainerText: {
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    color: Colors.white,
    lineHeight: Fonts.text_3.lineHeight,
  },
});
