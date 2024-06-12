import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { RecipeType } from "@/models/RecipeType";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { dietTypes as diets } from "@/constants/tastePreferences/DietTypes";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomSheetModal from "../modals/CustomSheetModal";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import StandardButton from "../buttons/StandardButton";
import OptionTagButton from "../buttons/OptionTagButton";

type EditDietTypeProps = {
  title?: string;
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
};

const EditDietType: React.FC<EditDietTypeProps> = ({
  title = "Diet Type",
  recipe,
  setRecipe,
}) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [dietTypes, setDietTypes] = useState<string[]>(diets);
  const [searchInputField, setSearchInputField] = useState<string>("");

  const handleOpenModal = () => {
    modalRef.current?.present();
  };

  const handleCloseModal = () => {
    modalRef.current?.dismiss();
    setSearchInputField("");
  };

  const filteredDiets = useMemo(() => {
    return dietTypes.filter((diet) =>
      diet.toLowerCase().includes(searchInputField.toLowerCase())
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
            <Text style={styles.modalTitle}>Select Diet Type</Text>
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
            {filteredDiets.map((diet: string, index: number) => (
              <OptionTagButton
                key={index}
                option={diet}
                selectOption={() => {
                  if (recipe.dietType === diet) {
                    setRecipe({ ...recipe, dietType: "" });
                  } else {
                    setRecipe({ ...recipe, dietType: diet });
                  }
                }}
                selected={recipe.dietType === diet}
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
          <LinearGradient
            colors={[Colors.white, Colors.secondaryWhite]}
            style={styles.gradientContainer}
            start={[0, 0]}
            end={[1, 1]}
          />
          <Text style={styles.text} ellipsizeMode="tail" numberOfLines={1}>
            {recipe?.dietType ? recipe.dietType : "Select"}
          </Text>
          <Ionicons name="chevron-down" size={24} color={Colors.darkGrey} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditDietType;

const styles = StyleSheet.create({
  contentItemInput: {
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    maxWidth: wp(50),
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    borderRightColor: Colors.white,
    borderRightWidth: 0.25,
    flexDirection: "row",
    gap: wp(2),
    paddingHorizontal: wp(4),
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: Colors.darkBlue,
    backgroundColor: Colors.white,
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
