import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useEffect } from "react";
import { RecipeType } from "@/models/RecipeType";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RoundButton from "@/components/buttons/RoundButton";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import { getIngredientImage } from "@/utils/file.utils";
import ingredientPlaceholder from "@/assets/images/ingredient_placeholder.png";
import { measurements } from "@/constants/Measurements";
import { LinearGradient } from "expo-linear-gradient";

const EditRecipeIngredientList = ({
  recipe,
  setRecipe,
}: {
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
}) => {
  const [editIngredient, setEditIngredient] = React.useState<number | null>(
    null
  );
  const [ingredientTextInput, setIngredientTextInput] =
    React.useState<string>("");
  const [ingredientImages, setIngredientImages] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await Promise.all(
        recipe?.ingredients.map(async (ingredient: string) => {
          try {
            const imageUrlString = getIngredientImage(ingredient);
            return imageUrlString;
          } catch (error) {
            return "";
          }
        })
      );
      setIngredientImages(images);
    };
    fetchImages();
  }, [recipe?.ingredients]);

  const handleAddIngredient = () => {
    if (recipe) {
      if (ingredientTextInput === "") return;
      const newIngredients = [...recipe.ingredients, ingredientTextInput];
      setEditIngredient(null);
      setRecipe({ ...recipe, ingredients: newIngredients });
      ToastAndroid.show("Ingredient added", ToastAndroid.SHORT);
      setIngredientTextInput("");
    }
  };

  /**
   * Formats an ingredient with bold text for measurements and normal font weight for the rest.
   * @param {string} value - The ingredient value.
   * @param {string[]} measurements - An array of measurement words.
   * @returns {JSX.Element} - The formatted ingredient as JSX.
   */
  const formatIngredient = (value: string, measurements: string[]) => {
    const parts = value.split(" ");

    // Check if each part is a measurement word
    const formattedParts = parts.map((part, index) => {
      const isMeasurement = measurements.includes(part.toLowerCase());
      return isMeasurement ? (
        <Text key={index} style={{ fontFamily: Fonts.text_1.fontFamily }}>
          {part}
        </Text>
      ) : (
        part
      );
    });

    return (
      <Text>
        {formattedParts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 ? " " : ""}
            {part}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  return (
    <>
      <Text style={styles.contentItemTitle}>Ingredients</Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: wp(2),
        }}
      >
        <TextInput
          style={styles.contentItemInput}
          value={ingredientTextInput}
          placeholder="add ingredient"
          placeholderTextColor={
            Colors.light.components.inputField.placeholderTextColor
          }
          onChangeText={(text: string) => {
            setIngredientTextInput(text);
          }}
          onSubmitEditing={handleAddIngredient}
        />
        <RoundButton
          handlePress={handleAddIngredient}
          transparent={false}
          backgroundColor={Colors.mediumBlue}
        >
          <Ionicons name="add" size={hp(2.7)} color={Colors.white} />
        </RoundButton>
      </View>
      {recipe && recipe?.ingredients.length > 0 && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: hp(1),
          }}
        >
          <Text style={styles.text}>Amount: {recipe?.ingredients.length}</Text>
          <TouchableOpacity
            onPress={() => {
              if (!recipe) return;
              setRecipe({ ...recipe, ingredients: [] });
            }}
          >
            <Text style={styles.textUnderline}>clear all</Text>
          </TouchableOpacity>
        </View>
      )}
      {recipe?.ingredients && (
        <View style={styles.stepItemList}>
          {recipe?.ingredients.map((ingredient: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: hp(1),
                  justifyContent: "space-between",
                }}
              >
                <LinearGradient
                  style={styles.stepNumber}
                  colors={[Colors.white, Colors.primarySkyBlue]}
                >
                  {ingredientImages[index] ? (
                    <Image
                      style={styles.ingredientImage}
                      source={ingredientImages[index]}
                      placeholder={blurhash}
                      contentFit="cover"
                      transition={500}
                    />
                  ) : (
                    <Ionicons
                      name="image"
                      size={hp(2.7)}
                      color={Colors.primarySkyBlue}
                    />
                  )}
                </LinearGradient>

                {editIngredient === index ? (
                  <TextInput
                    autoFocus={true}
                    style={styles.listItemTextInput}
                    editable={editIngredient === index}
                    value={ingredient}
                    placeholder="ingredient"
                    placeholderTextColor={
                      Colors.light.components.inputField.placeholderTextColor
                    }
                    onChangeText={(text: string) => {
                      if (recipe) {
                        const newIngredients = recipe.ingredients.map(
                          (item, i) => {
                            if (i === index) return text;
                            return item;
                          }
                        );
                        setRecipe({
                          ...recipe,
                          ingredients: newIngredients,
                        });
                      }
                    }}
                    onEndEditing={() => {
                      setEditIngredient(null);
                      if (ingredient === "") {
                        const newIngredients = recipe.ingredients.filter(
                          (item) => item !== ingredient
                        );
                        setRecipe({
                          ...recipe,
                          ingredients: newIngredients,
                        });
                      }
                    }}
                    multiline={true}
                    textAlignVertical="top"
                  />
                ) : (
                  <Text
                    onPress={() => {
                      setEditIngredient(index);
                    }}
                    style={styles.listItemText}
                  >
                    {formatIngredient(ingredient, measurements)}
                  </Text>
                )}
                <View style={{ flexDirection: "row", gap: wp(2) }}>
                  <RoundButton
                    handlePress={() => {
                      if (!recipe) return;
                      const newIngredients = recipe.ingredients.filter(
                        (item) => item !== ingredient
                      );
                      setRecipe({
                        ...recipe,
                        ingredients: newIngredients,
                      });
                    }}
                    transparent={false}
                    backgroundColor={Colors.secondaryWhite}
                  >
                    <Ionicons name="trash" size={hp(2.7)} color={"#C70000"} />
                  </RoundButton>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
};

export default EditRecipeIngredientList;

const styles = StyleSheet.create({
  contentItemInput: {
    flex: 1,
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  listItemText: {
    width: "100%",
    flex: 1,
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
    flex: 1,
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
  contentItemTitle: {
    color: Colors.darkGrey,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
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
  listItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: wp(2),
    borderColor: Colors.primarySkyBlue,
    borderWidth: 1,
    padding: wp(1),
    borderRadius: hp(ComponentParams.button.height.large / 2),
  },
  stepNumber: {
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    aspectRatio: 1,
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
  },
  ingredientImage: {
    backgroundColor: "transparent",
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
  },
  stepItemList: {
    width: "100%",
    flexDirection: "column",
    gap: hp(1),
  },
});
