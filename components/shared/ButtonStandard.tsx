import {
  View,
  Text,
  useColorScheme,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import {
  BORDER_RADIUS_LARGE,
  BUTTON_HEIGHT_LARGE,
} from "@/constants/ScreenParams";
import Colors from "@/constants/Colors";
import React from "react";

const ButtonStandard = ({
  title,
  backgroundColor,
  clicked,
}: {
  title: string;
  backgroundColor: string;
  clicked: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={clicked}
    >
      <Text style={styles.textContainer}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonStandard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: BUTTON_HEIGHT_LARGE,
    borderRadius: BORDER_RADIUS_LARGE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.pearl,
    padding: 10,
    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    paddingHorizontal: 16,
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    color: Colors.pearl,
  },
});
