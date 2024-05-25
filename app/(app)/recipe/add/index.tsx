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

const AddCustomRecipeScreen = () => {
  const { user } = useContext<any>(AuthContext);
  const { setActiveTab, activeTab } = useActiveTab();
  // a useState for the recipe object to save to firebase later
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
  const [addIngredientInputValue, setAddIngredientInputValue] =
    React.useState<string>("");
  const [addStepInputValue, setAddStepInputValue] = React.useState<string>("");
  // State to track if an ingredient is pressed for a long time
  const [showDeleteIcon, setShowDeleteIcon] = React.useState<boolean>(false);
  const [showStepDeleteIcon, setShowStepDeleteIcon] =
    React.useState<boolean>(false);
  const descriptionMaxCharCounter = useMemo(() => {
    return 200 - recipe.description.length;
  }, [recipe.description]);
  // for ingredient images
  const baseUrl = "https://www.themealdb.com/";
  // bottom sheet modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const addImageModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [hp(50), hp(75), hp(100)], []);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
  const [sheetModalContent, setSheetModalContent] = useState<
    SheetModalContentType[]
  >([
    RecipeSelectOptions.servings,
    RecipeSelectOptions.prepTime,
    RecipeSelectOptions.cookTime,
    RecipeSelectOptions.mealType,
    RecipeSelectOptions.cuisineType,
  ]);

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
      console.log(error);
    } finally {
      setIsLoading(false);
      setActiveTab(1);
      router.navigate("/saved");
    }
  };

  useEffect(() => {
    bottomSheetModalRef.current?.close();
  }, [recipe.cookTime, recipe.servings, recipe.prepTime]);

  const headerChildren = () => {
    return (
      <RoundButton handlePress={handleRecipeCreate}>
        <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
      </RoundButton>
    );
  };

  // Function to handle long press on ingredient
  const handleIngredientLongPress = () => {
    console.log("Long press detected");
    setShowDeleteIcon(true);
  };

  const handleStepLongPress = () => {
    console.log("Long press detected");
    setShowStepDeleteIcon(true);
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentAddImageModelPress = useCallback(() => {
    addImageModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setRecipe({ ...recipe, image: result.assets[0].uri });
      addImageModalRef.current?.close();
    } else {
      alert("You did not select any image.");
    }
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
      <CustomHeader
        isTransparent={true}
        headerTitle={"Add Custom Recipe"}
        hasGoBack={true}
        children={headerChildren()}
      />
      <CustomBottomSheetModal
        snapPoints={snapPoints}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={handleSheetChanges}
      >
        <Text style={styles.inputLabel}>
          {sheetModalContent[selectedSheetIndex].title}
        </Text>
        <Text style={styles.contentCardParagraph}>
          {sheetModalContent[selectedSheetIndex].info}
        </Text>

        <Picker
          selectedValue={
            sheetModalContent[selectedSheetIndex].title === "Servings"
              ? recipe.servings
              : sheetModalContent[selectedSheetIndex].title === "Prep Time"
              ? recipe.prepTime
              : recipe.cookTime
          }
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => {
            if (sheetModalContent[selectedSheetIndex].title === "Servings") {
              setRecipe({ ...recipe, servings: itemValue });
            } else if (
              sheetModalContent[selectedSheetIndex].title === "Prep Time"
            ) {
              setRecipe({ ...recipe, prepTime: itemValue });
            } else {
              setRecipe({ ...recipe, cookTime: itemValue });
            }
          }}
        >
          {sheetModalContent[selectedSheetIndex].data.map((item, index) => (
            <Picker.Item
              key={index}
              label={`${item} ${
                sheetModalContent[selectedSheetIndex].title === "Servings"
                  ? "servings"
                  : "min"
              }`}
              value={item}
              style={styles.pickerItem}
            />
          ))}
        </Picker>
      </CustomBottomSheetModal>
      <CustomBottomSheetModal
        snapPoints={snapPoints}
        bottomSheetModalRef={addImageModalRef}
        handleSheetChanges={handleSheetChanges}
      >
        <View style={{ flex: 1, width: "100%" }}>
          <StandardButton
            icon={
              <Ionicons name="image" size={hp(2.7)} color={Colors.darkBlue} />
            }
            textColor={Colors.darkBlue}
            textValue="Photo library"
            height={ComponentParams.button.height.medium}
            colors={[
              Colors.light.components.button.white.background[1],
              Colors.light.components.button.white.background[0],
            ]}
            borderColor={Colors.light.components.button.white.background[1]}
            clickHandler={() => pickImageAsync()}
          />
        </View>
      </CustomBottomSheetModal>
      <CustomKeyBoardView>
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, Colors.white]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <StatusBar style="light" />

          {isLoading ? (
            <ActivityIndicator
              size={wp(15)}
              style={{ padding: wp(5) }}
              color={Colors.mediumBlue}
            />
          ) : (
            <View style={styles.content}>
              <View style={styles.contentCardContainer}>
                <Text style={styles.inputLabel}>Title</Text>
                <LinearGradient
                  style={styles.inputGradientContainer}
                  colors={["#DDEBF3", "#DDEBF3"]}
                  start={[0.5, 0]}
                  end={[0.5, 1]}
                >
                  <TextInput
                    editable={!isLoading}
                    onChangeText={(text) =>
                      setRecipe({ ...recipe, title: text })
                    }
                    value={recipe.title}
                    style={styles.input}
                    placeholderTextColor="#A0B7D6"
                    placeholder="Add recipe title..."
                  />
                </LinearGradient>
              </View>
              <View style={styles.contentCardContainer}>
                <View className="flex flex-row justify-between items-center w-full">
                  <Text style={styles.inputLabel}>Image</Text>
                  {recipe.image && (
                    <LinearGradient
                      colors={[
                        Colors.light.components.button.white.background[0],
                        Colors.light.components.button.white.background[1],
                      ]}
                      style={styles.deleteButton}
                      start={[0.5, 0]}
                      end={[0.5, 1]}
                    >
                      <TouchableOpacity
                        className="flex items-center justify-center w-full h-full"
                        onPress={() => {
                          setRecipe({
                            ...recipe,
                            image: "",
                          });
                        }}
                      >
                        <Ionicons
                          name="trash"
                          size={hp(2.7)}
                          color={"#FF6666"} // Change color as needed
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  )}
                </View>
                <LinearGradient
                  colors={[
                    Colors.light.components.button.white.background[1],
                    Colors.light.components.button.white.background[0],
                  ]}
                  style={styles.addImageCardGradient}
                >
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handlePresentAddImageModelPress}
                  >
                    {recipe.image ? (
                      <Image
                        source={{ uri: recipe.image }}
                        style={[styles.recipeImage]}
                      />
                    ) : (
                      <>
                        <Ionicons
                          name="image-outline"
                          size={hp(2.7)}
                          color={Colors.lightGrey}
                        />
                        <Text style={styles.addImageButtonText}>Add Image</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.contentCardContainer}>
                <View className="flex flex-row justify-between items-center w-full">
                  <Text style={styles.inputLabel}>description</Text>
                  <Text style={styles.spanText}>
                    {descriptionMaxCharCounter} (char.)
                  </Text>
                </View>

                <LinearGradient
                  style={styles.inputGradientContainer}
                  colors={["#DDEBF3", "#DDEBF3"]}
                  start={[0.5, 0]}
                  end={[0.5, 1]}
                >
                  <TextInput
                    maxLength={200}
                    multiline={true}
                    numberOfLines={4}
                    editable={!isLoading}
                    autoCorrect={true}
                    onChangeText={(text) =>
                      setRecipe({ ...recipe, description: text })
                    }
                    value={recipe.description}
                    style={styles.textArea}
                    placeholderTextColor="#A0B7D6"
                    placeholder="About this recipe..."
                  />
                </LinearGradient>
              </View>
              <View style={styles.contentCardContainer}>
                <Text style={styles.inputLabel}>Ingredients</Text>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    gap: wp(2),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <LinearGradient
                      style={styles.inputGradientContainer}
                      colors={["#DDEBF3", "#DDEBF3"]}
                      start={[0.5, 0]}
                      end={[0.5, 1]}
                    >
                      <TextInput
                        editable={!isLoading}
                        onChangeText={(text) =>
                          setAddIngredientInputValue(text)
                        }
                        onSubmitEditing={() => {
                          if (addIngredientInputValue === "") return;
                          setRecipe({
                            ...recipe,
                            ingredients: [
                              ...recipe.ingredients,
                              addIngredientInputValue.trim(),
                            ],
                          });
                          setAddIngredientInputValue("");
                        }}
                        value={addIngredientInputValue}
                        style={styles.input}
                        placeholderTextColor="#A0B7D6"
                        placeholder="Add ingredients..."
                      />
                    </LinearGradient>
                  </View>

                  <LinearGradient
                    style={styles.addButton}
                    colors={[
                      Colors.light.components.button.purple.background[0],
                      Colors.light.components.button.purple.background[1],
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (addIngredientInputValue === "") return;
                        setRecipe({
                          ...recipe,
                          ingredients: [
                            ...recipe.ingredients,
                            addIngredientInputValue.trim(),
                          ],
                        });
                        setAddIngredientInputValue("");
                      }}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="add"
                        size={hp(2.7)}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                {recipe.ingredients.length > 0 && (
                  <View className="flex justify-between items-center w-full flex-row">
                    <Text
                      style={{
                        fontFamily: Fonts.text_2.fontFamily,
                        fontSize: Fonts.text_2.fontSize,
                        color: Colors.light.text,
                        lineHeight: Fonts.text_2.lineHeight,
                      }}
                    >
                      {recipe.ingredients.length} ingredient(s)
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setRecipe({
                          ...recipe,
                          ingredients: [],
                        });
                      }}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          fontFamily: Fonts.text_2.fontFamily,
                          fontSize: Fonts.text_2.fontSize,
                          color: Colors.light.text,
                          lineHeight: Fonts.text_2.lineHeight,
                        }}
                      >
                        Clear all
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.ingredientList}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <LinearGradient
                      key={index}
                      colors={[Colors.white, Colors.white]}
                      style={styles.stepListItem}
                      start={[0.5, 0]}
                      end={[0.5, 1]}
                    >
                      <TouchableOpacity
                        style={styles.stepListItemInnerContainer}
                        onLongPress={handleIngredientLongPress} // Add long press handler
                      >
                        <View className="flex flex-row gap-x-1  items-center flex-1">
                          <View style={styles.stepImage}>
                            <Image
                              source={{
                                uri: `${baseUrl}/images/ingredients/${ingredient}.png`,
                              }}
                              placeholder={blurhash}
                              style={styles.stepImage}
                            />
                          </View>
                          <Text style={styles.stepListItemText}>
                            {ingredient}
                          </Text>
                        </View>
                        {showDeleteIcon && (
                          <LinearGradient
                            key={index}
                            colors={[
                              Colors.light.components.button.white
                                .background[0],
                              Colors.light.components.button.white
                                .background[1],
                            ]}
                            style={styles.deleteButton}
                            start={[0.5, 0]}
                            end={[0.5, 1]}
                          >
                            <TouchableOpacity
                              className="flex items-center justify-center w-full h-full"
                              onPress={() => {
                                const newIngredients = [...recipe.ingredients];
                                newIngredients.splice(index, 1);
                                setRecipe({
                                  ...recipe,
                                  ingredients: newIngredients,
                                });
                                setShowDeleteIcon(false);
                              }}
                            >
                              <Ionicons
                                name="trash"
                                size={hp(2.7)}
                                color={"#FF6666"} // Change color as needed
                              />
                            </TouchableOpacity>
                          </LinearGradient>
                        )}
                      </TouchableOpacity>
                    </LinearGradient>
                  ))}
                </View>
              </View>
              <View style={styles.contentCardContainer}>
                <Text style={styles.inputLabel}>Steps</Text>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    gap: wp(2),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <LinearGradient
                      style={styles.textAreaGradientContainer}
                      colors={["#DDEBF3", "#DDEBF3"]}
                      start={[0.5, 0]}
                      end={[0.5, 1]}
                    >
                      <TextInput
                        maxLength={255}
                        multiline={true}
                        numberOfLines={4}
                        editable={!isLoading}
                        autoCorrect={true}
                        onChangeText={(text) => setAddStepInputValue(text)}
                        onSubmitEditing={() => {
                          if (addStepInputValue === "") return;
                          setRecipe({
                            ...recipe,
                            steps: [...recipe.steps, addStepInputValue.trim()],
                          });
                          setAddIngredientInputValue("");
                        }}
                        value={addStepInputValue}
                        style={styles.textArea}
                        placeholderTextColor="#A0B7D6"
                        placeholder="Add instructions for the recipe..."
                      />
                    </LinearGradient>
                  </View>

                  <LinearGradient
                    style={styles.addButton}
                    colors={[
                      Colors.light.components.button.purple.background[0],
                      Colors.light.components.button.purple.background[1],
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (addStepInputValue === "") return;
                        setRecipe({
                          ...recipe,
                          steps: [...recipe.steps, addStepInputValue.trim()],
                        });
                        setAddStepInputValue("");
                      }}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="add"
                        size={hp(2.7)}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                {recipe.steps.length > 0 && (
                  <View className="flex justify-between items-center w-full flex-row">
                    <Text
                      style={{
                        fontFamily: Fonts.text_2.fontFamily,
                        fontSize: Fonts.text_2.fontSize,
                        color: Colors.light.text,
                        lineHeight: Fonts.text_2.lineHeight,
                      }}
                    >
                      {recipe.steps.length} step(s)
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setRecipe({
                          ...recipe,
                          steps: [],
                        });
                      }}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          fontFamily: Fonts.text_2.fontFamily,
                          fontSize: Fonts.text_2.fontSize,
                          color: Colors.light.text,
                          lineHeight: Fonts.text_2.lineHeight,
                        }}
                      >
                        Clear all
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.ingredientList}>
                  {recipe.steps.map((step, index) => (
                    <LinearGradient
                      key={index}
                      colors={[Colors.white, Colors.white]}
                      style={styles.stepListItem}
                      start={[0.5, 0]}
                      end={[0.5, 1]}
                    >
                      <TouchableOpacity
                        style={styles.stepListItemInnerContainer}
                        onLongPress={handleStepLongPress} // Add long press handler
                      >
                        <View className="flex flex-row gap-x-1 items-center flex-1">
                          <View style={styles.stepImage}>
                            <Text
                              style={{
                                fontFamily: Fonts.text_2.fontFamily,
                                fontSize: Fonts.text_2.fontSize,
                                color: Colors.light.text,
                                lineHeight: Fonts.text_2.lineHeight,
                              }}
                            >
                              {index + 1}
                            </Text>
                          </View>
                          <Text style={styles.stepListItemText}>{step}</Text>
                        </View>
                        {showStepDeleteIcon && (
                          <LinearGradient
                            key={index}
                            colors={[
                              Colors.light.components.button.white
                                .background[0],
                              Colors.light.components.button.white
                                .background[1],
                            ]}
                            style={styles.deleteButton}
                            start={[0.5, 0]}
                            end={[0.5, 1]}
                          >
                            <TouchableOpacity
                              className="flex items-center justify-center w-full h-full"
                              onPress={() => {
                                const newSteps = [...recipe.steps];
                                newSteps.splice(index, 1);
                                setRecipe({
                                  ...recipe,
                                  steps: newSteps,
                                });
                                setShowStepDeleteIcon(false);
                              }}
                            >
                              <Ionicons
                                name="trash"
                                size={hp(2.7)}
                                color={"#FF6666"} // Change color as needed
                              />
                            </TouchableOpacity>
                          </LinearGradient>
                        )}
                      </TouchableOpacity>
                    </LinearGradient>
                  ))}
                </View>
              </View>
              <View style={styles.contentCardContainer}>
                <View className="flex flex-row justify-between items-center w-full">
                  <Text style={styles.inputLabel}>Servings</Text>
                  <TouchableOpacity
                    className="flex flex-row items-center gap-x-1"
                    onPress={() => {
                      setSelectedSheetIndex(0);
                      handlePresentModalPress();
                    }}
                  >
                    <Text style={styles.servingCountText}>
                      {recipe.servings} servings
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={hp(2.7)}
                      color={Colors.darkBlue}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.contentCardParagraph}>
                  This is used to scale the recipe and calculate the ingredients
                  needed for the number of servings you want.
                </Text>
              </View>
              <View style={styles.contentCardContainer}>
                <View className="flex flex-row justify-between items-center w-full">
                  <Text style={styles.inputLabel}>prep time</Text>
                  <TouchableOpacity
                    className="flex flex-row items-center gap-x-1"
                    onPress={() => {
                      setSelectedSheetIndex(1);
                      handlePresentModalPress();
                    }}
                  >
                    <Text style={styles.servingCountText}>
                      {recipe.prepTime} min
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={hp(2.7)}
                      color={Colors.darkBlue}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.contentCardParagraph}>
                  How long does it take to prepare this recipe?
                </Text>
              </View>
              <View style={styles.contentCardContainer}>
                <View className="flex flex-row justify-between items-center w-full">
                  <Text style={styles.inputLabel}>cook time</Text>
                  <TouchableOpacity
                    className="flex flex-row items-center gap-x-1"
                    onPress={() => {
                      setSelectedSheetIndex(2);
                      handlePresentModalPress();
                    }}
                  >
                    <Text style={styles.servingCountText}>
                      {recipe.cookTime} min
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={hp(2.7)}
                      color={Colors.darkBlue}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.contentCardParagraph}>
                  How long does it take to cook this recipe?
                </Text>
              </View>

              <View style={[styles.contentCardContainer, { display: "none" }]}>
                <View className="flex flex-row justify-between items-center w-full">
                  <Text style={styles.inputLabel}>
                    {sheetModalContent[3].title}
                  </Text>
                  <TouchableOpacity
                    className="flex flex-row items-center gap-x-1"
                    onPress={() => {
                      setSelectedSheetIndex(3);
                      handlePresentModalPress();
                    }}
                  >
                    <Text style={styles.servingCountText}>
                      {recipe.mealType || "Select Meal Type"}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={hp(2.7)}
                      color={Colors.darkBlue}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.contentCardParagraph}>
                  {sheetModalContent[3].info}
                </Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default AddCustomRecipeScreen;

const styles = StyleSheet.create({
  recipeImage: {
    width: "100%",
    aspectRatio: 3 / 2,
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.small),
  },
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
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    gap: hp(4),
  },

  // input styles
  contentCardContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    gap: hp(1),
  },
  inputLabel: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_1.lineHeight,
  },
  inputGradientContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: hp(ComponentParams.button.height.medium),
    paddingHorizontal: wp(4),
    borderRadius: hp(ComponentParams.button.height.small),

    // borderColor: Colors.white, // "#DDEBF3"
    // borderWidth: 1,
  },
  input: {
    width: "100%",
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    fontSize: Fonts.text_2.fontSize,
    flex: 1,
    color: Colors.light.text,
  },
  // textarea input
  spanText: {
    marginRight: wp(2),
    color: Colors.light.text,
    lineHeight: Fonts.text_3.lineHeight,
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_3.fontSize,
  },
  textArea: {
    marginVertical: hp(1),
    textAlignVertical: "top",
    width: "100%",
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    fontSize: Fonts.text_2.fontSize,
    flex: 1,
    color: Colors.light.text,
  },
  textAreaGradientContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: hp(ComponentParams.button.height.medium),
    paddingHorizontal: wp(4),
    borderRadius: hp(ComponentParams.button.height.small),
  },
  ingredientList: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: hp(1),
  },
  addButton: {
    display: "flex",
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: hp(ComponentParams.button.height.medium - 1),
    height: hp(ComponentParams.button.height.medium - 1),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  stepListItemInnerContainer: {
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.small),
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(2),
    width: "100%",
  },
  stepListItem: {
    paddingHorizontal: wp(1),
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: hp(ComponentParams.button.height.small),
    borderWidth: 1,
    borderColor: "#DDEBF3",
    gap: hp(1),
    elevation: 1,
    shadowColor: Colors.darkBlue,
  },
  stepListItemText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_2.lineHeight,
    textAlign: "left",
    flexWrap: "wrap",
  },
  stepImage: {
    backgroundColor: Colors.secondaryWhite,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    width: hp(ComponentParams.button.height.medium - 1),
    height: hp(ComponentParams.button.height.medium - 1),
    borderRadius: hp(ComponentParams.button.height.small),
  },
  contentCardParagraph: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_2.lineHeight,
  },
  servingCountText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_2.lineHeight,
  },
  picker: {
    width: "100%", // Set width as needed
    height: hp(ComponentParams.button.height.medium), // Set height as needed
    color: Colors.darkBlue, // Text color
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    backgroundColor: "#DDEBF3", // Background color
  },
  pickerItem: {
    justifyContent: "center", // Center text
    textAlign: "center", // Center text
    width: "100%", // Set width as needed
    height: hp(ComponentParams.button.height.medium), // Set height as needed
    color: Colors.darkBlue, // Text color
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
  },
  generateImageButton: {
    gap: wp(2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.small),
    backgroundColor: Colors.darkBlue,
  },
  addImageButtonText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.lightGrey,
    lineHeight: Fonts.text_1.lineHeight,
  },
  generateImageButtonText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.white,
    lineHeight: Fonts.text_1.lineHeight,
  },
  addImageCardGradient: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 3 / 2,
    borderRadius: hp(ComponentParams.button.height.small),
    borderColor: Colors.light.components.button.white.border, // "#DDEBF3"
    borderWidth: 0,
    backgroundColor: Colors.light.components.button.white.background[0],
  },
  addImageButton: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(2),
    aspectRatio: 3 / 2,
    borderRadius: hp(ComponentParams.button.height.small),
    borderColor: Colors.light.components.button.white.border, // "#DDEBF3"
    borderWidth: 2,
  },
});
