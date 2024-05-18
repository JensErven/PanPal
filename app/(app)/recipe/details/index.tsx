import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
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
import { Image } from "expo-image";
import { blurhash } from "@/utils/common";
import Fonts from "@/constants/Fonts";
import StandardButton from "@/components/buttons/StandardButton";
import { openaiServices } from "@/services/api/openai.services";

const DetailsRecipe = () => {
  const { recipeId } = useLocalSearchParams();
  const { deleteRecipe, updateRecipe, deleteImageFromFirebase } = recipeService;
  const { generateRecipeImage } = openaiServices;
  const [recipe, setRecipe] = useState<RecipeType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | undefined>("");

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

  const handleEditRecipe = () => {
    console.log("Edit recipe");
  };

  const handleDeleteRecipe = () => {
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
            setRecipe(updatedRecipe);
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
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={handleDeleteRecipe}
        >
          <Ionicons name="trash" size={hp(2.7)} color={Colors.white} />
        </TouchableOpacity>
        {!recipe?.isGenerated && (
          <TouchableOpacity
            style={styles.headerRightButton}
            onPress={handleEditRecipe}
          >
            <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
          </TouchableOpacity>
        )}
      </>
    );
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
        headerTitle={"Recipe Details"}
        hasGoBack={true}
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
            <ActivityIndicator
              size={wp(15)}
              style={{ padding: wp(5) }}
              color={Colors.mediumBlue}
            />
          ) : (
            <View style={styles.content}>
              <View style={styles.recipeHeaderContainer}>
                {recipe?.image ? (
                  <Image
                    style={styles.recipeImage}
                    source={recipe.image ? recipe.image : blurhash}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={500}
                  />
                ) : (
                  <View style={[styles.recipeImage, { gap: hp(2) }]}>
                    <Ionicons name="image" size={hp(5)} color={Colors.white} />
                    <View style={{ width: "auto" }}>
                      <StandardButton
                        isDisabled={isGeneratingImage}
                        colors={Colors.light.components.button.white.background}
                        icon={
                          <Ionicons
                            name="sparkles"
                            size={hp(2)}
                            color={Colors.mediumPurple}
                          />
                        }
                        textColor={Colors.darkGrey}
                        borderColor={Colors.secondaryWhite}
                        textValue={
                          isGeneratingImage ? "Generating..." : "Generate Image"
                        }
                        clickHandler={handleGenerateImage}
                        height={ComponentParams.button.height.medium}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.headerTextContentContainer}>
                  <View style={styles.headerTextContentFirst}>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        gap: wp(2),
                      }}
                    >
                      {recipe?.isGenerated && (
                        <Ionicons
                          style={{ paddingTop: hp(1) }}
                          name="sparkles"
                          size={hp(2)}
                          color={Colors.mediumPurple}
                        />
                      )}
                      <Text style={styles.headerTitle}>{recipe?.title}</Text>
                    </View>

                    <Text style={styles.text}>{recipe?.description}</Text>
                  </View>
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
    gap: hp(4),
  },
  headerRightButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    justifyContent: "center",
    alignItems: "center",
  },
  recipeImage: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: Colors.secondaryWhite,
    justifyContent: "center",
    alignItems: "center",
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
  },
  headerTitle: {
    textTransform: "capitalize",
    fontFamily: Fonts.heading_3.fontFamily,
    fontSize: Fonts.heading_3.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.heading_3.lineHeight,
    flex: 1,
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
});
