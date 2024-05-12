import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { recipeService } from "@/services/db/recipe.services";
import { RecipeType } from "@/models/RecipeType";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import CustomHeader from "@/components/navigation/CustomHeader";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { StatusBar } from "expo-status-bar";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const DetailsRecipe = () => {
  const { recipeId } = useLocalSearchParams();

  const [recipe, setRecipe] = useState<RecipeType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch recipe details when currentRecipeId changes
    const fetchRecipe = async () => {
      setIsLoading(true);

      const recipeData = await recipeService.getRecipe(recipeId as string);
      if (!recipeData) {
        console.log("No recipe found");
        return;
      }
      setRecipe(recipeData);
      console.log("Recipe found:", recipeData);
      setIsLoading(false);
    };
    fetchRecipe();
  }, []);

  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={[
        Colors.light.navHeader[0],
        Colors.light.navHeader[1],
        Colors.light.navHeader[2],
      ]}
      start={[0, 0]}
      end={[1, 0]}
    >
      <CustomHeader
        isTransparent={true}
        headerTitle={"Recipe Details"}
        hasGoBack={true}
      />

      <CustomKeyBoardView>
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, Colors.white]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <StatusBar style="light" />
          {isLoading ? (
            <ActivityIndicator
              size={wp(15)}
              style={{ padding: wp(5) }}
              color={Colors.mediumBlue}
            />
          ) : (
            <View style={styles.content}>
              <Text>{recipe?.title}</Text>
              <Text>{recipe?.description}</Text>
              <View>
                <Text>Ingredients</Text>
                <View>
                  {recipe?.ingredients.map((ingredient, index) => (
                    <Text key={index}>{ingredient}</Text>
                  ))}
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default DetailsRecipe;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
    minHeight: hp(100),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    gap: hp(4),
  },
});
