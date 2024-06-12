import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { RecipeType } from "@/models/RecipeType";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import uuid from "react-native-uuid";
import { compressImage } from "@/utils/file.utils";

const collectionName: string = "recipes";

const createRecipe = async (recipeData: RecipeType) => {
  try {
    const docRef = doc(collection(db, collectionName));
    if (recipeData.image) {
      const downloadURL = await uploadImageToFirebase(recipeData.image);
      recipeData.image = downloadURL;
    }
    await setDoc(docRef, recipeData).then();
    return {
      success: true,
      message: "Recipe created successfully",
      id: docRef.id,
    };
  } catch (error) {
    return { success: false, message: "Failed to create recipe" };
  }
};

const updateRecipe = async (
  recipeId: string,
  recipeData: RecipeType
): Promise<{
  success: boolean;
  message: string;
  recipeData?: RecipeType;
}> => {
  try {
    const docRef = doc(db, collectionName, recipeId);

    const existingRecipe = (await getDoc(docRef)).data() as RecipeType;

    // check if the image is the same as the existing image
    if (recipeData.image && recipeData.image !== existingRecipe.image) {
      // delete the existing image
      if (existingRecipe.image)
        await deleteImageFromFirebase(existingRecipe.image);
      const downloadURL = await uploadImageToFirebase(recipeData.image);
      recipeData.image = downloadURL;
    }
    // remove id from the recipeData
    delete recipeData.id;

    await updateDoc(docRef, recipeData);
    return {
      success: true,
      message: "Recipe updated successfully",
      recipeData,
    };
  } catch (error) {
    return { success: false, message: "Failed to update recipe" };
  }
};

const uploadImageToFirebase = async (image: string) => {
  try {
    const compressedImage = await compressImage(image);
    const fetchResponse = await fetch(compressedImage);

    const blob = await fetchResponse.blob();
    const storageRef = ref(storage, `recipeImages/${uuid.v4()}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        throw error; // Re-throw the error to be caught by the caller
      }
    );

    // Wait for upload to complete
    await uploadTask;

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the caller
  }
};

const getRecipesForUser = async (userId: string) => {
  try {
    const recipesRef = collection(db, collectionName);
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
    throw error;
  }
};

const deleteRecipe = async (recipeId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, recipeId));
    return { success: true, message: "Recipe deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete recipe" };
  }
};

const deleteImageFromFirebase = async (imageUrl: string) => {
  // If the imageUrl contains "firebase", it's a Firebase Storage URL
  if (!imageUrl) return;
  if (!imageUrl.includes("firebasestorage")) {
    return { success: true, message: "Invalid image URL" };
  }

  // Get a reference to the storage
  const storage = getStorage();

  // Create a reference to the image file
  const imageRef = ref(storage, imageUrl);

  // Delete the image file
  deleteObject(imageRef)
    .then(() => {
      return { success: true, message: "Image deleted successfully" };
    })
    .catch((error) => {
      return { success: false, message: "Failed to delete image" };
    });
};

const deleteImage = async (imageUrl: string) => {
  try {
    const storage = getStorage();
    const imageRef = storageRef(storage, imageUrl);
    await deleteObject(imageRef);
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete image" };
  }
};

const getRecipe = async (recipeId: string) => {
  // subscribe to recipe snapshot
  const recipeRef = doc(db, collectionName, recipeId);
  const recipeSnapshot = await getDoc(recipeRef);
  // save the id of the recipe to the recipeData
  const recipeData = recipeSnapshot.data() as RecipeType;
  recipeData.id = recipeSnapshot.id;

  return recipeData;
};

const saveTipsToRecipe = async (recipeId: string, tips: string[]) => {
  try {
    const recipeRef = doc(db, collectionName, recipeId);
    await updateDoc(recipeRef, { tips });
    return { success: true, message: "Tips saved successfully" };
  } catch (error) {
    return { success: false, message: "Failed to save tips" };
  }
};

export const recipeService = {
  getRecipe,
  updateRecipe,
  deleteImageFromFirebase,
  deleteRecipe,
  uploadImageToFirebase,
  getRecipesForUser,
  createRecipe,
  deleteImage,
  saveTipsToRecipe,
};
