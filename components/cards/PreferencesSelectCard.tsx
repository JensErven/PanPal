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
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { preferenceOption } from "@/models/PreferenceOption";

const PreferencesSelectCard = ({
  step,
  title,
  searchInputPlaceholder,
  addInputPlaceholder,
  options,
  selectedOptions,
  onOptionSelect,
}: {
  step?: number;
  title: string;
  searchInputPlaceholder: string;
  addInputPlaceholder: string;
  options: preferenceOption[];
  selectedOptions: preferenceOption[];
  onOptionSelect: (option: preferenceOption) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [initialOptions, setInitialOptions] =
    useState<preferenceOption[]>(options);
  const handleAddOption = (option: preferenceOption) => {
    if (!inputValue) return;
    onOptionSelect(option);
    // setSelectedOptions([...selectedOptions, inputValue.trim().toLowerCase()]);
    setInputValue("");
  };

  const additionalOptions = useMemo(() => {
    return selectedOptions.filter((option) => !initialOptions.includes(option));
  }, [selectedOptions, initialOptions]);

  useEffect(() => {
    setInitialOptions(options.map((option) => option));
  }, [options]);

  useEffect(() => {
    setSearchInputValue("");
  }, [step]);

  return (
    <View style={[styles.container]}>
      <View style={styles.selectedOptionsContainer}>
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>({selectedOptions?.length})</Text>
          </View>
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
          <ScrollView style={styles.scrollView}>
            <View style={styles.selectedOptionsContainer}>
              {initialOptions
                .filter((option) =>
                  option.name
                    .toLowerCase()
                    .includes(searchInputValue.toLowerCase())
                )
                .map((option, index) => (
                  <LinearGradient
                    key={index}
                    style={styles.selectedOptionContainer}
                    colors={
                      selectedOptions.includes(option)
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
                    <TouchableOpacity
                      style={styles.innerSelectedOptionContainer}
                      onPress={() => {
                        onOptionSelect(option);
                        setSearchInputValue("");
                      }}
                    >
                      <Text
                        style={[
                          styles.selectedOption,
                          {
                            color: selectedOptions.includes(option)
                              ? Colors.white
                              : Colors.lightGrey,
                          },
                        ]}
                      >
                        {option.name}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                ))}

              {additionalOptions.length > 0 && (
                <>
                  <View style={styles.optionsDivider}></View>

                  {additionalOptions.map((option, index) => (
                    <LinearGradient
                      key={index}
                      style={styles.selectedOptionContainer}
                      colors={[
                        Colors.light.navHeader[2],
                        Colors.light.navHeader[1],
                        Colors.light.navHeader[0],
                      ]}
                      start={[0.5, 0]}
                      end={[0.5, 1]}
                    >
                      <TouchableOpacity
                        key={index}
                        style={styles.innerSelectedOptionContainer}
                      >
                        <Text style={styles.selectedOption}>{option.name}</Text>
                        <Ionicons
                          name="close"
                          size={hp(2.7)}
                          color={
                            Colors.light.components.button.pink.background[1]
                          }
                          onPress={() => {
                            onOptionSelect(option);
                            setSearchInputValue("");
                          }}
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  ))}
                </>
              )}
            </View>
          </ScrollView>
        </>
      </View>

      <View style={[styles.inputContainer]}>
        <Ionicons name="add" size={hp(2.7)} color="#A0B7D6" />
        <TextInput
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          onSubmitEditing={() => {
            handleAddOption({ name: inputValue, id: 8 });
          }}
          style={styles.input}
          placeholderTextColor="#A0B7D6"
          placeholder={addInputPlaceholder}
        />
        <TouchableOpacity
          onPress={() => handleAddOption({ name: inputValue, id: 8 })}
          style={styles.addButtonContainer}
        >
          <Ionicons name="add" size={hp(2.7)} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PreferencesSelectCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "auto",
    shadowColor: Colors.darkBlue,
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: hp(1),
    alignItems: "center",
    backgroundColor: Colors.light.components.inputField.background,
    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderTopRightRadius: hp(ComponentParams.button.height.medium / 2),
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
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

  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.components.inputField.background,
    borderBottomLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderBottomRightRadius: hp(ComponentParams.button.height.medium / 2),
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
  optionsDivider: {
    width: 2,
    height: hp(ComponentParams.button.height.small),
    borderRadius: 1,
    backgroundColor: "#A0B7D6",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: hp(1),
    alignItems: "center",
  },
  addButtonContainer: {
    backgroundColor: Colors.darkBlue,
    borderRadius: hp(ComponentParams.button.height.small / 2),
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
  },
  searchInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.components.inputField.background,
    borderBottomLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderBottomRightRadius: hp(ComponentParams.button.height.medium / 2),
    paddingHorizontal: wp(3),
    height: hp(ComponentParams.button.height.large),
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
