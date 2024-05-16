import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
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

const RecipeContent = ({ content }: { content: recipeExampleJsonType }) => {
  const { user } = useContext<any>(AuthContext);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
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
      uuid: user.userId,
      isGenerated: true,
    };
  };

  const handleSaveRecipe = async (recipe: recipeExampleJsonType) => {
    setIsLoading(true);

    try {
      const formattedRecipe = formatRecipe(recipe);
      await recipeService.createRecipe(formattedRecipe);
      setIsSaved(true); // Update saved status
    } catch (e) {
      console.log(e);
    } finally {
      console.log("Recipe saved");
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {content.title} {content.servings && `(${content.servings} pers.)`}
      </Text>

      <Text style={styles.text}>{content.description}</Text>
      <View style={styles.ingredientsContentContainer}>
        <Text style={styles.subTitle}>Ingredients:</Text>
        <View style={styles.ingredientsList}>
          {content.ingredients.map((ingredient: any, index: number) => (
            <View
              key={index}
              style={{
                elevation: 2,
                justifyContent: "center",
                paddingHorizontal: wp(2),
                flexDirection: "row",
                height: hp(ComponentParams.button.height.small),
                backgroundColor:
                  Colors.light.components.button.white.background[1],
                borderRadius: hp(ComponentParams.button.height.small),
                shadowColor: Colors.darkBlue,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
              }}
            >
              <Text style={styles.text}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.stepsContentContainer}>
        <Text style={styles.subTitle}>Steps:</Text>
        <View style={styles.stepsList}>
          {content.steps.map((step: any, index: number) => (
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", gap: wp(1) }}
            >
              <Text style={styles.text} key={index}>
                - {step}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.typesItemsContainer}>
        {content.mealType && (
          <View>
            <Text style={styles.subTitle}>Meal Type:</Text>
            <Text style={styles.text}>{content.mealType}</Text>
          </View>
        )}
        {content.cuisineType && (
          <View>
            <Text style={styles.subTitle}>Cuisine Type:</Text>
            <Text style={styles.text}>{content.cuisineType}</Text>
          </View>
        )}
      </View>
      <View style={{ width: "100%", marginTop: hp(2) }}>
        <StandardButton
          isDisabled={isLoading || isSaved}
          icon={
            isLoading ? (
              <ActivityIndicator size="large" color={Colors.white} />
            ) : (
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={hp(2.7)}
                color={Colors.white}
              />
            )
          }
          textValue={
            isSaved ? "Saved" : isLoading ? "Saving..." : "Save Recipe"
          }
          height={ComponentParams.button.height.medium}
          colors={[
            Colors.light.components.button.purple.background[0],
            Colors.light.components.button.purple.background[1],
            Colors.light.components.button.purple.background[2],
          ]}
          borderColor={Colors.light.components.button.purple.background[0]}
          textColor={Colors.white}
          shadowColor={Colors.light.components.button.white.dropShadow}
          clickHandler={() => {
            handleSaveRecipe(content);
          }}
        />
      </View>
    </View>
  );
};

export default RecipeContent;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    gap: hp(2),
    display: "flex",
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
  ingredientsList: {
    gap: hp(1),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
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
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
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