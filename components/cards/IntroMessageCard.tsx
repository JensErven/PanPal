import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Message } from "@/models/Message";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";

const IntroMessageCard = ({
  disableSelectOption,
  image,
  title,
  text,
  options,
  index,
  selectOption,
}: {
  disableSelectOption: boolean;
  image: string;
  title: string;
  text: string;
  options: string[];
  index: number;
  selectOption: (message: Message) => void;
}) => {
  const handleSelectOption = (option: string) => {
    const message: Message = {
      role: "user",
      content: option,
    };
    selectOption(message);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradientContainer}
        colors={[Colors.white, Colors.secondaryWhite, Colors.primarySkyBlue]}
        start={[0, 0]}
        end={[1, 1]}
      />
      <View style={styles.introContainer}>
        <Image source={image} placeholder={blurhash} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>

      <View style={styles.optionListContainer}>
        <Text style={styles.subTitle}>Select an option:</Text>
        {options.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => {
              disableSelectOption ? null : handleSelectOption(option);
            }}
          >
            <LinearGradient
              colors={Colors.light.components.button.purple.background}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.selectOptionButton}
            >
              <TouchableOpacity
                disabled={disableSelectOption}
                style={styles.touchable}
                key={index}
                onPress={() => {
                  disableSelectOption ? null : handleSelectOption(option);
                }}
              >
                <Ionicons
                  name="checkmark"
                  size={hp(2.7)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </LinearGradient>
            <Text style={styles.text}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default IntroMessageCard;

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    maxWidth: wp(80),
    elevation: 3,
    shadowColor: Colors.darkBlue,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: hp(ComponentParams.button.height.large / 2),
    alignSelf: "flex-start",
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.large / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  introContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: wp(2),
    width: "100%",
    flexWrap: "wrap",
  },
  image: {
    width: hp(ComponentParams.button.height.large),
    height: hp(ComponentParams.button.height.large),
    borderRadius: hp(ComponentParams.button.height.large),
  },
  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
    flex: 1,
  },
  subTitle: {
    fontFamily: Fonts.QuickSandBold.fontFamily,
    fontSize: Fonts.QuickSandBold.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.QuickSandBold.lineHeight,
  },

  optionListContainer: {
    gap: hp(1),
    flexDirection: "column",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "flex-start",
    width: "100%",
    marginTop: hp(2),
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: wp(2),
    marginRight: wp(4),
    width: "100%",
    flexWrap: "wrap",
  },
  selectOptionButton: {
    borderRadius: hp(ComponentParams.button.height.small),
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
  },
  touchable: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.small),
    borderColor: Colors.darkBlue,
    borderWidth: 1,
  },
  optionText: {
    color: Colors.white,
    fontSize: Fonts.text_2.fontSize,
  },
});
