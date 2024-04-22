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
      <View style={styles.divider}></View>

      <View style={styles.contentContainer}>
        <PreferenceTypeCard
          title="I'm allergic to..."
          selected={userAllergies}
          options={allergyTypesOptions}
          optionSelect={handleAllergyOptionSelect}
          deleteSelected={deleteUserAllergy}
        />
        <PreferenceTypeCard
          title="My favorite cuisines are..."
          selected={userCuisines}
          options={cuisineTypesOptions}
          optionSelect={handleCuisineOptionSelect}
          deleteSelected={deleteUserCuisine}
        />
        <PreferenceTypeCard
          title="My favorite taste preferences are..."
          selected={userTastes}
          options={tasteTypesOptions}
          optionSelect={handleTasteOptionSelect}
          deleteSelected={deleteUserTaste}
        />
      </View>
      <View style={styles.divider}></View>

      <View style={styles.cancelOrSaveContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSavePreferences()}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
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
    rowGap: 10,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contentContainer: {
    width: "100%",
    rowGap: 10,
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
  },
  cancelButton: {
    backgroundColor: "red",
    width: "45%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userAllergiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 5,
    columnGap: 5,
  },
  saveButton: {
    backgroundColor: "blue",
    width: "45%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
