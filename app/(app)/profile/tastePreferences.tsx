import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { preferenceType } from "@/models/PreferenceType";
import { allergyTypes } from "@/constants/tastePreferences/AllergyTypes";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { dislikedIngredientTypes } from "@/constants/tastePreferences/DislikedIngredientTypes";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import TastePreferencesCard from "@/components/TastePreferencesCard";
import CustomHeader from "@/components/navigation/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import ComponentParams from "@/constants/ComponentParams";
import RoundButton from "@/components/buttons/RoundButton";
import { AuthContext } from "@/context/authContext";

export type TastePreferenceType = {
  cuisineTypes: string[];
  allergyTypes: string[];
};

const tastePreferencesScreen = () => {
  const { tastePreferences } = useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const contentSteps: preferenceType[] = [
    {
      title: "Cuisine Types",
      selectedOptions: cuisineTypes.map((type) => type.name),
      searchInputPlaceholder: "Search cuisine types",
      addInputPlaceholder: "Add a cuisine type",
      options: cuisineTypes.map((type) => type.name),
    },
    {
      title: "Allergy Types",
      selectedOptions: tastePreferences?.allergyTypes || [],
      searchInputPlaceholder: "Search allergy types",
      addInputPlaceholder: "Add an allergy type",
      options: allergyTypes.map((type) => type.name),
    },
    {
      title: "Disliked Ingredients",
      selectedOptions: tastePreferences?.dislikedIngredientTypes || [],
      searchInputPlaceholder: "Search disliked ingredients",
      addInputPlaceholder: "Add a disliked ingredient",
      options: dislikedIngredientTypes.map((type) => type.name),
    },
  ];

  const tastPreferencesChildren = () => (
    <RoundButton
      handlePress={() => {
        console.log("edit taste preferences");
      }}
    >
      <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
    </RoundButton>
  );

  useEffect(() => {
    console.log("Taste Preferences Screen Mounted");
    console.log(tastePreferences);
  }, [tastePreferences]);

  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={Colors.light.navHeader}
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
                  selectedOptions={step.selectedOptions}
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
    gap: hp(2),
  },
});
