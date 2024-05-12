import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { UserData } from "@/app/(app)/profile/edit";
import { AuthContext, useAuth } from "@/context/authContext"; // Import the useAuth hook to access the setUser function
import { useContext } from "react";
import { RecipeType } from "@/models/RecipeType";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
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

const getRecipesForUser = async (userId: string) => {
  try {
    const recipesRef = collection(db, "recipes");
    const userQuery = query(recipesRef, where("uuid", "==", userId));
    const querySnapshot = await getDocs(userQuery);

    const recipesWithId: { id: string; data: RecipeType }[] = [];
    querySnapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data() as RecipeType;
      recipesWithId.push({ id, data });
    });

    return recipesWithId; // Return array of objects with doc ID and recipe data
  } catch (error) {
    console.error("Error getting recipes:", error);
    throw error;
  }
};

const deleteRecipe = async (recipeId: string) => {
  try {
    await deleteDoc(doc(db, "recipes", recipeId));
    return { success: true, message: "Recipe deleted successfully" };
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { success: false, message: "Failed to delete recipe" };
  }
};

const deleteImageFromFirebase = async (imageUrl: string) => {
  try {
    // If the imageUrl contains "firebase", it's a Firebase Storage URL

    // Get a reference to the storage
    const storage = getStorage();

    // Create a reference to the image file
    const imageRef = ref(storage, imageUrl);

    // Delete the image file
    await deleteObject(imageRef);

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: "Failed to delete image" };
  }
};

const getRecipe = async (recipeId: string) => {
  try {
    const docRef = doc(db, "recipes", recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as RecipeType;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting recipe:", error);
    return null;
  }
};

export const recipeService = {
  getRecipe,
  // updateRecipe,
  deleteImageFromFirebase,
  deleteRecipe,
  uploadImageToFirebase,
  getRecipesForUser,
  createRecipe,
};
