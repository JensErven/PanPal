import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Touchable,
  TouchableOpacity,
} from "react-native";
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
import SearchBarHeader from "@/components/headers/SearchBarHeader";
import FilterOptionButton from "@/components/buttons/FilterOptionButton";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RecipeCard from "@/components/cards/RecipeCard";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "@/components/navigation/CustomHeader";
import { router } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import RoundButton from "@/components/buttons/RoundButton";
import { useRecipes } from "@/context/recipesContext";
import FullScreenLoading from "@/components/FullScreenLoading";
import { SavedRecipeType } from "@/models/SavedRecipeType";
import CustomSheetModal from "@/components/modals/CustomSheetModal";
import FilterHeader from "@/components/modals/filter/FilterHeader";
import FilterFooter from "@/components/modals/filter/FilterFooter";
import FilterOptionsSelectCard from "@/components/cards/FilterOptionsSelectCard";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { mealTypes } from "@/constants/tastePreferences/MealTypes";

const Saved = () => {
  const { recipes, isLoading } = useRecipes();
  const { user } = useContext<any>(AuthContext);
  const [initialRecipes, setInitialRecipes] =
    useState<SavedRecipeType[]>(recipes);

  const [selectedCuisineTypes, setSelectedCuisineTypes] = useState<string[]>(
    []
  );

  const [toShowRecipesType, setToShowRecipesType] = useState<string>("All");

  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const recipesFilterSheetModal = useRef<BottomSheetModal>(null);

  const filteredRecipes = useMemo(() => {
    const joinesRecipesLists = [...initialRecipes];
    return joinesRecipesLists.filter((recipe) => {
      const cuisineType = recipe.data.cuisineType?.toLowerCase() ?? "";
      const mealType = recipe.data.mealType?.toLowerCase() ?? "";

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

      const toShowRecipesMatch = () => {
        if (toShowRecipesType === "Generated") {
          return recipe.data.isGenerated;
        } else if (toShowRecipesType === "Custom") {
          return !recipe.data.isGenerated;
        }
        return true;
      };

      const isTitleMatch =
        recipe.data && recipe.data.title
          ? recipe.data.title
              .toLowerCase()
              .includes(searchInputValue.toLowerCase())
          : false;

      return (
        isCuisineMatch && isMealMatch && isTitleMatch && toShowRecipesMatch()
      );
    });
  }, [
    initialRecipes,
    searchInputValue,
    selectedCuisineTypes,
    selectedMealTypes,
    toShowRecipesType,
  ]);

  const filterOptions = useMemo(() => {
    if (
      toShowRecipesType === "All" &&
      selectedCuisineTypes.length === 0 &&
      selectedMealTypes.length === 0
    )
      return [];

    const options = [];
    if (selectedCuisineTypes.length > 0) options.push("Cuisines");
    if (selectedMealTypes.length > 0) options.push("Meal types");
    if (toShowRecipesType !== "All" && toShowRecipesType === "Generated")
      options.push("Generated");
    if (toShowRecipesType !== "All" && toShowRecipesType === "Custom")
      options.push("Custom");

    return options;
  }, [
    toShowRecipesType,
    selectedCuisineTypes.length,
    selectedMealTypes.length,
  ]);

  const handleOpenRecipesFilterModal = useCallback(() => {
    recipesFilterSheetModal.current?.present();
  }, []);

  const returnSelectedOptions = (option: string) => {
    if (option === "Cuisines") {
      return selectedCuisineTypes;
    } else if (option === "Meal types") {
      return selectedMealTypes;
    }
    return [];
  };

  useEffect(() => {
    setInitialRecipes(recipes);
  }, [recipes]);

  const searchBarHeaderChildren = () => {
    return (
      <>
        {filterOptions.length > 0 && (
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
        )}
      </>
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

  const handleFilterReset = () => {
    setSelectedCuisineTypes([]);
    setSelectedMealTypes([]);
    setToShowRecipesType("All");
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
        hasGoBack={false}
        headerTitle={"Saved Recipes"}
        children={customHeaderChildren()}
      />
      <SearchBarHeader
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        showFilterModal={handleOpenRecipesFilterModal}
        children={searchBarHeaderChildren()}
      />
      <CustomSheetModal
        modalRef={recipesFilterSheetModal}
        snapPoints={[hp(100)]}
        headerChildren={<FilterHeader reset={() => handleFilterReset()} />}
        footerChildren={
          <FilterFooter
            closeModal={() => recipesFilterSheetModal.current?.dismiss()}
          />
        }
        scrollViewChildren={
          <>
            <FilterOptionsSelectCard
              clearAll={() => setToShowRecipesType("All")}
              showCount={false}
              options={["Generated", "Custom"]}
              title="To Show Recipes"
              selectedOptions={[toShowRecipesType]}
              selectOption={(option) => {
                const updatedToShowRecipesType = option;
                if (updatedToShowRecipesType === toShowRecipesType) {
                  setToShowRecipesType("All");
                } else {
                  setToShowRecipesType(updatedToShowRecipesType);
                }
              }}
            />
            <FilterOptionsSelectCard
              clearAll={() => setSelectedMealTypes([])}
              options={mealTypes}
              title="Meal Types"
              selectedOptions={selectedMealTypes}
              selectOption={(option) => {
                const updatedSelectedMealTypes = [...selectedMealTypes];
                if (updatedSelectedMealTypes.includes(option)) {
                  const index = updatedSelectedMealTypes.indexOf(option);
                  updatedSelectedMealTypes.splice(index, 1);
                } else {
                  updatedSelectedMealTypes.push(option);
                }
                setSelectedMealTypes(updatedSelectedMealTypes);
              }}
            />
            <FilterOptionsSelectCard
              clearAll={() => setSelectedCuisineTypes([])}
              searchEnabled={true}
              options={cuisineTypes.map((cuisine) => cuisine)}
              title="Cuisine Types"
              selectedOptions={selectedCuisineTypes}
              selectOption={(option) => {
                const updatedSelectedCuisineTypes = [...selectedCuisineTypes];
                if (updatedSelectedCuisineTypes.includes(option)) {
                  const index = updatedSelectedCuisineTypes.indexOf(option);
                  updatedSelectedCuisineTypes.splice(index, 1);
                } else {
                  updatedSelectedCuisineTypes.push(option);
                }
                setSelectedCuisineTypes(updatedSelectedCuisineTypes);
              }}
            />
          </>
        }
      />

      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <CustomKeyBoardView>
            <View style={styles.content}>
              <>
                {filteredRecipes.length === 0 ? (
                  <Text style={styles.noContentText}>No recipes found</Text>
                ) : (
                  <>
                    <Text style={styles.noContentText}>
                      {filteredRecipes.length} results
                    </Text>
                    {filteredRecipes?.map((recipe: SavedRecipeType) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        allowedToDelete={user.userId === recipe.data.uuid}
                        allowedToEdit={user.userId === recipe.data.uuid}
                      />
                    ))}
                  </>
                )}
              </>
            </View>
          </CustomKeyBoardView>
        )}
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
    color: Colors.darkGrey,
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
