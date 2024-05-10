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
}: {
  textValue: string;
  height: number;
  colors: string[];
  textColor?: string;
  borderColor?: string;
  icon?: React.ReactNode;
  shadowColor: string;
  isDisabled?: boolean;
  loading?: boolean;
  clickHandler: () => void;
}) => {
  return (
    <TouchableOpacity
      disabled={loading}
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
          alignItems: "center",
          justifyContent: "center",
          height: hp(height),
          borderRadius: hp(height),
        }}
      >
        {loading ? (
          <ActivityIndicator size={hp(2.5)} color={textColor} />
        ) : (
          <View className="flex flex-row items-center justify-center gap-x-2">
            <Text
              style={{
                textAlign: "center",
                color: textColor,
                fontFamily: Fonts.text_1.fontFamily,
                fontSize: Fonts.text_1.fontSize,
              }}
            >
              {textValue}
            </Text>
            {icon && icon}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default StandardButton;
