import {
  View,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  Button,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";

import { router } from "expo-router";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeader from "@/components/navigation/CustomHeader";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  addEmojisToPrompt,
  blurhash,
  randomArrayIndex,
} from "@/utils/general.utils";
import { Ionicons } from "@expo/vector-icons";
import RoundButton from "@/components/buttons/RoundButton";
import PromptSuggestionsList from "@/components/home/PromptSuggestionsList";
import HomeContentItemHeader from "@/components/home/HomeContentItemHeader";
import { openaiServices } from "@/services/api/openai.services";
import { Message } from "@/models/Message";
import { RecipeType } from "@/models/RecipeType";
import { recipeSuggestionService } from "@/services/async-storage/recipeSuggestion.services";
import RecipeSuggestionsList from "@/components/home/RecipeSuggestionsList";
import SetUpTasteProfileCard from "@/components/home/SetUpTasteProfileCard";
import { useAuth } from "@/context/authContext";
import { TastePreferencesType } from "@/models/TastePreferencesType";
import { dietTypes } from "@/constants/tastePreferences/DietTypes";
import { recipeService } from "@/services/db/recipe.services";
import { uuid } from "expo-modules-core";
import { recipeExampleJsonType } from "@/models/openai/recipeExampleJsonType";
import { useRecipes } from "@/context/recipesContext";

const Home = () => {
  const { user, tastePreferences, substractCredits, credits, logout } =
    useAuth();
  const { recipes } = useRecipes();
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState<RecipeType[]>([]);

  useEffect(() => {
    // Fetch stored recipes when component mounts
    (async () => {
      const storedRecipes = await recipeSuggestionService.getSuggestedRecipes();
      setSuggestedRecipes(storedRecipes);
    })();

    const generatedPrompts = generatePromptSuggestions(tastePreferences);
    setPromptSuggestions(generatedPrompts);

    if (tastePreferences) {
      const tastePreferencesEmpty =
        tastePreferences.cuisineTypes.length === 0 &&
        tastePreferences.allergyTypes.length === 0 &&
        tastePreferences.dislikedIngredients.length === 0;

      if (tastePreferencesEmpty) {
        handleClearAllSuggestedRecipes();
      } else {
        if (suggestedRecipes.length < 3 && credits.credits > 0) {
          generateRecipeSuggestion(tastePreferences).then((recipe) => {
            if (recipe) {
              recipe.id = uuid.v4();
              setSuggestedRecipes((prevRecipes) => [...prevRecipes, recipe]);
              recipeSuggestionService.storeSuggestedRecipe(recipe); // Save the new recipe
            }
          });
        } else {
          return;
        }
      }
    }
  }, [tastePreferences]);

  const handleGenerateRecipeSuggestion = async () => {
    if (!tastePreferences) return;
    await generateRecipeSuggestion(tastePreferences).then((recipe) => {
      if (recipe) {
        recipe.id = uuid.v4();
        setSuggestedRecipes((prevRecipes) => [...prevRecipes, recipe]);
        recipeSuggestionService.storeSuggestedRecipe(recipe); // Save the new recipe
      }
    });
  };

  const generatePromptSuggestions = (preferences: TastePreferencesType) => {
    const { cuisineTypes, allergyTypes, dislikedIngredients, dietTypes } =
      preferences;

    const prompts = [
      `What are some ${
        cuisineTypes.length
          ? cuisineTypes[randomArrayIndex(cuisineTypes)]
          : "interesting"
      } recipes?`,
      `What are some recipes without ${
        allergyTypes.length
          ? allergyTypes[randomArrayIndex(allergyTypes)]
          : "common allergens"
      }?`,
      `What are some recipes that don’t include ${
        dislikedIngredients.length
          ? dislikedIngredients[randomArrayIndex(dislikedIngredients)]
          : "unpopular ingredients"
      }?`,

      `What are some healthy meals for a ${
        dietTypes.length
          ? `${dietTypes[randomArrayIndex(dislikedIngredients)]} diet`
          : "diet?"
      }?`,
      "What are some quick and easy meals for a busy day?",
      "What are some meals for a picky eater?",
    ];

    return prompts;
  };

  const parseRecipeContent = (content: string): RecipeType => {
    return JSON.parse(content) as RecipeType;
  };

  const handleClearAllSuggestedRecipes = async () => {
    await recipeSuggestionService.clearSuggestedRecipes();
    setSuggestedRecipes([]);
  };

  const generateRecipeSuggestion = async (
    preferences: TastePreferencesType
  ) => {
    const { cuisineTypes, allergyTypes, dislikedIngredients } = preferences;

    const prompt = `Provide me with a recipe with the following preferences: Cuisine Types: ${
      cuisineTypes[randomArrayIndex(cuisineTypes)]
    }, Allergy Types: ${
      allergyTypes[randomArrayIndex(allergyTypes)]
    }, Disliked Ingredients: ${
      dislikedIngredients[randomArrayIndex(dislikedIngredients)]
    },Diet Types: ${
      dietTypes[randomArrayIndex(dietTypes)]
    }, Make sure that its a unique recipe that doesnt already exist in the list of recipes. ${suggestedRecipes.map(
      (recipe) => recipe.title
    )}`;

    const message: Message = {
      role: "user",
      content: prompt,
    };

    try {
      if (credits.credits < 1) {
        console.log("Not  credits to generate recipe");
        return undefined;
      }
      const response = await openaiServices.generateRecipeSuggestion(message);

      if (response && response.content) {
        const recipe = parseRecipeContent(response.content);

        return recipe;
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error in getting response:", error);
      return undefined;
    }
  };

  const handleSaveSuggestedRecipe = async (recipe: RecipeType) => {
    if (!recipe.id) return;

    const formattedRecipe = {
      ...recipe,
      uuid: user.userId,
      isGenerated: true,
      createdAt: new Date().toISOString(),
    };

    await recipeService
      .createRecipe(formattedRecipe)
      .then((response) => {
        if (!response.id) return;
      })
      .catch((e) => {
        console.error("Error saving recipe:", e);
      });

    await recipeSuggestionService.deleteSuggestedRecipe(recipe.id);
    setSuggestedRecipes(
      suggestedRecipes.filter(
        (suggestedRecipe) => suggestedRecipe.id !== recipe.id
      )
    );
    ToastAndroid.show(
      "Recipe saved successfully to bookmarks!",
      ToastAndroid.SHORT
    );
  };

  const customHeaderChildren = () => {
    return (
      <>
        {user && (
          <RoundButton
            handlePress={() => {
              router.push("/profile");
            }}
          >
            {user.profileUrl ? (
              <Image
                style={styles.profileImage}
                source={user.profileUrl ? user.profileUrl : blurhash}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
              />
            ) : (
              <Ionicons name="person" size={hp(2.7)} color={Colors.white} />
            )}
          </RoundButton>
        )}
      </>
    );
  };

  const doTastePreferencesExist = tastePreferences
    ? tastePreferences.cuisineTypes.length > 0 ||
      tastePreferences.allergyTypes.length > 0 ||
      tastePreferences.dislikedIngredients.length > 0
    : false;

  return (
    <>
      <LinearGradient
        style={styles.gradientBackground}
        colors={Colors.light.navHeader}
        start={[0, 0]}
        end={[1, 0]}
      >
        <CustomHeader
          isTransparent={true}
          hasGoBack={false}
          headerTitle={"Home"}
          children={customHeaderChildren()}
        />
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, "#DDEBF3"]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <CustomKeyBoardView>
            <View style={styles.content}>
              {/* <View style={styles.contentItem}>
                <HomeContentItemHeader
                  title={`Hi ${user?.username},`}
                  subTitleChildren={
                    <Text
                      style={[styles.contentItemSubTitle, { width: wp(50) }]}
                    >
                      Let's make you some unique recipes
                    </Text>
                  }
                />
              </View> */}
              {doTastePreferencesExist ? (
                <View
                  style={[
                    styles.contentItem,
                    { paddingHorizontal: 0, marginTop: hp(4) },
                  ]}
                >
                  <View style={{ paddingHorizontal: wp(4) }}>
                    <HomeContentItemHeader
                      contentRight={
                        suggestedRecipes.length > 0 && (
                          <LinearGradient
                            colors={[
                              Colors.secondaryWhite,
                              Colors.secondaryWhite,
                            ]}
                            style={[
                              styles.justChatButton,
                              {
                                borderColor: Colors.secondaryWhite,
                                borderWidth: 0,
                              },
                            ]}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onPress={() => handleClearAllSuggestedRecipes()}
                            >
                              <Text
                                style={[
                                  styles.justChatButtonText,
                                  { color: Colors.darkGrey },
                                ]}
                              >
                                Clear All
                              </Text>
                              <RoundButton
                                backgroundColor={Colors.primarySkyBlue}
                                transparent={false}
                                children={
                                  <Ionicons
                                    name="trash"
                                    size={hp(1.8)}
                                    color={Colors.darkGrey}
                                  />
                                }
                                height={ComponentParams.button.height.small}
                                handlePress={() =>
                                  handleClearAllSuggestedRecipes()
                                }
                              />
                            </TouchableOpacity>
                          </LinearGradient>
                        )
                      }
                      title="Created for you"
                      subTitleChildren={
                        <>
                          <Text style={styles.contentItemSubTitle}>
                            Recipes based on your
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              router.push("/profile/taste-preferences/details")
                            }
                          >
                            <Text
                              style={[
                                styles.contentItemSubTitle,
                                { textDecorationLine: "underline" },
                              ]}
                            >
                              Taste Profile
                            </Text>
                          </TouchableOpacity>
                        </>
                      }
                    />
                  </View>

                  <RecipeSuggestionsList
                    credits={credits.credits}
                    recipeSuggestions={suggestedRecipes}
                    user={user}
                    saveRecipe={(recipe: RecipeType) => {
                      handleSaveSuggestedRecipe(recipe);
                    }}
                    generateRecipe={() => handleGenerateRecipeSuggestion()}
                    handleClick={() => {}}
                  />
                </View>
              ) : (
                <View style={styles.contentItem}>
                  <SetUpTasteProfileCard
                    title="Set up Your Taste Profile for customized recipes."
                    callToAction={() =>
                      router.push("/profile/taste-preferences")
                    }
                  />
                </View>
              )}

              <View style={styles.contentItem}>
                <HomeContentItemHeader
                  title="Hey PanPal..."
                  contentRight={
                    <LinearGradient
                      colors={Colors.light.components.button.purple.background}
                      style={styles.justChatButton}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => router.push("/panpal/chat")}
                      >
                        <Text style={styles.justChatButtonText}>Just Ask</Text>
                        <RoundButton
                          transparent={true}
                          children={
                            <Ionicons
                              name="chatbubbles"
                              size={hp(1.8)}
                              color={Colors.white}
                            />
                          }
                          height={ComponentParams.button.height.small}
                          handlePress={() => router.push("/panpal/chat")}
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  }
                  subTitleChildren={
                    <Text style={styles.contentItemSubTitle}>
                      Select a topic and start chatting
                    </Text>
                  }
                />
                <PromptSuggestionsList suggestions={promptSuggestions} />
              </View>
            </View>
          </CustomKeyBoardView>
        </LinearGradient>
      </LinearGradient>
    </>
  );
};

export default Home;

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
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingTop: hp(2),
    paddingBottom: hp(14),
    gap: hp(8),
  },
  contentItemSubTitle: {
    color: Colors.darkGrey,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItem: {
    gap: hp(2),
    paddingHorizontal: wp(4),
  },

  headerRightButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.small),
  },
  plusButtonContentContainer: {
    padding: wp(4),
    gap: hp(2),
  },
  homeGreetingContent: {
    paddingHorizontal: wp(4),
  },
  homeGreetingSubTitle: {
    width: wp(60),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_1.lineHeight,
  },
  homeGreetingTitle: {
    fontFamily: Fonts.heading_2.fontFamily,
    fontSize: Fonts.heading_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.heading_2.lineHeight,
  },

  contentHeader: {
    gap: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  justChatButton: {
    elevation: 2,
    borderColor: Colors.darkBlue,
    borderWidth: wp(0.5),
    shadowColor: Colors.cardDropShadow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.darkBlue,
    borderRadius: hp(ComponentParams.button.height.small / 2),
    height: hp(ComponentParams.button.height.small),
    paddingLeft: wp(2),
  },
  justChatButtonText: {
    textTransform: "capitalize",
    paddingHorizontal: wp(2),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.white,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
