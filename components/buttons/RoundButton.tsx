import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
const RoundButton = ({
  height = ComponentParams.button.height.medium,
  transparent = true,
  backgroundColor,
  children,
  handlePress,
}: {
  height?: number;
  transparent?: boolean;
  backgroundColor?: string;
  children: React.ReactNode;
  handlePress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: transparent ? "rgba(0, 0, 0, 0.2)" : backgroundColor,
          height: hp(height),
          borderRadius: hp(height / 2),
        },
      ]}
    >
      <View style={styles.content}>{children}</View>
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
