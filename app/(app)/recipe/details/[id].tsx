import { View, StyleSheet, ToastAndroid, Alert, Text } from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
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
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import { openaiServices } from "@/services/api/openai.services";
import RecipeDetailsTabBar from "@/components/navigation/RecipeDetailsTabBar";
import RecipeTipsCard from "@/components/cards/RecipeTipsCard";
import RecipeIngredientsDetails from "@/components/RecipeIngredientsDetails";
import RecipeStepsDetails from "@/components/RecipeStepsDetails";
import { AuthContext, useAuth } from "@/context/authContext";
import RecipeImageContainer from "@/components/RecipeImageContainer";
import RecipeHeaderContainer from "@/components/RecipeHeaderContainer";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomizeRecipeOptionsCard from "@/components/recipe-details/CustomizeRecipeOptionsCard";
import RoundButton from "@/components/buttons/RoundButton";
import FullScreenLoading from "@/components/FullScreenLoading";
import StandardButton from "@/components/buttons/StandardButton";
import { RecipesContext } from "@/context/recipesContext";
import CustomSheetModal from "@/components/modals/CustomSheetModal";
import CircularProgress from "@/components/CircularProgress";
import SmallInfoTag from "@/components/recipe-details/SmallInfoTag";

const DetailsRecipe = () => {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const { deleteRecipe, updateRecipe, deleteImageFromFirebase, getRecipe } =
    recipeService;
  const [recipe, setRecipe] = useState<RecipeType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | undefined>("");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const recipesDetailsTabBarSheetModal = useRef<BottomSheetModal>(null);
  const { recipes } = useContext<any>(RecipesContext);
  // steps progress
  const [progress, setProgress] = useState<number>(0);
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      if (!id) return;
      setIsLoading(true);
      findRecipeInContext(id as string)
        .then((res) => {
          if (res) {
            setRecipe(res);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          getRecipe(id as string)
            .then((res) => {
              if (res) {
                setRecipe(res);
                setIsLoading(false);
              }
            })
            .catch((err) => {
              setIsLoading(false);
              Alert.alert("Failed to fetch recipe", err.message);
              router.back();
            });
        });
      return () => {
        // Close the modal when the screen loses focus
        recipesDetailsTabBarSheetModal.current?.close();
      };
    }, [id])
  );

  const findRecipeInContext = async (recipeId: string) => {
    const recipe = recipes.find((recipe: RecipeType) => recipe.id === recipeId);
    if (recipe) {
      const newRecipe = { ...recipe.data, id: recipe.id };
      return newRecipe;
    }
  };

  const handleEditRecipe = () => {
    if (!recipe) return;
    if (recipe.isGenerated) return;
    if (recipe.uuid !== user.userId) return;
    router.push({ pathname: `/recipe/edit/${id}` });
  };

  const handleDeleteRecipe = () => {
    if (!id) return;
    if (recipe?.uuid !== user.userId) return;

    deleteImageFromFirebase(recipe?.image as string).then((res) => {
      deleteRecipe(id as string).then((res) => {
        if (res.success) {
          router.back();
          ToastAndroid.show("Recipe deleted successfully", ToastAndroid.SHORT);
        } else {
          Alert.alert("Failed to delete recipe", res.message);
        }
      });
    });
  };

  useEffect(() => {
    if (generatedImage && recipe) {
      const updatedRecipe = { ...recipe, image: generatedImage };
      updateRecipe(id as string, updatedRecipe).then(
        (res) => {
          if (res.success) {
            setRecipe(res.recipeData);
            ToastAndroid.show("One PanPal Credit used", ToastAndroid.SHORT);
          } else {
            Alert.alert("Failed to update recipe", res.message);
          }
        },
        (err) => {
          Alert.alert("Failed to update recipe", err.message);
        }
      );
    }
  }, [generatedImage]);

  const CustomHeaderChildren = () => {
    return (
      <>
        <RoundButton handlePress={handleDeleteRecipe}>
          <Ionicons name="trash" size={hp(2.7)} color={Colors.white} />
        </RoundButton>
        {!recipe?.isGenerated && user?.userId === recipe?.uuid && (
          <RoundButton handlePress={handleEditRecipe}>
            <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
          </RoundButton>
        )}
      </>
    );
  };

  const handleSelectTabBarItem = (index: number) => {
    setSelectedTab(index);
    recipesDetailsTabBarSheetModal.current?.expand();
  };

  useEffect(() => {
    recipesDetailsTabBarSheetModal.current?.present();
  }, [recipe]);

  const checkAuthorization = async () => {
    if (!recipe) return false;
    if (recipe.uuid !== user.userId) return false;
    return true;
  };

  const handleNavigateToVoiceAssistant = async (recipeId: string) => {
    router.push({
      pathname: `/recipe/voice-assistant/${recipeId}`,
      params: { steps: recipe?.steps },
    });
  };

  const handleUpdateImage = async (image: string) => {
    if (!recipe) return;
    const updatedRecipe = { ...recipe, image };
    checkAuthorization().then(async (res) => {
      if (!res) {
        Alert.alert(
          "Unauthorized",
          "You are not authorized to edit this recipe"
        );
        return;
      }

      await updateRecipe(id as string, updatedRecipe).then(
        (res) => {
          if (res.success) {
            setRecipe(res.recipeData);
          } else {
            Alert.alert("Failed to update recipe", res.message);
          }
        },
        (err) => {
          Alert.alert("Failed to update recipe", err.message);
        }
      );
    });
  };

  const RecipeDetailsModalContentChildren = useMemo(() => {
    if (!recipe) return;
    switch (selectedTab) {
      case 0:
        return (
          <>
            {recipe.servings && recipe.ingredients && (
              <RecipeIngredientsDetails
                ingredients={recipe.ingredients}
                servings={recipe.servings}
              />
            )}
          </>
        );
      case 1:
        return (
          <RecipeStepsDetails
            setProgress={setProgress}
            selectedSteps={selectedSteps}
            setSelectedSteps={setSelectedSteps}
            steps={recipe.steps}
            times={[recipe.cookTime ?? 0, recipe.prepTime ?? 0]}
          />
        );
      default:
        return null;
    }
  }, [selectedTab, recipe, selectedSteps, progress, selectedSteps]);

  // const RecipeDetailsModalFooterChildren = useMemo(() => {
  //   if (!recipe) return;
  //   switch (selectedTab) {
  //     case 0:
  //       return (
  //         <StandardButton
  //           textValue="Add to Shopping List"
  //           clickHandler={() => console.log("Add to Shopping List")}
  //           colors={Colors.light.components.button.purple.background}
  //           textColor={Colors.white}
  //           height={ComponentParams.button.height.medium}
  //         />
  //       );
  //     case 1:
  //       return (
  //         <StandardButton
  //           iconRight={
  //             <Ionicons
  //               name="play"
  //               size={hp(2.7)}
  //               color={Colors.white}
  //               style={{ marginRight: wp(4) }}
  //             />
  //           }
  //           textValue="Start Cooking Assistance"
  //           clickHandler={() => {
  //             recipe.id && handleNavigateToVoiceAssistant(recipe.id);
  //           }}
  //           colors={Colors.light.components.button.purple.background}
  //           textColor={Colors.white}
  //           height={ComponentParams.button.height.medium}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // }, [selectedTab, recipe]);

  const RecipeDetailsModalHeaderChildren = useMemo(() => {
    if (!recipe) return;
    switch (selectedTab) {
      case 0:
        return (
          <RecipeDetailsTabBar
            displayContent={true}
            selectedTab={selectedTab}
            tabBarTitles={[
              `Ingredients (${recipe.ingredients.length})`,
              `Steps (${recipe.steps.length})`,
            ]}
            onPress={(index: number) => {
              handleSelectTabBarItem(index);
            }}
          />
        );
      case 1:
        return (
          <RecipeDetailsTabBar
            displayContent={true}
            selectedTab={selectedTab}
            tabBarTitles={[
              `Ingredients (${recipe.ingredients.length})`,
              `Steps (${recipe.steps.length})`,
            ]}
            onPress={(index: number) => {
              handleSelectTabBarItem(index);
            }}
            children={
              <View style={styles.topContent}>
                <View style={styles.timesContainer}>
                  <SmallInfoTag
                    text={`${recipe.cookTime} min`}
                    icon={
                      <View
                        style={{
                          flexDirection: "row",
                          gap: wp(1),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="timer"
                          size={hp(2)}
                          color={Colors.darkGrey}
                        />
                        <Text style={{ color: Colors.darkGrey }}>Cook:</Text>
                      </View>
                    }
                  />
                  <SmallInfoTag
                    text={`${recipe.prepTime} min`}
                    icon={
                      <View
                        style={{
                          flexDirection: "row",
                          gap: wp(1),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="timer"
                          size={hp(2)}
                          color={Colors.darkGrey}
                        />
                        <Text style={{ color: Colors.darkGrey }}>Prep:</Text>
                      </View>
                    }
                  />
                </View>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressTitle}>Progress</Text>
                  <View
                    style={{
                      justifyContent: "center",
                      position: "relative",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress
                      progress={progress}
                      size={hp(10)}
                      strokeWidth={hp(1)}
                      backgroundColor={Colors.secondaryWhite}
                      strokeColor={Colors.mediumPurple}
                    />
                    <Text style={styles.progressText}>
                      {selectedSteps.length} / {recipe.steps.length}
                    </Text>
                  </View>
                </View>
              </View>
            }
          />
        );
    }
  }, [selectedTab, recipe, progress]);

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
      <StatusBar style="light" />
      <CustomHeader
        isTransparent={true}
        hasGoBack={true}
        headerTitle={"Recipe Details"}
        children={CustomHeaderChildren()}
      />
      <CustomSheetModal
        hasBackdrop={false}
        enablePanDownToClose={false}
        headerChildren={RecipeDetailsModalHeaderChildren}
        snapPoints={[hp(12), hp(100)]}
        modalRef={recipesDetailsTabBarSheetModal}
        scrollViewChildren={RecipeDetailsModalContentChildren}
        // footerChildren={RecipeDetailsModalFooterChildren}
      />

      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <LinearGradient
          style={styles.bottomGradient}
          colors={["transparent", Colors.secondaryWhite, Colors.primarySkyBlue]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        />
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          recipe && (
            <CustomKeyBoardView>
              <View style={styles.content}>
                <View>
                  <RecipeImageContainer
                    allowedToEdit={recipe?.uuid === user.userId}
                    img={recipe?.image as string}
                    handleNewImage={(image) => {
                      handleUpdateImage(image);
                    }}
                    setRecipe={setRecipe}
                    recipe={recipe}
                  />
                  <RecipeHeaderContainer
                    headerData={{
                      title: recipe?.title,
                      description: recipe?.description,
                      prepTime: recipe?.prepTime,
                      cookTime: recipe?.cookTime,
                      mealType: recipe?.mealType,
                      cuisineType: recipe?.cuisineType,
                      dietType: recipe?.dietType,
                      isGenerated: recipe?.isGenerated,
                    }}
                  />
                </View>
                <RecipeTipsCard recipe={recipe} setRecipe={setRecipe} />
              </View>
            </CustomKeyBoardView>
          )
        )}
      </LinearGradient>
    </LinearGradient>
  );
};

export default DetailsRecipe;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  headerSecondContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timesValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerThirdContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: wp(2),
  },
  itemTag: {
    padding: hp(1),
    borderRadius: hp(1),
    backgroundColor: Colors.white,
    elevation: 1,
    shadowColor: Colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    paddingBottom: hp(20),
    gap: hp(4),
  },
  recipeHeaderContainer: {
    width: "100%",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    borderBottomLeftRadius: hp(ComponentParams.button.height.medium),
    borderBottomRightRadius: hp(ComponentParams.button.height.medium),
    overflow: "hidden",
    elevation: 3,
    backgroundColor: Colors.white,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTextContentContainer: {
    paddingHorizontal: wp(8),
    paddingTop: hp(2),
    paddingBottom: hp(6),
    gap: hp(2),
    justifyContent: "center",
  },
  headerTitle: {
    textAlign: "center",
    textTransform: "capitalize",
    fontFamily: Fonts.heading_3.fontFamily,
    fontSize: Fonts.heading_3.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.heading_3.lineHeight,
    flex: 1,
  },
  headerText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
    textAlign: "center",
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
  },
  headerTextContentFirst: {
    gap: hp(1),
    width: "100%",
    justifyContent: "center",
  },
  bottomGradient: {
    zIndex: 50,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: hp(15),
  },
  progressContainer: {
    gap: wp(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: Fonts.text_1.fontSize,
    fontFamily: Fonts.text_1.fontFamily,
    color: Colors.darkGrey,
    position: "absolute",
  },
  progressTitle: {
    fontSize: Fonts.text_1.fontSize,
    fontFamily: Fonts.text_1.fontFamily,
    color: Colors.darkGrey,
  },
  timesContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: hp(1),
  },

  topContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
