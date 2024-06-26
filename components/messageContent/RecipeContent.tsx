import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useMemo } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { recipeExampleJsonType } from "@/models/openai/recipeExampleJsonType";
import ComponentParams from "@/constants/ComponentParams";
import StandardButton from "../buttons/StandardButton";
import { Ionicons } from "@expo/vector-icons";
import { recipeService } from "@/services/db/recipe.services";
import { RecipeType } from "@/models/RecipeType";
import { AuthContext } from "@/context/authContext";
import { router } from "expo-router";
import { RecipesContext } from "@/context/recipesContext";
import SmallInfoTag from "../recipe-details/SmallInfoTag";

const RecipeContent = ({ content }: { content: recipeExampleJsonType }) => {
  const { recipes } = useContext<any>(RecipesContext);
  const { user } = useContext<any>(AuthContext);
  const [savedRecipeId, setSavedRecipeId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const isSaved = useMemo<boolean>(() => {
    if (!savedRecipeId) return false;
    if (recipes.find((r: RecipeType) => r.id === savedRecipeId)) return true;
    return false;
  }, [savedRecipeId, recipes]);

  const formatRecipe = (recipe: recipeExampleJsonType): RecipeType => {
    return {
      title: recipe.title.toLowerCase().trim(),
      description: recipe.description.toLowerCase().trim(),
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      prepTime: parseInt(recipe.prepTime), // Convert prepTime to number
      cookTime: parseInt(recipe.cookTime), // Convert cookTime to number
      servings: parseInt(recipe.servings), // Convert servings to number
      cuisineType: recipe.cuisineType,
      mealType: recipe.mealType.toLowerCase().trim(),
      dietType: recipe.dietType,
      uuid: user.userId,
      isGenerated: true,
      createdAt: new Date().toISOString(),
    };
  };

  const handleSaveRecipe = async (recipe: recipeExampleJsonType) => {
    setIsLoading(true);

    try {
      const formattedRecipe = formatRecipe(recipe);
      await recipeService.createRecipe(formattedRecipe).then((response) => {
        if (!response.id) return;

        setSavedRecipeId(response.id);
      });
    } catch (e) {
      Alert.alert("Error", "An error occurred while saving the recipe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRecipe = async () => {
    if (!savedRecipeId && !isSaved) return;
    // check if the recipe still exists in the context
    const recipe = recipes.find((r: RecipeType) => r.id === savedRecipeId);
    if (!recipe) return;
    router.push({
      pathname: `/recipe/details/${savedRecipeId}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {content.title} {content.servings && `(${content.servings} pers.)`}
      </Text>

      <Text style={styles.text}>{content.description}</Text>
      <View style={styles.contentItemContainer}>
        <Text style={styles.subTitle}>Ingredients:</Text>
        <View style={styles.ingredientsList}>
          {content.ingredients.map((ingredient: any, index: number) => (
            <SmallInfoTag key={index} text={ingredient} />
          ))}
        </View>
      </View>

      <View style={styles.contentItemContainer}>
        <Text style={styles.subTitle}>Steps:</Text>
        <View style={styles.stepsList}>
          {content.steps.map((step: any, index: number) => (
            <View
              key={index}
              style={{ flexDirection: "row", flexWrap: "wrap", gap: wp(1) }}
            >
              <Text style={styles.text} key={index}>
                - {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.contentItemContainer}>
        <Text style={styles.subTitle}>Extra info:</Text>
        <View style={styles.infoTagListContainer}>
          {content.mealType && (
            <SmallInfoTag
              text={content.mealType}
              icon={
                <Ionicons
                  name="restaurant"
                  size={hp(2)}
                  color={Colors.darkGrey}
                />
              }
            />
          )}
          {content.cuisineType && <SmallInfoTag text={content.cuisineType} />}
          {content.dietType && <SmallInfoTag text={content.dietType} />}
        </View>
      </View>
      <View
        style={{
          width: "100%",
          marginTop: hp(2),
          flexDirection: "row",
          gap: wp(2),
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isSaved && savedRecipeId ? (
          <>
            <Ionicons
              name="bookmark"
              size={hp(3.2)}
              color={Colors.mediumPurple}
            />
            <View style={{ flex: 1 }}>
              <StandardButton
                textValue="Go to Recipe"
                height={ComponentParams.button.height.medium}
                colors={Colors.light.components.button.purple.background}
                borderColor={
                  Colors.light.components.button.purple.background[0]
                }
                textColor={Colors.white}
                shadowColor={Colors.light.components.button.white.dropShadow}
                clickHandler={() => handleGoToRecipe()}
                iconRight={
                  <Ionicons
                    name="arrow-forward"
                    size={hp(3.2)}
                    style={{ marginRight: wp(2) }}
                    color={Colors.white}
                  />
                }
              />
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                handleSaveRecipe(content);
              }}
            >
              <Ionicons
                name="bookmark"
                size={hp(3.2)}
                color={Colors.secondaryWhite}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <StandardButton
                isDisabled={isLoading || isSaved}
                textValue={
                  isSaved ? "Saved" : isLoading ? "Saving..." : "Save Recipe"
                }
                height={ComponentParams.button.height.medium}
                colors={Colors.light.components.button.purple.background}
                borderColor={
                  Colors.light.components.button.purple.background[0]
                }
                textColor={Colors.white}
                shadowColor={Colors.light.components.button.white.dropShadow}
                clickHandler={() => {
                  handleSaveRecipe(content);
                }}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default RecipeContent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: hp(2),
    width: "100%",
  },
  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
  },
  optionListContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  contentItemContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(1),
  },
  infoTagListContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: wp(2),
  },
  ingredientsList: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: wp(2),
  },
  stepsList: {
    flexDirection: "column",
    justifyContent: "center",
  },

  ingredientsContentContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(1),
  },
  stepsContentContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  subTitle: {
    fontFamily: Fonts.QuickSandBold.fontFamily,
    fontSize: Fonts.QuickSandBold.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.QuickSandBold.lineHeight,
  },
  timesItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typesItemsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});
