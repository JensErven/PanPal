import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { AuthContext } from "@/context/authContext";
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
  const { user } = useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<SavedRecipeType[]>([]);

  useEffect(() => {
    if (user && user.userId) {
      const recipesRef = collection(db, "recipes");
      setIsLoading(true);
      const subscriber = onSnapshot(
        recipesRef,
        (querySnapshot) => {
          const fetchedRecipes: SavedRecipeType[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as RecipeType;
            if (data.uuid === user.userId) {
              fetchedRecipes.push({ id: doc.id, data });
            }
          });
          setRecipes(fetchedRecipes);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        },
        (error) => {
          console.error("Error fetching recipes:", error);
          setIsLoading(false);
        }
      );
      return () => subscriber();
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
