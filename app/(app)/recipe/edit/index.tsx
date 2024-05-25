import { View, StyleSheet, Text, ActivityIndicator, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";

import { LinearGradient } from "expo-linear-gradient";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";

import CustomHeader from "@/components/navigation/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { RecipeType } from "@/models/RecipeType";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { AuthContext } from "@/context/authContext";
import { recipeService } from "@/services/db/recipe.services";
import { TextInput } from "react-native-gesture-handler";
import Fonts from "@/constants/Fonts";
import RoundButton from "@/components/buttons/RoundButton";
import EditRecipeStepList from "@/components/edits/EditRecipeStepList";
import EditRecipeIngredientList from "@/components/edits/EditRecipeIngredientList";
import EditRecipeDescription from "@/components/edits/EditRecipeDescription";
import EditRecipeTitle from "@/components/edits/EditRecipeTitle";
import EditRecipeCuisineType from "@/components/edits/EditRecipeCuisineType";
import EditRecipeCookTime from "@/components/edits/EditRecipeCookTime";
import EditRecipePrepTime from "@/components/edits/EditRecipePrepTime";
import EditRecipeMealType from "@/components/edits/EditRecipeMealType";
import RecipeImageContainer from "@/components/RecipeImageContainer";
import FullScreenLoading from "@/components/FullScreenLoading";
import EditRecipeServings from "@/components/edits/EditRecipeServings";

const EditCustomRecipeScreen = () => {
  const { user } = useContext<any>(AuthContext);
  const { recipeId } = useLocalSearchParams();
  const { getRecipe, updateRecipe, deleteImageFromFirebase } = recipeService;
  const [recipe, setRecipe] = useState<RecipeType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [maxCharAmount, setMaxCharAmount] = useState<number>(250);

  useEffect(() => {
    if (!recipeId) return;

    setIsLoading(true);
    getRecipe(recipeId as string)
      .then((res) => {
        setRecipe(res);
        if (res.uuid !== user.userId) router.back();
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.code === "not-found") router.back();
      });
  }, [recipeId]);

  const handleConfirmEditRecipe = () => {
    if (!recipe) return;
    setIsLoading(true);
    updateRecipe(recipeId as string, recipe as RecipeType)
      .then((res) => {
        if (res.success) {
          router.back();
        } else {
          Alert.alert("Failed to update recipe");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
    router.back();
  };

  const headerChildren = () => {
    return (
      <RoundButton handlePress={handleConfirmEditRecipe}>
        <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
      </RoundButton>
    );
  };

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
      await deleteImageFromFirebase(recipe.image as string)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
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
        headerTitle={"Edit Recipe"}
        children={headerChildren()}
      />
      <CustomKeyBoardView>
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, Colors.white]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          {isLoading ? (
            <FullScreenLoading />
          ) : (
            <>
              <RecipeImageContainer
                allowedToEdit={user.userId === recipe?.uuid}
                img={recipe?.image as string}
                handleNewImage={(image) => {
                  handleUpdateImage(image);
                }}
              />
              <View style={styles.content}>
                <View style={styles.contentItem}>
                  <EditRecipeTitle
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipeDescription
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                    maxCharAmount={maxCharAmount}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipeIngredientList
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipeStepList
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipeCuisineType
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipeMealType
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipeCookTime
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipePrepTime
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
                <View style={styles.contentItem}>
                  <EditRecipeServings
                    recipe={recipe as RecipeType}
                    setRecipe={setRecipe}
                  />
                </View>
              </View>
            </>
          )}
        </LinearGradient>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default EditCustomRecipeScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
    flex: 1,
    minHeight: hp(100),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    gap: hp(4),
  },
  contentItem: {
    gap: hp(1),
    borderRadius: hp(2),
  },
  contentItemTitle: {
    color: Colors.darkGrey,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
  },

  listItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: wp(2),
    borderColor: Colors.primarySkyBlue,
    borderWidth: 1,
    padding: wp(2),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },

  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  textUnderline: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textDecorationLine: "underline",
  },

  listItemText: {
    width: "100%",
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  listItemTextInput: {
    width: "100%",
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemInput: {
    flex: 1,
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
