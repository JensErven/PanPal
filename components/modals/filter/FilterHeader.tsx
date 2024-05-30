import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useRef } from "react";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

const FilterHeader = ({ reset }: { reset: () => void }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const startIconRotateAnimation = () => {
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };
  return (
    <View style={styles.filterHeaderContainer}>
      <Text style={styles.title}>Filter Options</Text>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: wp(1),
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          startIconRotateAnimation();
          reset();
        }}
      >
        <Text
          style={{
            color: Colors.mediumPurple,
            fontFamily: Fonts.text_2.fontFamily,
            fontSize: Fonts.text_2.fontSize,
            lineHeight: Fonts.text_2.lineHeight,
          }}
        >
          Reset
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="refresh" size={hp(2.7)} color={Colors.mediumPurple} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FilterHeader;

const styles = StyleSheet.create({
  filterHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.darkGrey,
  },
});
