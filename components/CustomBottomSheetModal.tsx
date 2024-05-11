import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CustomBottomSheetModal = ({
  children,
  snapPoints,
  bottomSheetModalRef,
  handleSheetChanges,
}: {
  children: React.ReactNode;
  snapPoints: number[];
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handleSheetChanges: (index: number) => void;
}) => {
  return (
    <BottomSheetModal
      backdropComponent={(backdropProps) => <View style={styles.backdrop} />}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomBottomSheetModal;

const styles = StyleSheet.create({
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
    paddingHorizontal: wp(4),
    flex: 1,
    gap: hp(1),
    alignItems: "center",
  },
});
