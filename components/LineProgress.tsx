import Colors from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const LineProgress = ({
  width,
  height = hp(1.5),
  progress,
  backgroundColor = Colors.secondaryWhite,
  strokeColor = Colors.mediumPurple,
}: {
  width?: number;
  height?: number;
  progress: number;
  backgroundColor?: string;
  strokeColor?: string;
}) => {
  // Create animated value for progress
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the progress value with timing function
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000, // Animation duration in milliseconds
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Interpolate progress value to calculate width
  const barWidth = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View
      style={{
        width,
        height,
        backgroundColor,
        borderRadius: height,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height: "100%",
          backgroundColor: strokeColor,
          width: barWidth,
          borderTopRightRadius: height,
          borderBottomRightRadius: height,
        }}
      />
    </View>
  );
};

export default LineProgress;
