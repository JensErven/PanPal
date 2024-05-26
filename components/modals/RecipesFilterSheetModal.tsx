import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Easing,
} from "react-native";
import React, { useRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import StandardButton from "../buttons/StandardButton";
import ComponentParams from "@/constants/ComponentParams";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { mealTypes } from "@/constants/tastePreferences/MealTypes";
import FilterOptionsSelectCard from "../cards/FilterOptionsSelectCard";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const RecipesFilterSheetModal = ({
  children,
  snapPoints,
  bottomSheetModalRef,
  handleSheetChanges,
  selectedCuisineTypes,
  setSelectedCuisineTypes,
  selectedMealTypes,
  setSelectedMealTypes,
  setToShowRecipesType,
  toShowRecipesType,
}: {
  children?: React.ReactNode;
  snapPoints: number[];
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handleSheetChanges?: (index: number) => void;
  selectedCuisineTypes: string[];
  setSelectedCuisineTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealTypes: string[];
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setToShowRecipesType: React.Dispatch<React.SetStateAction<string>>;
  toShowRecipesType: string;
}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const startIconRotateAnimation = () => {
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handleResetPress = () => {
    setSelectedCuisineTypes([]);
    setSelectedMealTypes([]);
    setToShowRecipesType("All");
    startIconRotateAnimation();
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <BottomSheetModal
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handle}></View>
        </View>
      )}
      backgroundStyle={styles.modalBackground}
      footerComponent={(footerProps) => (
        <View style={styles.footerContainer}>
          <View style={{ flex: 1, width: "100%" }}>
            <StandardButton
              textValue="Apply Filters"
              textColor={Colors.white}
              height={ComponentParams.button.height.medium}
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
            style={{
              flexDirection: "row",
              gap: wp(1),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleResetPress}
          >
            <Text style={{ color: Colors.mediumPurple }}>Reset</Text>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Ionicons
                name="refresh"
                size={hp(2.7)}
                color={Colors.mediumPurple}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FilterOptionsSelectCard
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
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default RecipesFilterSheetModal;

const styles = StyleSheet.create({
  modalBackground: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderTopRightRadius: hp(ComponentParams.button.height.medium / 2),
    borderColor: Colors.secondaryWhite,
    borderWidth: 2,
    backgroundColor: Colors.white,
  },
  inputLabel: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
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
    width: "100%",
  },
  filterHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderColor: Colors.secondaryWhite,
    borderBottomWidth: hp(0.25),
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderColor: Colors.secondaryWhite,
    borderTopWidth: hp(0.25),
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
    gap: hp(2),
    paddingVertical: hp(2),
  },
  handleContainer: {
    alignItems: "center",
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
  },
  handle: {
    width: wp(10),
    height: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: Colors.primarySkyBlue,
  },
});
