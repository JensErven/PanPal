import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { AuthContext, useAuth } from "@/context/authContext";
import { RecipeType } from "@/models/RecipeType";
import { SavedRecipeType } from "@/models/SavedRecipeType";

type RecipesContextType = {
  recipes: SavedRecipeType[];
  isLoading: boolean;
};

const defaultValue: RecipesContextType = {
  recipes: [],
  isLoading: false,
};

export const RecipesContext = createContext<RecipesContextType>(defaultValue);

export const RecipesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<SavedRecipeType[]>([]);

  useEffect(() => {
    if (user && user.userId) {
      const recipesRef = collection(db, "recipes");
      const q = query(recipesRef, where("uuid", "==", user.userId));
      setIsLoading(true);
      const subscriber = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedRecipes: SavedRecipeType[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as RecipeType;
            fetchedRecipes.push({ id: doc.id, data });
          });
          setRecipes(fetchedRecipes);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching recipes:", error);
          setIsLoading(false);
        }
      );
      return () => subscriber();
    } else {
      console.log("User is not authenticated");
    }
  }, [user]);

  return (
    <RecipesContext.Provider value={{ recipes, isLoading }}>
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
};
