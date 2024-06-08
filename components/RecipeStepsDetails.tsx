import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import StepListItem from "./recipe/StepListItem";

interface RecipeStepsDetailsProps {
  steps: string[];
  times: number[];
  selectedSteps: number[];
  setSelectedSteps: (steps: number[]) => void;
  setProgress: (progress: number) => void;
}

const RecipeStepsDetails: React.FC<RecipeStepsDetailsProps> = ({
  steps,
  times,
  selectedSteps,
  setSelectedSteps,
  setProgress,
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
    <View style={styles.stepsList}>
      {steps.map((step, index) => (
        <StepListItem
          key={index}
          step={step}
          index={index}
          selectedStep={handleStepClick(index)}
          selected={selectedSteps.includes(index)}
        />
      ))}
    </View>
  );
};

export default RecipeStepsDetails;

const styles = StyleSheet.create({
  stepsList: {
    gap: hp(2),
    flexDirection: "column",
    paddingTop: hp(2),
    paddingBottom: hp(8),
  },
});
