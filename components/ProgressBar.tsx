import Colors from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CircularProgress = ({
  size,
  progress,
  strokeWidth,
  backgroundColor = Colors.white,
  strokeColor,
}: {
  size: number;
  progress: number;
  strokeWidth: number;
  backgroundColor?: string;
  strokeColor: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Create animated value for progress
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    // Animate the progress value with spring effect
    Animated.spring(animatedProgress, {
      toValue: progress,
      useNativeDriver: true,
      speed: 2,
      bounciness: 10,
    }).start();
  }, [progress]);

  // Interpolate progress value to calculate strokeDashoffset
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: "clamp",
  });

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          opacity={0.25}
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <AnimatedCircle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};

// Create an Animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default CircularProgress;
