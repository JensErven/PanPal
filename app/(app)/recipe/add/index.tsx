import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { AuthContext } from "@/context/authContext";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import CustomHeader from "@/components/navigation/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { RecipeType } from "@/models/RecipeType";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import StandardButton from "@/components/buttons/StandardButton";
import { Picker } from "@react-native-picker/picker";
import { recipeService } from "@/services/db/recipe.services";
import { router } from "expo-router";
import CustomBottomSheetModal from "@/components/modals/CustomBottomSheetModal";
import { SheetModalContentType } from "@/models/SheetModalContentType";
import RecipeSelectOptions from "@/constants/RecipeSelectOptions";
import * as ImagePicker from "expo-image-picker";
import { useActiveTab } from "@/context/activeTabContext";
import RoundButton from "@/components/buttons/RoundButton";
import FullScreenLoading from "@/components/FullScreenLoading";
import RecipeImageContainer from "@/components/RecipeImageContainer";
import EditRecipeTitle from "@/components/edits/EditRecipeTitle";
import EditRecipeDescription from "@/components/edits/EditRecipeDescription";
import EditRecipeIngredientList from "@/components/edits/EditRecipeIngredientList";
import EditRecipeStepList from "@/components/edits/EditRecipeStepList";
import EditRecipeCuisineType from "@/components/edits/EditRecipeCuisineType";
import EditRecipeCookTime from "@/components/edits/EditRecipeCookTime";
import EditRecipeMealType from "@/components/edits/EditRecipeMealType";
import EditRecipePrepTime from "@/components/edits/EditRecipePrepTime";
import EditRecipeServings from "@/components/edits/EditRecipeServings";

const AddCustomRecipeScreen = () => {
  const { user } = useContext<any>(AuthContext);
  const { setActiveTab, activeTab } = useActiveTab();
  const [maxCharAmount, setMaxCharAmount] = useState<number>(250);

  const [recipe, setRecipe] = React.useState<RecipeType>({
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    image: "",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficulty: 0,
    isGenerated: false,
    uuid: user.userId,
    mealType: "",
    cuisineType: "",
    createdAt: new Date().toISOString(),
  });

  // useStates and useMemos
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleRecipeCreate = async () => {
    setIsLoading(true);
    const validateRecipe = () => {
      if (recipe.title === "") {
        Alert.alert("Title is required");
        return false;
      }
      if (recipe.description === "") {
        Alert.alert("Description is required");
        return false;
      }
      if (recipe.ingredients.length === 0) {
        Alert.alert("Ingredients are required");
        return false;
      }
      if (recipe.steps.length === 0) {
        Alert.alert("Steps are required");
        return false;
      }
      return true;
    };
    if (!validateRecipe()) {
      setIsLoading(false);
      return;
    }
    try {
      // everything to lowercase
      recipe.title = recipe.title.toLowerCase();
      recipe.description = recipe.description.toLowerCase();
      recipe.ingredients = recipe.ingredients.map((item) => item.toLowerCase());
      recipe.steps = recipe.steps.map((item) => item.toLowerCase());
      await recipeService.createRecipe(recipe);
    } catch (error) {
      Alert.alert("Failed to create recipe");
    } finally {
      setIsLoading(false);
      setActiveTab(1);
      router.navigate("/saved");
    }
  };

  const headerChildren = () => {
    return (
      <RoundButton handlePress={handleRecipeCreate}>
        <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
      </RoundButton>
    );
  };

  const handleUpdateImage = async (image: string) => {
    setRecipe({ ...recipe, image });
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

export default AddCustomRecipeScreen;

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
