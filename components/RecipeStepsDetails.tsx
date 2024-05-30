import { View, Text, StyleSheet, Touchable } from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import SmallInfoTag from "./recipe-details/SmallInfoTag";
import { Ionicons } from "@expo/vector-icons";
import CircularProgress from "./ProgressBar";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

const RecipeStepsDetails = ({
  steps,
  times,
  selectedSteps,
  setSelectedSteps,
  setProgress,
}: {
  steps: string[];
  times: number[];
  selectedSteps: number[];
  setSelectedSteps: (steps: number[]) => void;
  setProgress: (progress: number) => void;
}) => {
  const handleStepClick = (index: number) => () => {
    if (selectedSteps.includes(index)) {
      setSelectedSteps(selectedSteps.filter((step) => step !== index));
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedSteps([...selectedSteps, index]);
    }
  };

  useEffect(() => {
    setProgress((selectedSteps.length / steps.length) * 100);
  }, [selectedSteps]);

  return (
    <View style={styles.container}>
      <View style={styles.stepsList}>
        {steps.map((step, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={index}
            style={styles.stepItem}
            onPress={handleStepClick(index)}
          >
            <LinearGradient
              style={styles.stepNumber}
              colors={[Colors.secondaryWhite, Colors.primarySkyBlue]}
            >
              <Text style={styles.bulletPointText}>{index + 1}</Text>
            </LinearGradient>

            <Text
              style={[
                styles.text,
                {
                  textDecorationLine: selectedSteps.includes(index)
                    ? "line-through"
                    : "none",
                },
              ]}
            >
              {step}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RecipeStepsDetails;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  stepsList: {
    gap: hp(2),
    flexDirection: "column",
    paddingBottom: hp(4),
  },
  text: {
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlignVertical: "center",
  },
  stepItem: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    minHeight: hp(ComponentParams.button.height.large),
    width: "100%",
    paddingVertical: wp(1),
    paddingHorizontal: wp(1),
    borderWidth: 1,
    borderColor: Colors.primarySkyBlue,
    borderRadius: hp(ComponentParams.button.height.large / 2),
  },
  stepNumber: {
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    aspectRatio: 1,
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
  },
  bulletPointText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
