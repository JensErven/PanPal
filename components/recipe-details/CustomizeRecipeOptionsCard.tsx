import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import { Ionicons } from "@expo/vector-icons";

const CustomizeRecipeOptionsCard = ({
  selectedDiet,
  selectedFlavorBoost,
}: {
  selectedDiet?: string;
  selectedFlavorBoost?: string;
}) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const handleOpenModal = (type: string) => {
    modalRef.current?.present();
  };
  return (
    <>
      <BottomSheetModal ref={modalRef} snapPoints={[hp(100)]} index={0}>
        <BottomSheetView>
          <Text>Customize your recipe</Text>
        </BottomSheetView>
      </BottomSheetModal>
      <View style={styles.container}>
        <Text style={styles.cardTitle}>Customize your recipe</Text>
        <View style={styles.content}>
          <View style={styles.contentCardItem}>
            <Text style={styles.contentCardItemTitle}>Diet</Text>
            <TouchableOpacity
              style={styles.itemButton}
              onPress={() => handleOpenModal("diet")}
            >
              <Text style={styles.contentCardItemValue}>
                {selectedDiet ? selectedDiet : "Enhance"}
              </Text>
              <Ionicons name="chevron-down" size={24} color={Colors.darkGrey} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentCardItem}>
            <Text style={styles.contentCardItemTitle}>Flavor Boost</Text>
            <TouchableOpacity
              style={styles.itemButton}
              onPress={() => handleOpenModal("flavorBoost")}
            >
              <Text style={styles.contentCardItemValue}>
                {selectedFlavorBoost ? selectedFlavorBoost : "Enhance"}
              </Text>
              <Ionicons name="chevron-down" size={24} color={Colors.darkGrey} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default CustomizeRecipeOptionsCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
  },
  cardTitle: {
    textTransform: "capitalize",
    fontFamily: Fonts.heading_3.fontFamily,
    fontSize: Fonts.heading_3.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.heading_3.lineHeight,
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: hp(2),
  },
  contentCardItem: {
    flexDirection: "column",
    gap: hp(1),
    padding: wp(4),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    elevation: 3,
    shadowColor: Colors.darkGrey,
    width: "48%",
    marginBottom: hp(2),
  },
  contentCardItemTitle: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_1.lineHeight,
    textTransform: "capitalize",
  },
  contentCardItemValue: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
  },
  itemButton: {
    width: "100%",
    paddingHorizontal: wp(4),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.primarySkyBlue,
  },
});
