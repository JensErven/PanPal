import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";

const FilterOptionsSelectCard = ({
  onlySingleSelect,
  options,
  title,
  selectedOptions,
  selectOption,
}: {
  onlySingleSelect?: boolean;
  options: string[];
  title: string;
  selectedOptions: string[];
  selectOption: (option: string) => void;
}) => {
  const filterOptions = useMemo(() => {
    if (onlySingleSelect) {
      return options;
    }
    // filter options on showcasing selected first
    const selected = options.filter((option) =>
      selectedOptions.includes(option)
    );
    const unselected = options.filter(
      (option) => !selectedOptions.includes(option)
    );
    return [...selected, ...unselected];
  }, [options, selectedOptions]);

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderLeft}>
          <Text style={styles.inputLabel}>{title}</Text>
          {selectedOptions.length > 0 && (
            <Text style={styles.optionsSelectedCount}>
              ({selectedOptions.length})
            </Text>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {filterOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selectOption(option)}
            style={[
              styles.optionContainer,
              {
                backgroundColor: selectedOptions.includes(option)
                  ? Colors.mediumPurple
                  : Colors.white,
              },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedOptions.includes(option) && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
            {selectedOptions.includes(option) && (
              <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FilterOptionsSelectCard;

const styles = StyleSheet.create({
  container: {
    gap: hp(1),
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: hp(4),
    paddingHorizontal: wp(4),
  },
  inputLabel: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  containerHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  content: {
    flexWrap: "wrap",
    flex: 1,
    gap: hp(1),
    flexDirection: "row",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small),

    backgroundColor: Colors.white,
    elevation: 2,
  },
  optionText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
  },
  selectedOptionText: {
    color: Colors.white,
  },
  optionsSelectedCount: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
