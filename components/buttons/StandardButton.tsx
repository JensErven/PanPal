import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";

const StandardButton = ({
  textValue,
  height,
  colors,
  textColor,
  borderColor,
  icon,
  shadowColor,
  isDisabled,
  clickHandler,
  loading,
  iconRight,
  iconLeft,
}: {
  textValue: string;
  height: number;
  colors: string[];
  textColor?: string;
  borderColor?: string;
  icon?: React.ReactNode;
  shadowColor?: string;
  isDisabled?: boolean;
  loading?: boolean;
  clickHandler: () => void;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
}) => {
  return (
    <TouchableOpacity
      disabled={isDisabled || loading}
      onPress={clickHandler}
      style={{
        borderRadius: hp(height),
        borderColor: borderColor,
        borderWidth: 2,
        shadowColor: Colors.light.components.button.pink.dropShadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
      }}
    >
      <LinearGradient
        colors={colors.length >= 2 ? [...colors] : [colors[0], colors[0]]}
        style={{
          paddingHorizontal: wp(0),
          alignItems: "center",
          justifyContent: "center",
          height: hp(height),
          borderRadius: hp(height),
        }}
      >
        {loading ? (
          <ActivityIndicator size={hp(2.7)} color={textColor} />
        ) : (
          <View className="flex flex-row items-center justify-center gap-x-2 w-full">
            <Text
              style={{
                textAlign: "center",
                color: textColor,
                fontFamily: Fonts.text_1.fontFamily,
                fontSize: Fonts.text_1.fontSize,
                textTransform: "capitalize",
              }}
            >
              {textValue}
            </Text>
            {icon && icon}
            {iconRight && (
              <View
                style={{
                  position: "absolute",

                  right: wp(0),
                }}
              >
                {iconRight}
              </View>
            )}
            {iconLeft && (
              <View
                style={{
                  position: "absolute",

                  left: wp(0),
                }}
              >
                {iconLeft}
              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default StandardButton;
