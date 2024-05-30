import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { allergyTypes } from "@/constants/tastePreferences/AllergyTypes";
import { preferenceOption } from "@/models/PreferenceOption";

const TastePreferencesCard = ({
  title,
  selectedOptions,
  searchInputPlaceholder,
}: {
  title: string;
  selectedOptions: string[];
  searchInputPlaceholder?: string;
}) => {
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const filteredOptions = useMemo(() => {
    return selectedOptions.filter((option) =>
      option.toLowerCase().includes(searchInputValue.trim().toLowerCase())
    );
  }, [searchInputValue, selectedOptions]);
  return (
    <LinearGradient style={styles.container} colors={[Colors.white, "#DDEBF3"]}>
      <View style={styles.selectedOptionsContainer}>
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>({selectedOptions?.length})</Text>
          </View>
          {searchInputPlaceholder && (
            <View style={[styles.searchInputContainer]}>
              <Ionicons name="search" size={hp(2.7)} color="#A0B7D6" />
              <TextInput
                value={searchInputValue}
                onChangeText={(text) => setSearchInputValue(text)}
                onSubmitEditing={() => {}}
                style={styles.input}
                placeholderTextColor="#A0B7D6"
                placeholder={searchInputPlaceholder}
              />
              {searchInputValue && (
                <TouchableOpacity
                  onPress={() => setSearchInputValue("")}
                  style={styles.closeButtonContainer}
                >
                  <Ionicons name="close" size={hp(2.7)} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.selectedOptionTagsContainer}>
            {filteredOptions.length === 0 ? (
              <View style={styles.innerSelectedOptionContainer}>
                <Text
                  style={[
                    styles.selectedOption,
                    {
                      color: Colors.darkGrey,
                    },
                  ]}
                >
                  None
                </Text>
              </View>
            ) : (
              filteredOptions.map((option, index) => (
                <LinearGradient
                  key={index}
                  style={styles.selectedOptionContainer}
                  colors={
                    filteredOptions.includes(option)
                      ? [
                          Colors.light.navHeader[2],
                          Colors.light.navHeader[1],
                          Colors.light.navHeader[0],
                        ]
                      : [
                          Colors.light.components.button.white.background[0],
                          Colors.light.components.button.white.background[1],
                        ]
                  }
                  start={[0.5, 0]}
                  end={[0.5, 1]}
                >
                  <View style={styles.innerSelectedOptionContainer}>
                    <Text
                      style={[
                        styles.selectedOption,
                        {
                          color: filteredOptions.includes(option)
                            ? Colors.white
                            : Colors.lightGrey,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </View>
                </LinearGradient>
              ))
            )}
          </View>
        </>
      </View>
    </LinearGradient>
  );
};

export default TastePreferencesCard;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: hp(ComponentParams.button.height.small),
    overflow: "hidden",
    shadowColor: Colors.cardDropShadow,
    elevation: 2,
    width: "100%",
  },
  titleContainer: {
    paddingHorizontal: hp(1),
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    display: "flex",
    alignItems: "center",
    gap: wp(1),
  },
  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_1.lineHeight,
  },
  subTitle: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.lightGrey,
  },
  scrollView: {
    paddingHorizontal: 5,
    maxHeight: hp(20), // Set a specific height here
  },
  selectedOptionsContainer: {
    width: "100%",
    padding: hp(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  selectedOptionTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: hp(1),
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: hp(1),
  },
  selectedOption: {
    justifyContent: "center",
    alignItems: "center",
    color: Colors.white,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    textTransform: "capitalize",
    textAlign: "center",
    textAlignVertical: "center",
    // Adjust this value as needed
  },
  selectedOptionContainer: {
    width: "auto",
    borderRadius: hp(ComponentParams.button.height.small / 2),
    flexDirection: "row",
    paddingHorizontal: wp(4),
    height: hp(ComponentParams.button.height.small),
    paddingBottom: hp(0.5),
    alignItems: "center",
    justifyContent: "center",
  },
  innerSelectedOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(1),
  },
  searchInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    height: hp(ComponentParams.button.height.large),
  },
  input: {
    color: Colors.light.text,
    height: hp(ComponentParams.button.height.large),
    fontFamily: Fonts.text_2.fontFamily,
    flex: 1,
    fontSize: Fonts.text_2.fontSize,
    marginLeft: wp(2), // Adjust this value as needed
  },
  closeButtonContainer: {
    backgroundColor: "#A0B7D6",
    borderRadius: hp(ComponentParams.button.height.small / 2),
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
  },
});
