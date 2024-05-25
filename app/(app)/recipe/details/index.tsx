import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
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
import { AuthContext } from "@/context/authContext";
import RecipeImageContainer from "@/components/RecipeImageContainer";
import RecipeHeaderContainer from "@/components/RecipeHeaderContainer";
import RecipeRatingDetailsCard from "@/components/recipe-details/RecipeRatingDetailsCard";
import RecipeReviewsListCard from "@/components/recipe-details/RecipeReviewsListCard";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import RecipeDetailsTabBarSheetModal from "@/components/modals/RecipeDetailsTabBarSheetModal";
import CustomizeRecipeOptionsCard from "@/components/recipe-details/CustomizeRecipeOptionsCard";
import RoundButton from "@/components/buttons/RoundButton";
import FullScreenLoading from "@/components/FullScreenLoading";
import { Line } from "react-native-svg";
import StandardButton from "@/components/buttons/StandardButton";

const DetailsRecipe = () => {
  const { user } = useContext<any>(AuthContext);
  const { recipeId } = useLocalSearchParams();
  const { deleteRecipe, updateRecipe, deleteImageFromFirebase, getRecipe } =
    recipeService;
  const { generateRecipeImage } = openaiServices;
  const [recipe, setRecipe] = useState<RecipeType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | undefined>("");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const recipesDetailsTabBarSheetModal = useRef<BottomSheetModal>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!recipeId) return;
      setIsLoading(true);
      getRecipe(recipeId as string)
        .then((res) => {
          setRecipe(res);
          console.log(res);
          setTimeout(() => {
            setIsLoading(false);
          }, 200);
        })
        .catch((err) => {
          if (err.code === "not-found") router.back();
        });
    }, [recipeId])
  );

  const handleEditRecipe = () => {
    if (!recipe) return;
    if (recipe.isGenerated) return;
    if (recipe.uuid !== user.userId) return;
    router.push({ pathname: `/recipe/edit/`, params: { recipeId } });
  };

  const handleDeleteRecipe = () => {
    if (!recipeId) return;
    if (recipe?.uuid !== user.userId) return;
    deleteImageFromFirebase(recipe?.image as string).then((res) => {
      console.log(res);
      deleteRecipe(recipeId as string).then((res) => {
        console.log(res);
        if (res.success) {
          router.back();
          ToastAndroid.show("Recipe deleted successfully", ToastAndroid.SHORT);
        } else {
          console.log("Failed to delete recipe");
        }
      });
    });
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    if (!recipe) {
      console.error("Recipe not found");
      setIsGeneratingImage(false);
      return;
    }
    generateRecipeImage(recipe as RecipeType).then(
      (res) => {
        console.log(res);
        setIsGeneratingImage(false);
        setGeneratedImage(res);
      },
      (err) => {
        console.error(err);
        setIsGeneratingImage(false);
      }
    );
  };

  useEffect(() => {
    if (generatedImage && recipe) {
      const updatedRecipe = { ...recipe, image: generatedImage };
      updateRecipe(recipeId as string, updatedRecipe).then(
        (res) => {
          console.log(res);
          if (res.success) {
            setRecipe(res.recipeData);
            ToastAndroid.show("One PanPal Credit used", ToastAndroid.SHORT);
            console.log("Recipe updated successfully");
          } else {
            console.log("Failed to update recipe");
          }
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }, [generatedImage]);

  const headerChildren = () => {
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

      await updateRecipe(recipeId as string, updatedRecipe).then(
        (res) => {
          console.log(res);
          if (res.success) {
            setRecipe(res.recipeData);
          } else {
            console.log("Failed to update recipe");
          }
        },
        (err) => {
          console.error(err);
        }
      );
    });
  };

  const detailsTabBarChildren = useMemo(() => {
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
            steps={recipe.steps}
            times={[recipe.cookTime ?? 0, recipe.prepTime ?? 0]}
          />
        );
      default:
        return null;
    }
  }, [selectedTab, recipe]);

  const detailsTabBarFooterChildren = useMemo(() => {
    if (!recipe) return;
    switch (selectedTab) {
      case 0:
        return (
          <View style={styles.footerContainer}>
            <LinearGradient
              colors={["transparent", Colors.white]}
              style={styles.footerGradient}
            />
            {/* <StandardButton
              textValue="Add to Shopping List"
              clickHandler={() => console.log("Add to Shopping List")}
              colors={Colors.light.components.button.purple.background}
              textColor={Colors.white}
              height={ComponentParams.button.height.medium}
            /> */}
          </View>
        );
      case 1:
        return (
          <View style={styles.footerContainer}>
            <LinearGradient
              colors={["transparent", Colors.white]}
              style={styles.footerGradient}
            />
            {/* <StandardButton
            iconRight={
              <Ionicons
                name="play"
                size={hp(2.7)}
                color={Colors.white}
                style={{ marginRight: wp(4) }}
              />
            }
            textValue="Start Cooking Assistance"
            clickHandler={() => console.log("Start Cooking")}
            colors={Colors.light.components.button.purple.background}
            textColor={Colors.white}
            height={ComponentParams.button.height.medium}
          /> */}
          </View>
        );
      default:
        return null;
    }
  }, [selectedTab, recipe]);

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
        children={headerChildren()}
      />
      <RecipeDetailsTabBarSheetModal
        snapPoints={[hp(12), hp(100)]}
        bottomSheetModalRef={recipesDetailsTabBarSheetModal}
        children={
          <>
            <RecipeDetailsTabBar
              displayContent={true}
              selectedTab={selectedTab}
              children={detailsTabBarChildren}
              tabBarTitles={[
                `Ingredients (${recipe?.ingredients.length})`,
                `Steps (${recipe?.steps.length})`,
              ]}
              onPress={(index: number) => {
                handleSelectTabBarItem(index);
              }}
            />
          </>
        }
        footerChildren={detailsTabBarFooterChildren}
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
                  />
                  <RecipeHeaderContainer
                    headerData={{
                      title: recipe?.title,
                      description: recipe?.description,
                      prepTime: recipe?.prepTime,
                      cookTime: recipe?.cookTime,
                      mealType: recipe?.mealType,
                      cuisineType: recipe?.cuisineType,
                      isGenerated: recipe?.isGenerated,
                    }}
                  />
                </View>

                {/* <CustomizeRecipeOptionsCard /> */}

                {/* <RecipeRatingDetailsCard
              data={{
                thumbsUp: 25,
                thumbsDown: 5,
                fastReviewTags: [
                  { tag: "Easy", count: 5 },
                  { tag: "Tasty", count: 3 },
                  { tag: "Healthy", count: 2 },
                ],
              }}
            />
            <RecipeReviewsListCard /> */}
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
  footerContainer: {
    padding: wp(4),
    width: "100%",
    backgroundColor: Colors.white,
  },
  footerGradient: {
    width: "120%",
    height: hp(2),
    position: "absolute",
    top: 0,
    left: 0,
    transform: [{ translateY: -hp(2) }],
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
    height: hp(17),
  },
});
