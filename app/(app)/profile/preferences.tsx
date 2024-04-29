import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { allergyTypes } from "@/constants/AllergyTypes";
import { cuisineTypes } from "@/constants/CuisineTypes";
import { tastePreferences } from "@/constants/TastePreferences";
import PreferenceTypeCard from "@/components/profile/PreferenceTypeCard";
import { storedPreferencesService } from "@/services/async-storage/stored-preferences.service";
import ButtonStandard from "@/components/shared/ButtonStandard";
import Colors from "@/constants/Colors";
import Divider from "@/components/shared/Divider";

type Preference = {
  id: number;
  name: string;
};

const preferences = () => {
  // user preferences
  const [userAllergies, setUserAllergies] = useState<Preference[]>([]);
  const [userCuisines, setUserCuisines] = useState<Preference[]>([]);
  const [userTastes, setUserTastes] = useState<Preference[]>([]);
  // option types
  const [allergyTypesOptions, setAllergyTypesOptions] = useState<Preference[]>(
    []
  );
  const [cuisineTypesOptions, setCuisineTypesOptions] = useState<Preference[]>(
    []
  );
  const [tasteTypesOptions, setTasteTypesOptions] = useState<Preference[]>([]);

  useEffect(() => {
    const fetchUserAllergies = async () => {
      const allergies = await storedPreferencesService.getUserAllergies();

      setUserAllergies(allergies);
      // make sure the allergy options don't include the user's allergies
      const updatedAllergyTypesOptions = allergyTypes.filter(
        (item) =>
          !allergies.some((allergy: Preference) => allergy.id === item.id)
      );
      setAllergyTypesOptions(updatedAllergyTypesOptions);
    };

    const fetchUserCuisines = async () => {
      const cuisines = await storedPreferencesService.getUserCuisines();

      setUserCuisines(cuisines);
      // make sure the cuisine options don't include the user's cuisines
      const updatedCuisineTypesOptions = cuisineTypes.filter(
        (item) =>
          !cuisines.some((cuisine: Preference) => cuisine.id === item.id)
      );
      setCuisineTypesOptions(updatedCuisineTypesOptions);
    };

    const fetchUserTastes = async () => {
      const tastes = await storedPreferencesService.getUserTastes();

      setUserTastes(tastes);
      // make sure the taste options don't include the user's tastes
      const updatedTasteTypesOptions = tastePreferences.filter(
        (item) => !tastes.some((taste: Preference) => taste.id === item.id)
      );
      setTasteTypesOptions(updatedTasteTypesOptions);
    };

    fetchUserAllergies();
    fetchUserCuisines();
    fetchUserTastes();
  }, []);

  const handleAllergyOptionSelect = (option: Preference) => {
    // remove the selected option from the dropdown
    const updatedAllergyTypesOptions = allergyTypesOptions.filter(
      (item) => item !== option
    );

    // add the selected option to the userAllergies
    setUserAllergies([...userAllergies, option]);

    setAllergyTypesOptions(updatedAllergyTypesOptions);
  };

  const deleteUserAllergy = (option: Preference) => {
    setUserAllergies(userAllergies.filter((item) => item !== option));
    setAllergyTypesOptions([...allergyTypesOptions, option]);
  };

  const handleCuisineOptionSelect = (option: Preference) => {
    // remove the selected option from the dropdown
    const updatedCuisineTypesOptions = cuisineTypesOptions.filter(
      (item) => item !== option
    );

    // add the selected option to the userAllergies
    setUserCuisines([...userCuisines, option]);

    setCuisineTypesOptions(updatedCuisineTypesOptions);
  };

  const deleteUserCuisine = (option: Preference) => {
    setUserCuisines(userCuisines.filter((item) => item !== option));
    setCuisineTypesOptions([...cuisineTypesOptions, option]);
  };

  const handleTasteOptionSelect = (option: Preference) => {
    // remove the selected option from the dropdown
    const updatedTasteTypesOptions = tasteTypesOptions.filter(
      (item) => item !== option
    );

    // add the selected option to the userAllergies
    setUserTastes([...userTastes, option]);

    setTasteTypesOptions(updatedTasteTypesOptions);
  };

  const deleteUserTaste = (option: Preference) => {
    setUserTastes(userTastes.filter((item) => item !== option));
    setTasteTypesOptions([...tasteTypesOptions, option]);
  };

  const handleSavePreferences = async () => {
    try {
      console.log("Saving preferences...", userAllergies);
      await storedPreferencesService.storeUserAllergies(userAllergies);
      await storedPreferencesService.storeUserCuisines(userCuisines);
      await storedPreferencesService.storeUserTastes(userTastes);
      router.back();
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View>
        <Text style={styles.pageTitle}>Taste Profile</Text>
        <Text>
          With your preferences, PanPal can create custom recipes you'll love
          for sure!
        </Text>
      </View>
      <Divider />

      <View style={styles.contentContainer}>
        <PreferenceTypeCard
          title="I'm allergic to..."
          placeholder="Enter an allergy"
          selected={userAllergies}
          options={allergyTypesOptions}
          optionSelect={handleAllergyOptionSelect}
          deleteSelected={deleteUserAllergy}
        />
        <PreferenceTypeCard
          title="My favorite cuisines are..."
          placeholder="Enter a favorite cuisine"
          selected={userCuisines}
          options={cuisineTypesOptions}
          optionSelect={handleCuisineOptionSelect}
          deleteSelected={deleteUserCuisine}
        />
        <PreferenceTypeCard
          title="My favorite taste preferences are..."
          placeholder="Enter a favorite taste preference"
          selected={userTastes}
          options={tasteTypesOptions}
          optionSelect={handleTasteOptionSelect}
          deleteSelected={deleteUserTaste}
        />
      </View>
      <Divider />

      <View style={styles.cancelOrSaveContainer}>
        <View style={styles.cancelButton}>
          <ButtonStandard
            title="Cancel"
            backgroundColor={Colors.midnight}
            clicked={() => router.back()}
          />
        </View>
        <View style={styles.saveButton}>
          <ButtonStandard
            title="Save"
            backgroundColor={Colors.terracotta}
            clicked={() => handleSavePreferences()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default preferences;

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    rowGap: 32,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contentContainer: {
    width: "100%",
    rowGap: 16,
  },
  preferenceTypeCard: {
    display: "flex",
    rowGap: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelOrSaveContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  cancelButton: {
    flex: 1 / 2,
  },
  userAllergiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 5,
    columnGap: 5,
  },
  saveButton: {
    flex: 1 / 2,
  },
  buttonText: {
    color: "white",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
  },
  dropdownButton: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdownContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdownOption: {
    padding: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  userAllergyTag: {
    display: "flex",
    flexDirection: "row",
    rowGap: 5,
    backgroundColor: "lightgrey",
    padding: 5,
    borderRadius: 5,
  },
});
