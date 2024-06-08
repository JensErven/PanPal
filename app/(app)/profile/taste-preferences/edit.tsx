import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import FullScreenLoading from "@/components/FullScreenLoading";
import TastePreferencesCard from "@/components/cards/TastePreferencesCard";
import { Ionicons } from "@expo/vector-icons";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import StandardButton from "@/components/buttons/StandardButton";
import RoundButton from "@/components/buttons/RoundButton";
import OptionTagButton from "@/components/buttons/OptionTagButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import CustomHeader from "@/components/navigation/CustomHeader";
import { StatusBar } from "expo-status-bar";
import Fonts from "@/constants/Fonts";
import { useAuth } from "@/context/authContext";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { allergyTypes } from "@/constants/tastePreferences/AllergyTypes";
import { dietTypes } from "@/constants/tastePreferences/DietTypes";
import { dislikedIngredientTypes } from "@/constants/tastePreferences/DislikedIngredientTypes";
import { updateTastePreferences } from "@/services/db/tastePreferences.services";

const EditTastePreferencesScreen = () => {
  const { title } = useLocalSearchParams();
  const { tastePreferences, user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>();

  useEffect(() => {
    if (!title && !tastePreferences && !user) {
      router.back();
      return;
    }
    setIsLoading(false);
  }, []);

  const handleUpdatePreferences = async () => {
    setIsLoading(true);
    if (!user || !selectedPreferences) return;
    switch (title) {
      case "Cuisine Types":
        await updateTastePreferences(user.userId, {
          cuisineTypes: selectedPreferences,
          allergyTypes: tastePreferences.allergyTypes,
          dislikedIngredients: tastePreferences.dislikedIngredients,
          dietTypes: tastePreferences.dietTypes,
        });
        break;
      case "Allergy Types":
        await updateTastePreferences(user.userId, {
          allergyTypes: selectedPreferences,
          cuisineTypes: tastePreferences.cuisineTypes,
          dislikedIngredients: tastePreferences.dislikedIngredients,
          dietTypes: tastePreferences.dietTypes,
        });
        break;
      case "Disliked Ingredients":
        await updateTastePreferences(user.userId, {
          dislikedIngredients: selectedPreferences,
          cuisineTypes: tastePreferences.cuisineTypes,
          allergyTypes: tastePreferences.allergyTypes,
          dietTypes: tastePreferences.dietTypes,
        });
        break;
      case "Diet Types":
        await updateTastePreferences(user.userId, {
          dietTypes: selectedPreferences,
          cuisineTypes: tastePreferences.cuisineTypes,
          allergyTypes: tastePreferences.allergyTypes,
          dislikedIngredients: tastePreferences.dislikedIngredients,
        });
        break;
    }
    setIsLoading(false);
    router.back();
  };

  useEffect(() => {
    switch (title) {
      case "Cuisine Types":
        setSelectedPreferences(tastePreferences?.cuisineTypes);
        break;
      case "Allergy Types":
        setSelectedPreferences(tastePreferences?.allergyTypes);
        break;
      case "Disliked Ingredients":
        setSelectedPreferences(tastePreferences?.dislikedIngredients);
        break;
      case "Diet Types":
        setSelectedPreferences(tastePreferences?.dietTypes);
        break;
    }
  }, [tastePreferences]);

  const headerChildren = () => {
    return (
      <RoundButton handlePress={() => handleUpdatePreferences()}>
        <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
      </RoundButton>
    );
  };

  const subTitle = () => {
    switch (title) {
      case "Cuisine Types":
        return "Your favorite cuisines are...";
      case "Allergy Types":
        return "Your allergies are...";
      case "Disliked Ingredients":
        return "You dislike these ingredients...";
      default:
        return "";
    }
  };

  const types = useMemo(() => {
    switch (title) {
      case "Cuisine Types":
        return cuisineTypes;
      case "Allergy Types":
        return allergyTypes;
      case "Disliked Ingredients":
        return dislikedIngredientTypes;
      case "Diet Types":
        return dietTypes;
      default:
        return [];
    }
  }, [title]);

  const filteredTypes = useMemo(() => {
    return types.filter((type) =>
      type.toLowerCase().includes(searchInputValue.toLowerCase())
    );
  }, [searchInputValue]);

  const handleSelectType = (type: string) => {
    if (selectedPreferences?.includes(type)) {
      setSelectedPreferences(
        selectedPreferences?.filter((selectedType) => selectedType !== type)
      );
    } else {
      setSelectedPreferences([...(selectedPreferences || []), type]);
    }
  };

  const includesType = (type: string) => {
    if (!selectedPreferences) return false;
    return selectedPreferences?.includes(type);
  };

  useEffect(() => {
    console.log(selectedPreferences);
  }, [selectedPreferences]);

  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={Colors.light.navHeader}
      start={[0, 0]}
      end={[1, 0]}
    >
      <StatusBar style="light" />
      <CustomHeader
        isTransparent={true}
        hasGoBack={true}
        headerTitle={`Edit ${title}`}
        children={headerChildren()}
      />
      <View
        style={{
          position: "absolute",
          bottom: hp(2),
          right: wp(4),
          zIndex: 1000,
        }}
      ></View>
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <LinearGradient
          style={styles.bottomButtonContainer}
          colors={[
            "transparent",
            Colors.white,
            Colors.secondaryWhite,
            Colors.primarySkyBlue,
          ]}
        >
          <StandardButton
            isDisabled={isLoading}
            iconRight={
              <RoundButton
                handlePress={() => handleUpdatePreferences()}
                height={ComponentParams.button.height.medium}
                transparent={true}
                children={
                  <Ionicons
                    name="checkmark"
                    size={hp(2.7)}
                    color={Colors.white}
                  />
                }
              />
            }
            textValue={`Save`}
            clickHandler={() => handleUpdatePreferences()}
            colors={Colors.light.components.button.purple.background}
            textColor={Colors.white}
            height={ComponentParams.button.height.medium}
          />
        </LinearGradient>
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <CustomKeyBoardView>
            <View style={styles.content}>
              <View style={{ flexDirection: "column", gap: hp(2) }}>
                <View style={styles.contentItem}>
                  <View style={styles.contentItemInputContainer}>
                    <Ionicons
                      name="search"
                      size={hp(2.7)}
                      color={
                        Colors.light.components.inputField.placeholderTextColor
                      }
                    />
                    <TextInput
                      value={searchInputValue}
                      onChangeText={(text) => setSearchInputValue(text)}
                      style={styles.contentItemInput}
                      placeholder={`Search for ${(
                        title as string
                      )?.toLowerCase()}`}
                      placeholderTextColor={
                        Colors.light.components.inputField.placeholderTextColor
                      }
                    />
                    {searchInputValue.length > 0 && (
                      <View style={styles.clearSearchInputButton}>
                        <RoundButton
                          height={ComponentParams.button.height.small}
                          transparent={false}
                          backgroundColor={Colors.primarySkyBlue}
                          handlePress={() => setSearchInputValue("")}
                        >
                          <Ionicons
                            name="close"
                            size={hp(2.7)}
                            color={Colors.darkGrey}
                          />
                        </RoundButton>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.contentItem}>
                  <View style={styles.contentItemHeader}>
                    <Text
                      style={styles.subTitle}
                      ellipsizeMode="tail"
                      numberOfLines={2}
                    >
                      {subTitle()}
                    </Text>
                    {selectedPreferences && selectedPreferences.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSelectedPreferences([])}
                        style={styles.clearButton}
                      >
                        <Text style={styles.clearButtonText}>
                          ({selectedPreferences.length}) clear all
                        </Text>
                        <Ionicons
                          style={{ marginTop: hp(0.5) }}
                          name="close"
                          size={hp(2.7)}
                          color={Colors.mediumPurple}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.suggestionsListContainer}>
                    {filteredTypes.map((option, index) => (
                      <OptionTagButton
                        key={index}
                        option={option}
                        selectOption={() => handleSelectType(option)}
                        selected={includesType(option)}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </CustomKeyBoardView>
        )}
      </LinearGradient>
    </LinearGradient>
  );
};

export default EditTastePreferencesScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  contentItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: wp(1),
  },
  clearButtonText: {
    color: Colors.mediumPurple,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    textTransform: "capitalize",
    textAlignVertical: "center",
  },
  clearSearchInputButton: {
    marginRight: wp(2),
    aspectRatio: 1,
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
  },
  content: {
    flexDirection: "column",
    justifyContent: "space-between",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    padding: wp(4),
    gap: hp(2),
    paddingBottom: hp(14),
  },
  bottomButtonContainer: {
    backgroundColor: "transparent",
    width: wp(100),
    height: hp(14),
    justifyContent: "flex-end",
    zIndex: 1000,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    position: "absolute",
    bottom: hp(0),
    left: wp(0),
  },
  subTitle: {
    flex: 1,
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  contentItemInput: {
    height: hp(ComponentParams.button.height.large),
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
    height: hp(ComponentParams.button.height.large),
    borderRadius: hp(ComponentParams.button.height.large),
    paddingRight: wp(1),
    paddingLeft: wp(4),
    gap: wp(2),
  },
  clearButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(1),
  },
  contentItem: {
    gap: hp(1),
    borderRadius: hp(2),
  },
  inputLabel: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  suggestionsListContainer: {
    flexWrap: "wrap",
    flex: 1,
    gap: hp(1),
    flexDirection: "row",
  },
});
