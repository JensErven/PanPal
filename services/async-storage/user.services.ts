import { db } from "@/firebaseConfig";
import { preferenceOption } from "@/models/PreferenceOption";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

const storeIsUserFirstTime = async (value: boolean) => {
  try {
    await AsyncStorage.setItem("isUserFirstTime", JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

const getIsUserFirstTime = async () => {
  try {
    const value = await AsyncStorage.getItem("isUserFirstTime");
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};

export const storedUser = {
  storeIsUserFirstTime,
  getIsUserFirstTime,
};
