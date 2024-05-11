import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
const PlusButtonContentView = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
};

export default PlusButtonContentView;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(2),
    zIndex: 1000,
    position: "absolute",
    bottom: hp(2),
    flex: 1,
    width: wp(92), // Adjusted width to take into account left and right margins
    marginHorizontal: wp(4),
    height: "auto",
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.medium),
    shadowColor: Colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
