import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FIREBASE_DB as db } from "@/firebaseConfig";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useSession } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { updateRecipe } from "@/services/db/recipe.service";
const saved = () => {
  const [recipes, setRecipes] = useState<any>([]);
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const recipeRef = collection(db, "recipes");

    const subscriber = onSnapshot(recipeRef, {
      next: (snapshot) => {
        console.log("snapshot", snapshot);
        const recipes: any[] = [];
        snapshot.docs.forEach((doc) => {
          const recipeData = doc.data();
          if (recipeData.uuid === session) {
            recipes.push({ ...recipeData, id: doc.id });
          }
        });
        setRecipes(recipes);
        setIsLoading(false);
      },
    });

    return () => subscriber();
  }, [session]);

  const handleFavoriteRecipe = (recipeId: string) => {
    const recipe = recipes.find((recipe: any) => recipe.id === recipeId);
    const response = updateRecipe(recipeId, {
      isFavorited: !recipe.isFavorited,
    });
    console.log(response);
  };

  return (
    <View style={styles.pageContainer}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {recipes.map((recipe: any) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <View style={styles.imageContainer}>
                {recipe.imageUrl ? (
                  <Image source={recipe.imageUrl} />
                ) : (
                  <Ionicons name="image-outline" size={24} color="grey" />
                )}
              </View>
              <View style={styles.recipeCardInfo}>
                <Text>{recipe.title}</Text>
              </View>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleFavoriteRecipe(recipe.id)}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color={recipe.isFavorited ? "red" : "white"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default saved;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "space-evenly", // Changed from "space-around

    alignItems: "center",
  },
  scrollView: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  favoriteButton: {
    elevation: 5,
    position: "absolute",
    top: 0,
    right: 0,
    padding: 6,
    zIndex: 1,
  },
  recipeCard: {
    width: "48%",
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,

    elevation: 5,
  },
  imageContainer: {
    borderRadius: 8,
    elevation: 5,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    paddingBottom: "100%", // make the height equal to the width
    marginBottom: 8,
    aspectRatio: 1, // make the image square
  },
  recipeCardInfo: {
    padding: 8,
  },
});
