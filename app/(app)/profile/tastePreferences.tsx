import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PreferencesSelectCard from "@/components/PreferencesSelectCard";
import { preferenceType } from "@/models/PreferenceType";
import { allergyTypes } from "@/constants/tastePreferences/AllergyTypes";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { dislikedIngredientTypes } from "@/constants/tastePreferences/DislikedIngredientTypes";
import { preferenceOption } from "@/models/PreferenceOption";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import TastePreferencesCard from "@/components/TastePreferencesCard";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import ComponentParams from "@/constants/ComponentParams";

const tastePreferencesScreen = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [contentSteps, setContentSteps] = React.useState<preferenceType[]>([
    {
      title: "Your Allergies",
      searchInputPlaceholder: "search allergies...",
      addInputPlaceholder: "add other allergies...",
      options: allergyTypes,
      selectedOptions: [],
    },
    {
      title: "Preferred Cuisines",
      searchInputPlaceholder: "search cuisines...",
      addInputPlaceholder: "add other cuisines...",
      options: cuisineTypes,
      selectedOptions: [],
    },
    {
      title: "Disliked Ingredients",
      searchInputPlaceholder: "search ingredients...",
      addInputPlaceholder: "add other ingredients...",
      options: dislikedIngredientTypes,
      selectedOptions: [],
    },
  ]);

  const tastPreferencesChildren = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={() => {
            console.log("edit taste preferences");
          }}
        >
          <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
        </TouchableOpacity>
      </>
    );
  };
  useEffect(() => {
    console.log("tastePreferencesScreen");
    // get the preferences from the user in async storage and store the selectedOptions to the corresponding contentSteps
    const getPreferences = async () => {
      setIsLoading(true);
      const preferences = await AsyncStorage.getItem("userTastePreferences");
      if (preferences) {
        const parsedPreferences = JSON.parse(preferences);
        setContentSteps((prev) =>
          prev.map((step) => {
            const selectedOptions = parsedPreferences.find(
              (preference: preferenceType) => preference.title === step.title
            )?.selectedOptions;
            return { ...step, selectedOptions };
          })
        );
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    getPreferences();
  }, []);

  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={[
        Colors.light.navHeader[0],
        Colors.light.navHeader[1],
        Colors.light.navHeader[2],
      ]}
      start={[0, 0]}
      end={[1, 0]}
    >
      <CustomHeader
        isTransparent={true}
        headerTitle={"Taste Profile"}
        hasGoBack={true}
        children={tastPreferencesChildren()}
      />
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <CustomKeyBoardView>
          <StatusBar style="light" />
          {isLoading ? (
            <ActivityIndicator
              size={wp(15)}
              style={{ padding: wp(5) }}
              color={Colors.mediumBlue}
            />
          ) : (
            <View style={styles.content}>
              {contentSteps.map((step, index) => (
                <TastePreferencesCard
                  key={index}
                  title={step.title}
                  selectedOptions={step.selectedOptions || []} // Ensure selectedOptions is always defined
                />
              ))}
            </View>
          )}
        </CustomKeyBoardView>
      </LinearGradient>
    </LinearGradient>
  );
};

export default tastePreferencesScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    padding: wp(4),
    gap: hp(4),
  },
  headerRightButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    justifyContent: "center",
    alignItems: "center",
  },
});
