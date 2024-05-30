import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { UserData } from "@/app/(app)/profile/edit";
import { AuthContext, useAuth } from "@/context/authContext"; // Import the useAuth hook to access the setUser function
import { useContext } from "react";

const updateUser = async (user: any, userData: any) => {
  try {
    const docRef = doc(db, "users", user.userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: "User not found" };
    } else {
      // Merge the new props with existing user data and update the document
      await updateDoc(docRef, {
        ...docSnap.data(),
        ...userData,
      });
      // Update the user context with the new user data

      return { success: true, message: "User updated successfully" };
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user" };
  }
};

export const userService = {
  updateUser,
};
