import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CustomSheetModal = ({
  modalRef,
  headerChildren,
  scrollViewChildren,
  footerChildren,
  snapPoints = [hp(100)],
  handleSheetChanges,
}: {
  modalRef: React.RefObject<BottomSheetModal>;
  headerChildren: React.ReactNode;
  scrollViewChildren: React.ReactNode;
  footerChildren?: React.ReactNode;
  snapPoints?: number[];
  handleSheetChanges?: (index: number) => void;
}) => {
  return (
    <BottomSheetModal
      onChange={handleSheetChanges}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handle}></View>
        </View>
      )}
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      style={styles.modalContainer}
      footerComponent={() => (
        <View style={styles.footerContainer}>{footerChildren}</View>
      )}
    >
      <BottomSheetView style={styles.headerContainer}>
        {headerChildren}
      </BottomSheetView>
      <BottomSheetScrollView style={styles.scrollViewContainer}>
        {scrollViewChildren}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default CustomSheetModal;

const styles = StyleSheet.create({
  modalContainer: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderTopRightRadius: hp(ComponentParams.button.height.medium / 2),
    borderColor: Colors.secondaryWhite,
    borderWidth: 2,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryWhite,
  },
  scrollViewContainer: {
    paddingHorizontal: wp(4),
    flex: 1,
    backgroundColor: "transparent", // Change to "white" for a white background
  },
  footerContainer: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: Colors.secondaryWhite,
    backgroundColor: "white",
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
