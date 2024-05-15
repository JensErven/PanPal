import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { preferenceType } from "@/models/PreferenceType";
import { Alert, ToastAndroid } from "react-native";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    // onAuthStateChanged
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
        retrieveAndStoreUserTastePreferences(user.uid);
        subscribeToUserDocChanges(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // clear async storage of the taste preferences
      }
    });
    return unsub;
  }, []);

  const subscribeToUserDocChanges = (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      console.log("Data Changed");
      if (doc.exists()) {
        let data = doc.data();
        setUser({
          ...user,
          username: data.username,
          email: data.email,
          userId: userId,
          bio: data?.bio,
          profileUrl: data?.profileUrl,
        });
      }
    });
    return unsubscribe;
  };

  const updateUserData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        email: data.email,
        userId: uid,
        bio: data?.bio,
        profileUrl: data?.profileUrl,
      });
    }
  };

  const handleSendPasswordResetEmail = async (email: string) => {
    try {
      // Call the sendPasswordResetEmail function provided by Firebase
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        msg: "Email succesfully sent to " + email,
      };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const login = async (email: string, password: string) => {
    // signInWithEmailAndPassword
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (!response.user.emailVerified) {
        Alert.alert(
          "Email not verified",
          "Please verify your email before signing in."
        );
        return { success: false, msg: "Email not verified" };
      }
      return { success: true, data: response.user };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("auth/user-not-found")) {
        msg = "User not found";
      } else if (msg.includes("auth/wrong-password")) {
        msg = "Wrong password";
      } else if (msg.includes("auth/invalid-email")) {
        msg = "Invalid email";
      } else if (msg.includes("auth/invalid-credential")) {
        msg = "Invalid credentials";
      }
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      // logout
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const register = async (email: string, password: string) => {
    // createUserWithEmailAndPassword
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(response.user);
      Alert.alert(
        "Verification email sent",
        "Please verify your email before signing in."
      );
      const username = email.split("@")[0].replace(/\./g, " ");

      setDoc(doc(db, "users", response?.user?.uid), {
        email,
        username,
      });
      return { success: true, data: response.user };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("auth/email-already-in-use")) {
        msg = "Email already in use";
      } else if (msg.includes("auth/weak-password")) {
        msg = "Weak password";
      } else if (msg.includes("auth/invalid-email")) {
        msg = "Invalid email";
      }
      return { success: false, msg };
    }
  };

  const retrieveAndStoreUserTastePreferences = async (userId: string) => {
    try {
      // Retrieve user taste preferences from Firestore
      const docRef = doc(db, "userTastePreferences", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const preferences = docSnap.data();

        // Store preferences in AsyncStorage
        await AsyncStorage.setItem(
          `userTastePreferences`,
          JSON.stringify(preferences)
        );

        console.log(
          "User taste preferences retrieved from Firebase and stored in AsyncStorage."
        );
      } else {
        console.log("User taste preferences not found in Firestore.");
      }
    } catch (error) {
      console.error(
        "Error retrieving and storing user taste preferences:",
        error
      );
    }
  };
  const storeUserTastePreferencesToFirebase = async (userId: string) => {
    console.log("Storing user taste preferences in Firebase.");
    try {
      // get the preferences from async storage
      const preferences = await AsyncStorage.getItem("userTastePreferences");
      console.log("preferences", preferences);
      if (!preferences) {
        console.log("No preferences found in AsyncStorage.");
        return;
      }
      const parsedPreferences = JSON.parse(preferences);
      // Update or create preferences documents in Firestore
      parsedPreferences.forEach(async (preference: preferenceType) => {
        const docRef = doc(db, "userTastePreferences", userId);
        const newDoc = {
          selectedOptions: preference.selectedOptions,
          title: preference.title,
          addInputPlaceholder: preference.addInputPlaceholder,
          searchInputPlaceholder: preference.searchInputPlaceholder,
        } as preferenceType;
        await setDoc(docRef, newDoc);
      });
      console.log("User taste preferences stored in Firebase");
    } catch (error) {
      console.error("Error storing user taste preferences:", error);
      // Handle specific types of errors if needed
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        handleSendPasswordResetEmail,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        register,
        storeUserTastePreferencesToFirebase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return value;
};
