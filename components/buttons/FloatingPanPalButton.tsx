import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import { blurhash } from "@/utils/general.utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import panPalIcon from "@/assets/images/panpal-icon-medium.png";

const FloatingPanPalButton = () => {
  const handlePanPalButtonPress = () => {
    router.push("panpal/chat");
  };

  const translateYValue = useRef(new Animated.Value(0)).current;

  const startFloating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateYValue, {
          toValue: -5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startFloating();
  }, []);

  return (
    <Animated.View
      style={[
        styles.panPalButtonContainer,
        { transform: [{ translateY: translateYValue }] },
      ]}
    >
      <TouchableOpacity activeOpacity={1} onPress={handlePanPalButtonPress}>
        <Image
          style={styles.recipeImage}
          source={panPalIcon}
          placeholder={blurhash}
          contentFit="cover"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FloatingPanPalButton;

const styles = StyleSheet.create({
  panPalButtonContainer: {
    position: "absolute",
    bottom: hp(10),
    left: wp(4),
    zIndex: 48,
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.large),
    shadowColor: Colors.cardDropShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  recipeImage: {
    width: hp(ComponentParams.button.height.large + 1),
    height: hp(ComponentParams.button.height.large + 1),
  },
});
