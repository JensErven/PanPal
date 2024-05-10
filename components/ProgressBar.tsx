import Colors from "@/constants/Colors";
import React from "react";
import { View } from "react-native";
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
  const progressStrokeDashoffset =
    circumference - (progress / 100) * circumference;

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
        <Circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progressStrokeDashoffset}
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

export default CircularProgress;
