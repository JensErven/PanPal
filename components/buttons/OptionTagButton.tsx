import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { Key } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
const OptionTagButton = ({
  option,
  selected,
  selectOption,
}: {
  option: string;
  selected: boolean;
  selectOption: (option: string) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => selectOption(option)}
      style={selected ? styles.selectedOption : styles.unselectedOption}
    >
      <Text
        style={
          selected ? styles.selectedOptionText : styles.unselectedOptionText
        }
      >
        {option}
      </Text>
      {selected && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            width: hp(ComponentParams.button.height.small),
            height: "100%",
            borderRadius: hp(ComponentParams.button.height.small / 2),
          }}
        >
          <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OptionTagButton;

const styles = StyleSheet.create({
  unselectedOptionText: {
    textAlignVertical: "center",
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  selectedOption: {
    backgroundColor: Colors.mediumPurple,
    borderRadius: hp(ComponentParams.button.height.small / 2),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingRight: 0,
    elevation: 2,
    shadowColor: Colors.cardDropShadow,
    height: hp(ComponentParams.button.height.small),
    gap: wp(2),
  },
  unselectedOption: {
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.small / 2),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(3),
    elevation: 2,
    shadowColor: Colors.cardDropShadow,
    height: hp(ComponentParams.button.height.small),
    gap: wp(2),
  },
  selectedOptionText: {
    textAlignVertical: "center",
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.white,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
