import { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  Timestamp,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { preferenceType } from "@/models/PreferenceType";
import { Alert } from "react-native";

export const AuthContext = createContext(null);

export type TastePreferenceType = {
  cuisineTypes: string[];
  allergyTypes: string[];
};

export type UserCreditsType = {
  credits: number;
  lastResetDay: Timestamp;
};

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [credits, setCredits] = useState<UserCreditsType>(
    {} as UserCreditsType
  );
  const [tastePreferences, setTastePreferences] = useState<TastePreferenceType>(
    { cuisineTypes: [], allergyTypes: [] }
  );
  const unsubscribeFunctions = useRef<(() => void)[]>([]); // Use useRef instead of useState

  useEffect(() => {
    const unsubscribeAll = () => {
      unsubscribeFunctions.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeFunctions.current.length = 0; // Clear the array
    };

    const handleAuthStateChanged = (user: any) => {
      if (user && user.uid && user.emailVerified) {
        setIsAuthenticated(true);
        updateUserData(user.uid);
        subscribeToUserTastePreferencesDocChanges(user.uid);
        const unsubscribeCredits = subscribeToCreditsDocChanges(user.uid);
        const unsubscribeUser = subscribeToUserDocChanges(user.uid);
        unsubscribeFunctions.current.push(unsubscribeCredits, unsubscribeUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setCredits({} as UserCreditsType);
      }
    };

    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      handleAuthStateChanged
    );

    return () => {
      unsubscribeAll(); // Unsubscribe from all listeners
      unsubscribeAuthStateChanged(); // Unsubscribe from onAuthStateChanged
    };
  }, []);

  /**
   * Subscribes to changes in the credits document for a specific user.
   * If the document exists, it checks if the last reset day is different from today.
   * If it is different, it resets the credits to 50 and updates the document.
   * If it is the same, it sets the credits and last reset day from the document.
   * If the document does not exist, it creates a new document with initial credits of 50 and the current date as the last reset day.
   * @param userId The ID of the user.
   * @returns A function to unsubscribe from the snapshot listener.
   */
  const subscribeToCreditsDocChanges = (userId: string) => {
    const creditsDocRef = doc(db, "credits", userId);
    const unsubscribe = onSnapshot(creditsDocRef, async (doc) => {
      if (doc.exists()) {
        console.log("Credits doc exists");
        let data = doc.data();
        const today = new Date();
        const todayMidnight = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0
        );
        const lastResetDay = data.lastResetDay.toDate();
        const lastResetDayMidnight = new Date(
          lastResetDay.getFullYear(),
          lastResetDay.getMonth(),
          lastResetDay.getDate(),
          0,
          0,
          0,
          0
        );
        console.log("lastResetDayMidnight", lastResetDayMidnight);
        console.log("todayMidnight", todayMidnight);
        if (lastResetDayMidnight.getTime() !== todayMidnight.getTime()) {
          const newCreditsData = await resetCredits(50, userId);
          if (newCreditsData) {
            setCredits(newCreditsData);
          }
        } else {
          setCredits({
            credits: data.credits,
            lastResetDay: data.lastResetDay,
          });
        }
      } else {
        console.log("Credits doc does not exist");
        setCredits({ credits: 50, lastResetDay: Timestamp.now() });
        await setDoc(creditsDocRef, {
          credits: 50,
          lastResetDay: Timestamp.now(),
        });
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    console.log("User", user);
    console.log("Credits", credits);
    console.log("TastePreferences", tastePreferences);
  }, [user, credits, tastePreferences]);

  const resetCredits = async (amount: number, userId: string) => {
    const newCredits = amount;
    const newLastResetDay = Timestamp.now();

    if (userId) {
      console.log("Resetting credits to 50");
      const creditsDocRef = doc(db, "credits", userId);
      await updateDoc(creditsDocRef, {
        credits: newCredits,
        lastResetDay: newLastResetDay,
      });

      // Return the updated credits data
      return { credits: newCredits, lastResetDay: newLastResetDay };
    }
  };

  const substractCredits = async (amount: number) => {
    if (credits.credits >= amount) {
      const newCredits = credits.credits - amount;
      setCredits((prevCredits) => ({ ...prevCredits, credits: newCredits }));
      if (user?.userId) {
        const creditsDocRef = doc(db, "credits", user.userId);
        await updateDoc(creditsDocRef, { credits: newCredits });
      }
    } else {
      Alert.alert(
        "Insufficient credits",
        "You do not have enough credits to perform this action."
      );
    }
  };

  const subscribeToUserDocChanges = (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUser((prevUser: any) => ({
          ...prevUser,
          username: data.username,
          email: data.email,
          userId: userId,
          bio: data?.bio,
          profileUrl: data?.profileUrl,
        }));
      }
    });
    return unsubscribe;
  };

  const subscribeToUserTastePreferencesDocChanges = (userId: string) => {
    const userDocRef = doc(db, "tastePreferences", userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as TastePreferenceType;
        setTastePreferences({
          cuisineTypes: data.cuisineTypes || [],
          allergyTypes: data.allergyTypes || [],
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
      setUser((prevUser: any) => ({
        ...prevUser,
        username: data.username,
        email: data.email,
        userId: uid,
        bio: data?.bio,
        profileUrl: data?.profileUrl,
      }));
    }
  };

  const handleSendPasswordResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        msg: "Email successfully sent to " + email,
      };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const login = async (email: string, password: string) => {
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
      await signOut(auth);
      // Unsubscribe from all Firebase listeners
      unsubscribeFunctions.current.forEach((unsubscribe) => unsubscribe());
      // Clear the array of unsubscribe functions
      unsubscribeFunctions.current.length = 0;

      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const register = async (email: string, password: string) => {
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

      await setDoc(doc(db, "users", response?.user?.uid), {
        email,
        username,
        bio: "",
        profileUrl: "",
      });
      await setDoc(doc(db, "credits", response?.user?.uid), {
        credits: 50,
        lastResetDay: Timestamp.now(),
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

  const storeUserTastePreferencesToFirebase = async (userId: string) => {
    console.log("Storing user taste preferences in Firebase.");
    try {
      const preferences = await AsyncStorage.getItem("tastePreferences");
      console.log("preferences", preferences);
      if (!preferences) {
        console.log("No preferences found in AsyncStorage.");
        return;
      }
      const parsedPreferences = JSON.parse(preferences);
      parsedPreferences.forEach(async (preference: preferenceType) => {
        const docRef = doc(db, "tastePreferences", userId);
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
        substractCredits,
        storeUserTastePreferencesToFirebase,
        credits,
        tastePreferences,
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
