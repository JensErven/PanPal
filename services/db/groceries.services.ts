// services/groceryService.js
import {
  Timestamp,
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
import { db } from "@/firebaseConfig";

export type GroceryListType = {
  id: string;
  name: string;
  uuids: string[];
  items: {
    name: string;
    checked: boolean;
    qty: number;
  }[];
  createdAt?: Timestamp;
};

const collectionName = "groceries";

const createGroceryList = async (groceryListData: GroceryListType) => {
  try {
    if (!groceryListData.uuids)
      return { success: false, message: "No user ids provided" };

    const docRef = doc(collection(db, collectionName));
    const { id, ...data } = groceryListData;
    await setDoc(docRef, data);
    return {
      success: true,
      message: "Grocery List created successfully",
      groceryListData: { id: docRef.id, ...data },
    };
  } catch (error) {
    console.error("Error creating grocery list:", error);
    return { success: false, message: "Failed to create grocery list" };
  }
};

const updateGroceryList = async (
  groceryListId: string,
  groceryListData: GroceryListType
) => {
  try {
    const docRef = doc(db, collectionName, groceryListId);
    await updateDoc(docRef, groceryListData);
    return {
      success: true,
      message: "Grocery List updated successfully",
      groceryListData,
    };
  } catch (error) {
    console.error("Error updating grocery list:", error);
    return { success: false, message: "Failed to update grocery list" };
  }
};

const getGroceryList = async (groceryListId: string) => {
  try {
    const docRef = doc(db, collectionName, groceryListId);
    const docSnap = await getDoc(docRef);
    return { success: true, data: docSnap.data() };
  } catch (error) {
    console.error("Error getting grocery list:", error);
    return { success: false, message: "Failed to get grocery list" };
  }
};

const joinGroceryList = async (groceryListId: string, userId: string) => {
  try {
    const docRef = doc(db, collectionName, groceryListId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists) {
      return { success: false, message: "Grocery List does not exist" };
    }

    const groceryListData = docSnap.data() as GroceryListType;
    if (groceryListData.uuids.includes(userId)) {
      return { success: false, message: "User already in grocery list" };
    }

    groceryListData.uuids.push(userId);
    await updateDoc(docRef, groceryListData);
    return { success: true, message: "User joined grocery list" };
  } catch (error) {
    console.error("Error joining grocery list:", error);
    return { success: false, message: "Failed to join grocery list" };
  }
};

const leaveGroceryList = async (groceryListId: string, userId: string) => {
  try {
    const docRef = doc(db, collectionName, groceryListId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists) {
      return { success: false, message: "Grocery List does not exist" };
    }

    const groceryListData = docSnap.data() as GroceryListType;
    if (!groceryListData.uuids.includes(userId)) {
      return { success: false, message: "User not in grocery list" };
    }

    // Filter out the user who wants to leave
    groceryListData.uuids = groceryListData.uuids.filter((id) => id !== userId);

    // Check if there are no users left in the grocery list
    if (groceryListData.uuids.length === 0) {
      // Delete the document if no users are left
      await deleteDoc(docRef);
      return {
        success: true,
        message: "User left and grocery list deleted as no users left",
      };
    } else {
      // Update the document if there are still users left
      await updateDoc(docRef, groceryListData);
      return { success: true, message: "User left grocery list" };
    }
  } catch (error) {
    console.error("Error leaving grocery list:", error);
    return { success: false, message: "Failed to leave grocery list" };
  }
};

export {
  createGroceryList,
  updateGroceryList,
  getGroceryList,
  joinGroceryList,
  leaveGroceryList,
};
