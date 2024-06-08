import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import { RecipeType } from "@/models/RecipeType";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { mealTypes as meals } from "@/constants/tastePreferences/MealTypes";
import CustomSheetModal from "../modals/CustomSheetModal";
import StandardButton from "../buttons/StandardButton";
import OptionTagButton from "../buttons/OptionTagButton";

const EditRecipeMealType = ({
  recipe = {} as RecipeType,
  setRecipe,
  title = "Meal Type",
}: {
  title?: string;
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
}) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [mealTypes, setMealTypes] = useState<string[]>(meals);
  const [searchInputField, setSearchInputField] = useState<string>("");

  const handleOpenModal = () => {
    modalRef.current?.present();
  };

  const handleCloseModal = () => {
    modalRef.current?.dismiss();
    setSearchInputField("");
  };

  const filteredMeals = useMemo(() => {
    return mealTypes.filter((meal) =>
      meal.toLowerCase().includes(searchInputField.toLowerCase())
    );
  }, [searchInputField]);

  const handleSheetChanges = (index: number) => {
    if (index === 0) {
      setSearchInputField("");
    }
  };
  return (
    <View>
      <CustomSheetModal
        handleSheetChanges={handleSheetChanges}
        modalRef={modalRef}
        snapPoints={[hp(100)]}
        headerChildren={
          <>
            <Text style={styles.modalTitle}>Select Cuisine Type</Text>
            <View style={styles.contentItemInputContainer}>
              <Ionicons
                name="search"
                size={hp(2.7)}
                color={Colors.light.components.inputField.placeholderTextColor}
              />
              <TextInput
                value={searchInputField}
                onChangeText={setSearchInputField}
                style={styles.contentItemInput}
                placeholder="Search"
                placeholderTextColor={
                  Colors.light.components.inputField.placeholderTextColor
                }
              />
            </View>
          </>
        }
        scrollViewChildren={
          <View style={styles.scrollContentContainer}>
            {filteredMeals.map((meal: string, index: number) => (
              <OptionTagButton
                key={index}
                option={meal}
                selectOption={() => {
                  if (recipe.mealType === meal) {
                    setRecipe({ ...recipe, mealType: "" });
                  } else {
                    setRecipe({ ...recipe, mealType: meal });
                  }
                }}
                selected={recipe.mealType === meal}
              />
            ))}
          </View>
        }
        footerChildren={
          <StandardButton
            textValue="Save"
            clickHandler={handleCloseModal}
            height={ComponentParams.button.height.medium}
            colors={Colors.light.components.button.purple.background}
            textColor={Colors.white}
          />
        }
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={styles.contentItemTitle}>{title}</Text>
        <TouchableOpacity
          onPress={handleOpenModal}
          style={styles.contentItemButton}
        >
          <Text style={styles.text}>
            {recipe?.mealType ? recipe.mealType : "Select"}
          </Text>
          <Ionicons name="chevron-down" size={24} color={Colors.darkGrey} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditRecipeMealType;

const styles = StyleSheet.create({
  contentItemInput: {
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemInputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.secondaryWhite,
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    gap: wp(2),
  },
  text: {
    textTransform: "capitalize",
    textAlignVertical: "center",
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
  contentItemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.secondaryWhite,
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    paddingHorizontal: wp(4),
    gap: wp(2),
  },
  modalTitle: {
    marginBottom: hp(1),
    color: Colors.darkGrey,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
  },
  scrollContentContainer: {
    flexWrap: "wrap",
    flex: 1,
    gap: hp(1),
    flexDirection: "row",
    paddingTop: hp(2),
    paddingBottom: hp(8),
    paddingHorizontal: wp(4),
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small),
    shadowColor: Colors.darkGrey,
    backgroundColor: Colors.white,
    elevation: 2,
  },
});
