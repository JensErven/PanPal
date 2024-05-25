import { View, Text, StyleSheet } from "react-native";
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
import ComponentParams from "@/constants/ComponentParams";

const RecipeDetailsTabBarSheetModal = ({
  snapPoints,
  bottomSheetModalRef,
  children,
  footerChildren,
}: {
  snapPoints: number[];
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
}) => {
  return (
    <BottomSheetModal
      footerComponent={() => footerChildren}
      backgroundStyle={styles.modalBackground}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handle}></View>
        </View>
      )}
    >
      <BottomSheetScrollView style={styles.contentContainer}>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default RecipeDetailsTabBarSheetModal;

const styles = StyleSheet.create({
  modalBackground: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    borderTopRightRadius: hp(ComponentParams.button.height.medium / 2),
    borderColor: Colors.secondaryWhite,
    borderWidth: 2,
    backgroundColor: Colors.white,
  },

  content: {
    backgroundColor: Colors.white,
    gap: hp(2),
    paddingVertical: hp(2),
    paddingBottom: hp(4),
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),

    borderColor: Colors.secondaryWhite,
    borderBottomWidth: hp(0.25),
  },
  title: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.darkBlue,
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
  bottomGradient: {
    zIndex: -1,
    position: "absolute",
    top: 0,
    width: wp(100),
    height: hp(5),
  },
});
