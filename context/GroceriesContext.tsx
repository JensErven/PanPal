import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, useAuth } from "@/context/authContext";
import { GroceryListType } from "@/services/db/groceries.services";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type GroceriesContextType = {
  groceryLists: GroceryListType[];
  isLoading: boolean;
};

const defaultValue: GroceriesContextType = {
  groceryLists: [],
  isLoading: false,
};

export const GroceriesContext =
  createContext<GroceriesContextType>(defaultValue);

export const GroceriesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groceryLists, setGroceryLists] = useState<GroceryListType[]>([]);

  useEffect(() => {
    if (user && user.userId) {
      const groceryListsRef = collection(db, "groceries");
      const q = query(
        groceryListsRef,
        where("uuids", "array-contains", user.userId)
      );
      setIsLoading(true);
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedGroceryLists: GroceryListType[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as GroceryListType;
            fetchedGroceryLists.push({ ...data, id: doc.id }); // Include id only once
          });
          setGroceryLists(fetchedGroceryLists);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching grocery lists:", error);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <GroceriesContext.Provider value={{ groceryLists, isLoading }}>
      {children}
    </GroceriesContext.Provider>
  );
};

export const useGroceries = () => {
  const context = useContext(GroceriesContext);
  if (context === undefined) {
    throw new Error("useGroceries must be used within a GroceriesProvider");
  }
  return context;
};
