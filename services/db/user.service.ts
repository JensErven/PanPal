import { FIREBASE_DB as db } from "@/firebaseConfig";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const createUser = async (userData: any) => {
  try {
    const usersCollection = collection(db, "users");

    await addDoc(usersCollection, userData);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const getUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user");
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    await updateDoc(doc(db, "users", userId), userData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};
