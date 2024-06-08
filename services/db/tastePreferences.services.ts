import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { TastePreferencesType } from "@/models/TastePreferencesType";
import AsyncStorage from "@react-native-async-storage/async-storage";

const collectionName: string = "tastePreferences";

const updateTastePreferences = async (
  userId: string,
  tastePreferences: TastePreferencesType
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const docRef = doc(db, collectionName, userId);
    await setDoc(docRef, tastePreferences).then();
    await AsyncStorage.setItem(
      "tastePreferences",
      JSON.stringify(tastePreferences)
    );
    return { success: true, message: "Taste preferences updated" };
  } catch (error) {
    console.error("Error updating taste preferences:", error);
    return { success: false, message: "Failed to update taste preferences" };
  }
};

const createTastePreferences = async (
  userId: string,
  tastePreferences: TastePreferencesType
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const docRef = doc(db, collectionName, userId);
    await setDoc(docRef, tastePreferences).then();
    return { success: true, message: "Taste preferences created" };
  } catch (error) {
    console.error("Error creating taste preferences:", error);
    return { success: false, message: "Failed to create taste preferences" };
  }
};

const retreiveTastePreferences = async (
  userId: string
): Promise<TastePreferencesType | null> => {
  try {
    const docRef = doc(db, collectionName, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as TastePreferencesType;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving taste preferences:", error);
    return null;
  }
};

export {
  updateTastePreferences,
  createTastePreferences,
  retreiveTastePreferences,
};
