import { Keyboard, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
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
  hasBackdrop = true,
  enablePanDownToClose = true,
}: {
  modalRef: React.RefObject<BottomSheetModal>;
  headerChildren: React.ReactNode;
  scrollViewChildren?: React.ReactNode;
  footerChildren?: React.ReactNode;
  snapPoints?: number[];
  handleSheetChanges?: (index: number) => void;
  hasBackdrop?: boolean;
  enablePanDownToClose?: boolean;
}) => {
  const [changedSnapPoints, setChangedSnapPoints] = useState(snapPoints);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // Adjust snap points when keyboard is open
        setChangedSnapPoints([hp(80)]);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // Reset snap points when keyboard is hidden
        setChangedSnapPoints(snapPoints);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <BottomSheetModal
      backdropComponent={(backdropProps) =>
        hasBackdrop && <View style={styles.backdrop} />
      }
      enablePanDownToClose={enablePanDownToClose}
      onChange={handleSheetChanges}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handle}></View>
        </View>
      )}
      ref={modalRef}
      index={0}
      snapPoints={changedSnapPoints}
      style={styles.modalContainer}
      footerComponent={() => (
        <View style={footerChildren ? styles.footerContainer : undefined}>
          {footerChildren}
        </View>
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
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.6,
  },
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
    paddingBottom: hp(2),
    borderBottomColor: Colors.secondaryWhite,
  },
  scrollViewContainer: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    flex: 1,
    backgroundColor: "transparent",
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
