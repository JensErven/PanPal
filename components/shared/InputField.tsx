import {
  View,
  Text,
  useColorScheme,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";

import {
  BORDER_RADIUS_LARGE,
  BUTTON_HEIGHT_LARGE,
  ICON_SIZE_MEDIUM,
} from "@/constants/ScreenParams";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
const InputField = ({
  placeholder,
  inputValue,
  setInputField,
  secureTextEntry = false,
  setSecureTextEntry,
}: {
  placeholder: string;
  inputValue: string;
  setInputField: (text: string) => void;
  secureTextEntry?: boolean;
  setSecureTextEntry?: (value: boolean) => void;
}) => {
  const colorScheme = useColorScheme();

  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;
  const themeTextStyle =
    colorScheme === "light" ? styles.lightText : styles.darkText;

  return (
    <>
      {placeholder.includes("Password") ? (
        <View style={[styles.container, themeContainerStyle]}>
          <TextInput
            value={inputValue}
            placeholder={placeholder}
            style={[styles.inputfieldContainer, themeTextStyle]}
            onChangeText={(text) => setInputField(text)}
            secureTextEntry={secureTextEntry}
          />
          <TouchableOpacity
            onPress={() =>
              setSecureTextEntry && setSecureTextEntry(!secureTextEntry)
            }
          >
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
              size={ICON_SIZE_MEDIUM}
              color={Colors.frost}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.container, themeContainerStyle]}>
          <TextInput
            style={[styles.inputfieldContainer, themeTextStyle]}
            value={inputValue}
            placeholder={placeholder}
            onChangeText={(text) => setInputField(text)}
            secureTextEntry={secureTextEntry}
          />
        </View>
      )}
    </>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: BUTTON_HEIGHT_LARGE,
    borderRadius: BORDER_RADIUS_LARGE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.pearl,

    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 16,
    alignItems: "center",
  },
  inputfieldContainer: {
    paddingLeft: 16,
    flex: 1,
    height: "100%",
  },
  lightContainer: {
    color: Colors.midnight,
    backgroundColor: Colors.porcelain,
  },
  darkContainer: {
    color: Colors.pearl,
    backgroundColor: Colors.midnight,
  },
  lightText: {
    height: "100%",
    color: Colors.midnight,
  },
  darkText: {
    height: "100%",
    color: Colors.pearl,
  },
});
