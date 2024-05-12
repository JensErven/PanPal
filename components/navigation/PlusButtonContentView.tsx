import { View, StyleSheet, Animated } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
const PlusButtonContentView = ({ children }: { children: React.ReactNode }) => {
  const translateY = new Animated.Value(hp(10)); // Initial translateY value
  Animated.spring(translateY, {
    toValue: 0,
    useNativeDriver: true,
  }).start(); // Start translateY animation
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] }, // Apply translateY animation
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default PlusButtonContentView;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(2),
    zIndex: 49,
    position: "absolute",
    bottom: hp(10),
    flex: 1,
    width: wp(92), // Adjusted width to take into account left and right margins
    marginHorizontal: wp(4),
    height: "auto",
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.small),
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
