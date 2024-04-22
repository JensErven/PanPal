import AsyncStorage from "@react-native-async-storage/async-storage";

type Preference = {
  id: number;
  name: string;
};

const storeUserAllergies = async (userAllergies: Preference[]) => {
  try {
    await AsyncStorage.setItem("userAllergies", JSON.stringify(userAllergies));
  } catch (error) {
    console.error("Error storing allergy preferences:", error);
    throw new Error("Failed to store allergy preferences");
  }
};

const getUserAllergies = async () => {
  try {
    const userAllergies = await AsyncStorage.getItem("userAllergies");

    return userAllergies ? JSON.parse(userAllergies) : [];
  } catch (error) {
    console.error("Error getting allergy preferences:", error);
    throw new Error("Failed to get allergy preferences");
  }
};

const storeUserCuisines = async (userCuisines: Preference[]) => {
  try {
    await AsyncStorage.setItem("userCuisines", JSON.stringify(userCuisines));
  } catch (error) {
    console.error("Error storing cuisine preferences:", error);
    throw new Error("Failed to store cuisine preferences");
  }
};

const getUserCuisines = async () => {
  try {
    const userCuisines = await AsyncStorage.getItem("userCuisines");

    return userCuisines ? JSON.parse(userCuisines) : [];
  } catch (error) {
    console.error("Error getting cuisine preferences:", error);
    throw new Error("Failed to get cuisine preferences");
  }
};

const storeUserTastes = async (userTastes: Preference[]) => {
  try {
    await AsyncStorage.setItem("userTastes", JSON.stringify(userTastes));
  } catch (error) {
    console.error("Error storing taste preferences:", error);
    throw new Error("Failed to store taste preferences");
  }
};

const getUserTastes = async () => {
  try {
    const userTastes = await AsyncStorage.getItem("userTastes");

    return userTastes ? JSON.parse(userTastes) : [];
  } catch (error) {
    console.error("Error getting taste preferences:", error);
    throw new Error("Failed to get taste preferences");
  }
};

export const storedPreferencesService = {
  storeUserAllergies,
  getUserAllergies,
  storeUserCuisines,
  getUserCuisines,
  storeUserTastes,
  getUserTastes,
};
