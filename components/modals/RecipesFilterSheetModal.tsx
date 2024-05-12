import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import StandardButton from "../buttons/StandardButton";
import ComponentParams from "@/constants/ComponentParams";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { mealTypes } from "@/constants/tastePreferences/MealTypes";
import { cookTimeOptions } from "@/constants/filterOptions/CookTime";
import FilterOptionsSelectCard from "../FilterOptionsSelectCard";
import { ScrollView } from "react-native-gesture-handler";

const RecipesFilterSheetModal = ({
  children,
  snapPoints,
  bottomSheetModalRef,
  handleSheetChanges,
  selectedCuisineTypes,
  setSelectedCuisineTypes,
  selectedMealTypes,
  setSelectedMealTypes,
  selectedCookTime,
  setSelectedCookTime,
}: {
  children?: React.ReactNode;
  snapPoints: number[];
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handleSheetChanges: (index: number) => void;
  selectedCuisineTypes: string[];
  setSelectedCuisineTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealTypes: string[];
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCookTime: string[];
  setSelectedCookTime: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <BottomSheetModal
      backgroundStyle={styles.modalBackground}
      footerComponent={(footerProps) => (
        <View style={styles.footerContainer}>
          <View style={{ flex: 1, width: "100%" }}>
            <StandardButton
              textValue="Apply Filters"
              textColor={Colors.white}
              height={ComponentParams.button.height.large}
              colors={[
                Colors.light.components.button.purple.background[0],
                Colors.light.components.button.purple.background[1],
                Colors.light.components.button.purple.background[2],
              ]}
              borderColor={Colors.light.components.button.purple.background[0]}
              clickHandler={() => bottomSheetModalRef.current?.dismiss()}
            />
          </View>
        </View>
      )}
      backdropComponent={(backdropProps) => <View style={styles.backdrop} />}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
        <View style={styles.filterHeaderContainer}>
          <Text style={styles.title}>Filter Options</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedCuisineTypes([]);
              setSelectedMealTypes([]);
            }}
          >
            <Text>Clear Filters</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <FilterOptionsSelectCard
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
            options={cuisineTypes.map((cuisine) => cuisine.name)}
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
          <FilterOptionsSelectCard
            options={cookTimeOptions}
            title="Cook Time"
            selectedOptions={selectedCookTime}
            selectOption={(option) => {
              if (selectedCookTime[0] === option) {
                setSelectedCookTime([]);
              } else {
                setSelectedCookTime([option]);
              }
            }}
          />
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default RecipesFilterSheetModal;

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: Colors.white,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.6,
    // Add gradient effect for a nicer backdrop
  },
  contentContainer: {
    flex: 1,
    gap: hp(1),
    width: "100%",
  },
  filterHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  footerContainer: {
    paddingHorizontal: wp(4),
    width: "100%",
    height: hp(ComponentParams.button.height.large + 4),
    paddingVertical: hp(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    elevation: 10,
    shadowColor: Colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  footerButton: {
    width: wp(90),
    height: hp(7),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(4),
  },
  footerButtonText: {
    fontSize: wp(4),
    color: "white",
  },
  title: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.darkBlue,
  },
  content: {
    flex: 1,
  },
});
