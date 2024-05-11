import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { UserData } from "@/app/(app)/profile/edit";
import { AuthContext, useAuth } from "@/context/authContext"; // Import the useAuth hook to access the setUser function
import { useContext } from "react";
import { RecipeType } from "@/models/RecipeType";
import {
  getDownloadURL,
  ref,
  ref as storageRef,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";

const createRecipe = async (recipeData: RecipeType) => {
  try {
    const docRef = doc(collection(db, "recipes"));
    if (recipeData.image) {
      const downloadURL = await uploadImageToFirebase(recipeData.image);
      recipeData.image = downloadURL;
    }
    await setDoc(docRef, recipeData);
    return { success: true, message: "Recipe created successfully" };
  } catch (error) {
    // Handle errors
    console.error("Error creating recipe:", error);
    return { success: false, message: "Failed to create recipe" };
  }
};

const uploadImageToFirebase = async (image: string) => {
  try {
    const fetchResponse = await fetch(image);
    const blob = await fetchResponse.blob();
    const storageRef = ref(storage, `recipeImages/${uuid.v4()}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Error uploading image:", error);
        throw error; // Re-throw the error to be caught by the caller
      }
    );

    // Wait for upload to complete
    await uploadTask;

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log("File available at", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

export const recipeService = {
  // getRecipe,
  // updateRecipe,
  // deleteRecipe,
  uploadImageToFirebase,
  createRecipe,
};
