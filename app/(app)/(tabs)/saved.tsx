import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { AuthContext } from "@/context/authContext";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { RecipeType } from "@/models/RecipeType";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import SearchBarHeader from "@/components/headers/SearchBarHeader";
import FilterOptionButton from "@/components/buttons/FilterOptionButton";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RecipesFilterSheetModal from "@/components/modals/RecipesFilterSheetModal";
import { testRecipes as testRecipesData } from "@/constants/testData/testRecipes";
import RecipeCard from "@/components/cards/RecipeCard";

export type SavedRecipeType = {
  id: string;
  data: RecipeType;
};

const Saved = () => {
  const { user } = useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialRecipes, setInitialRecipes] = useState<SavedRecipeType[]>([]);
  const [testRecipes, setTestRecipes] =
    useState<SavedRecipeType[]>(testRecipesData);
  const [filterOptions, setFilterOptions] = useState<string[]>([
    "Meal types",
    "Cuisines",
  ]);
  const [selectedCuisineTypes, setSelectedCuisineTypes] = useState<string[]>(
    []
  );
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const recipesFilterSheetModal = useRef<BottomSheetModal>(null);
  const filteredRecipes = useMemo(() => {
    const joinesRecipesLists = [...initialRecipes];
    return joinesRecipesLists.filter((recipe) => {
      const cuisineType = recipe.data.cuisineType?.toLowerCase() ?? "";
      const mealType = recipe.data.mealType?.toLowerCase() ?? "";

      // transform all selected to lowercase

      // Transform all selected options to lowercase

      const selectedMealTypesLowerCase = selectedMealTypes.map((option) =>
        option.toLowerCase()
      );

      const selectedCuisineTypesLowerCase = selectedCuisineTypes.map((option) =>
        option.toLowerCase()
      );

      const isCuisineMatch =
        selectedCuisineTypesLowerCase.length === 0 ||
        selectedCuisineTypesLowerCase.includes(cuisineType);

      const isMealMatch =
        selectedMealTypesLowerCase.length === 0 ||
        selectedMealTypesLowerCase.includes(mealType);

      const isTitleMatch =
        recipe.data && recipe.data.title
          ? recipe.data.title
              .toLowerCase()
              .includes(searchInputValue.toLowerCase())
          : false;

      return isCuisineMatch && isMealMatch && isTitleMatch;
    });
  }, [
    initialRecipes,
    searchInputValue,
    selectedCuisineTypes,
    selectedMealTypes,
  ]);

  const handleOpenRecipesFilterModal = useCallback(() => {
    recipesFilterSheetModal.current?.present();
  }, []);

  // useEffect(() => {
  //   const recipesRef = collection(db, "recipes");
  //   setIsLoading(true);
  //   const subscriber = onSnapshot(recipesRef, {
  //     next: (querySnapshot) => {
  //       const recipes: SavedRecipeType[] = [];
  //       querySnapshot.forEach((doc) => {
  //         recipes.push({ id: doc.id, data: doc.data() as RecipeType });
  //       });
  //       setInitialRecipes(recipes);
  //       setIsLoading(false);
  //     },
  //   });
  //   return () => subscriber();
  // }, []);
  useEffect(() => {
    const recipesRef = collection(db, "recipes");
    setIsLoading(true);
    const subscriber = onSnapshot(recipesRef, {
      next: (querySnapshot) => {
        const recipes: SavedRecipeType[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as RecipeType;
          // Filter recipes where uuid is equal to user.userId
          if (data.uuid === user.userId) {
            recipes.push({ id: doc.id, data });
          }
        });
        setInitialRecipes(recipes);
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error fetching recipes:", error);
        setIsLoading(false);
      },
    });
    return () => subscriber();
  }, [user.userId]);

  // useEffect(() => {
  //   console.log("filteredRecipes", filteredRecipes);
  // }, [filteredRecipes]);

  const returnSelectedOptions = (option: string) => {
    if (option === "Cuisines") {
      return selectedCuisineTypes;
    } else if (option === "Meal types") {
      return selectedMealTypes;
    }
    return [];
  };
  const searchBarHeaderChildren = () => {
    return (
      <>
        {filterOptions.map((option, index) => (
          <FilterOptionButton
            selectedOptions={returnSelectedOptions(option)}
            key={index}
            index={index}
            option={option}
            clickHandler={handleOpenRecipesFilterModal}
          />
        ))}
      </>
    );
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
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
      <SearchBarHeader
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        children={searchBarHeaderChildren()}
      />
      <RecipesFilterSheetModal
        snapPoints={[hp(100)]}
        bottomSheetModalRef={recipesFilterSheetModal}
        handleSheetChanges={handleSheetChanges}
        selectedCuisineTypes={selectedCuisineTypes}
        setSelectedCuisineTypes={setSelectedCuisineTypes}
        selectedMealTypes={selectedMealTypes}
        setSelectedMealTypes={setSelectedMealTypes}
      />

      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <CustomKeyBoardView>
          <StatusBar style="light" />
          {isLoading ? (
            <ActivityIndicator
              size={wp(15)}
              style={{ padding: wp(5) }}
              color={Colors.mediumBlue}
            />
          ) : (
            <View style={styles.content}>
              <>
                {filteredRecipes.length === 0 ? (
                  <Text style={styles.noContentText}>No recipes found</Text>
                ) : (
                  filteredRecipes?.map((recipe: SavedRecipeType) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))
                )}
              </>
            </View>
          )}
        </CustomKeyBoardView>
      </LinearGradient>
    </LinearGradient>
  );
};

export default Saved;

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
  noContentText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.lightGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlign: "center",
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    padding: wp(4),
    gap: hp(2),
    paddingBottom: hp(14),
  },
  headerRightButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    justifyContent: "center",
    alignItems: "center",
  },
  profileTopContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: hp(1.5),
  },
  profileImage: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },

  inputGradientContainer: {
    gap: wp(2),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: hp(ComponentParams.button.height.large),
    paddingHorizontal: wp(4),
    borderRadius: hp(ComponentParams.button.height.large),

    // borderColor: Colors.white, // "#DDEBF3"
    // borderWidth: 1,
  },
  input: {
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    fontSize: Fonts.text_2.fontSize,
    flex: 1,
    color: Colors.light.text,
  },
});
