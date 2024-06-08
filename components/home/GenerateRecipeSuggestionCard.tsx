import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import StandardButton from "../buttons/StandardButton";
import RoundButton from "../buttons/RoundButton";
import LottieView from "lottie-react-native";
import CoinCount from "../common/CoinCount";
import AnsweringAnimationItem from "../chat/AnsweringAnimationItem";

interface GenerateRecipeSuggestionCardProps {
  credits: number;
  username: string;
  generateRecipe: () => void;
  loading: boolean;
}

const GenerateRecipeSuggestionCard: React.FC<
  GenerateRecipeSuggestionCardProps
> = ({ username, generateRecipe, credits, loading }) => {
  const animation = useRef(null);
  return (
    <TouchableOpacity
      disabled={loading || credits < 1}
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => generateRecipe()}
    >
      <View
        style={{
          position: "absolute",

          zIndex: 1,
          left: wp(4),
          right: wp(4),
          bottom: hp(2),
        }}
      >
        <StandardButton
          isDisabled={loading || credits < 1}
          height={ComponentParams.button.height.medium}
          textValue={loading ? "Cooking..." : "Let me Cook! 🍳"}
          clickHandler={() => generateRecipe()}
          colors={Colors.light.components.button.purple.background}
          textColor={Colors.white}
          borderColor={Colors.light.components.button.purple.border}
          iconRight={
            <RoundButton
              children={
                <Ionicons name="sparkles" color={Colors.white} size={hp(2.4)} />
              }
              height={ComponentParams.button.height.medium}
              handlePress={() => {
                return;
              }}
              transparent={true}
            />
          }
        />
      </View>
      <LinearGradient
        style={styles.gradientContainer}
        colors={[Colors.white, Colors.secondaryWhite, Colors.primarySkyBlue]}
        start={[0, 0]}
        end={[1, 1]}
      />
      <View style={[styles.isGeneratedIconContainer]}>
        <Ionicons name="sparkles" size={hp(2)} color={Colors.mediumPurple} />
      </View>
      {loading ? (
        <AnsweringAnimationItem />
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Should I generate another recipe for you
            {username ? `, ${username}?` : "?"}
          </Text>
        </View>
      )}

      <View style={styles.panpalCreditsContainer}>
        <CoinCount
          count={1}
          isTransparent={false}
          textColor={Colors.darkBlue}
        />
      </View>
    </TouchableOpacity>
  );
};

export default GenerateRecipeSuggestionCard;

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.large / 2),
    height: hp(38),
    width: wp(80),
    paddingHorizontal: wp(2),
    overflow: "visible",
  },
  textContainer: {
    marginBottom: hp(4),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: hp(1),
    paddingHorizontal: wp(4),
    paddingVertical: hp(8),
  },
  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkBlue,
    textAlign: "center",
  },
  subTitle: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkGrey,
    textTransform: "capitalize",
  },
  panpalCreditsContainer: {
    position: "absolute",
    top: hp(1),
    right: wp(2),
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.large / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  isGeneratedIconContainer: {
    position: "absolute",
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.small),
    backgroundColor: Colors.white,
    shadowColor: Colors.darkBlue,
    elevation: 1,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: hp(ComponentParams.button.height.medium / 2),

    borderTopLeftRadius: hp(ComponentParams.button.height.medium / 2),
    top: wp(0),
    left: wp(0),
    zIndex: 1,
  },
});
