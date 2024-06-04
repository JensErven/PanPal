import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TextInput } from "react-native-gesture-handler";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import OptionTagButton from "../buttons/OptionTagButton";

const FilterOptionsSelectCard = ({
  onlySingleSelect,
  options,
  title,
  selectedOptions,
  selectOption,
  showCount = true,
  searchEnabled = false,
  clearAll,
}: {
  onlySingleSelect?: boolean;
  options: string[];
  title: string;
  selectedOptions: string[];
  selectOption: (option: string) => void;
  showCount?: boolean;
  searchEnabled?: boolean;
  clearAll?: () => void;
}) => {
  const [searchInputField, setSearchInputField] = React.useState<string>("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchInputField.toLowerCase())
    );
  }, [searchInputField]);

  useEffect(() => {
    setSearchInputField("");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderLeft}>
          <View
            style={{ flexDirection: "row", gap: wp(1), alignItems: "center" }}
          >
            <Text style={styles.inputLabel}>{title}</Text>
            {showCount && selectedOptions.length > 0 && (
              <Text style={styles.selectedAmountText}>
                ({selectedOptions.length})
              </Text>
            )}
          </View>

          {showCount && selectedOptions.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>clear all</Text>
              <Ionicons
                name="close"
                size={hp(2.7)}
                color={Colors.mediumPurple}
              />
            </TouchableOpacity>
          )}
        </View>
        {searchEnabled && (
          <View style={styles.contentItemInputContainer}>
            <Ionicons
              name="search"
              size={hp(2.7)}
              color={Colors.light.components.inputField.placeholderTextColor}
            />
            <TextInput
              value={searchInputField}
              onChangeText={setSearchInputField}
              style={styles.contentItemInput}
              placeholder="Search"
              placeholderTextColor={
                Colors.light.components.inputField.placeholderTextColor
              }
            />
            {searchInputField.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchInputField("")}
                style={styles.clearButton}
              >
                <Text style={styles.filteredResultsCountText}>
                  {filteredOptions.length} results
                </Text>
                <Ionicons name="close" size={hp(2.7)} color={Colors.darkGrey} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        {filteredOptions.map((option, index) => (
          <OptionTagButton
            key={index}
            option={option}
            selectOption={selectOption}
            selected={selectedOptions.includes(option)}
          />
        ))}
      </View>
    </View>
  );
};

export default FilterOptionsSelectCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: hp(1),
    marginBottom: hp(4),
  },
  inputLabel: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  containerHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(1),
  },
  containerHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    width: "100%",
    justifyContent: "space-between",
  },
  clearButtonText: {
    color: Colors.mediumPurple,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    textTransform: "capitalize",
    textAlignVertical: "center",
  },
  content: {
    flexWrap: "wrap",
    flex: 1,
    gap: hp(1),
    flexDirection: "row",
  },
  unselectedOptionText: {
    textAlignVertical: "center",
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
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
  contentItemInput: {
    height: hp(ComponentParams.button.height.medium),
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemInputContainer: {
    backgroundColor: Colors.secondaryWhite,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium),
    paddingRight: wp(2),
    paddingLeft: wp(4),
    paddingVertical: hp(1),
    marginTop: hp(1),
    gap: wp(2),
  },
  clearButton: {
    height: hp(ComponentParams.button.height.small),
    flexDirection: "row",
    textAlignVertical: "center",
    gap: wp(1),
    borderRadius: hp(ComponentParams.button.height.small / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  filteredResultsCountText: {
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_3.lineHeight,
  },
  selectedAmountText: {
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_3.lineHeight,
  },
});
