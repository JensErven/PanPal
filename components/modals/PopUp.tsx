import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Touchable,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";

const PopUp = ({
  icon,
  title,
  text,
  children,
  close,
}: {
  icon?: React.ReactNode;
  title: string;
  text: string;
  children?: React.ReactNode;
  close: () => void;
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.popup}
        colors={Colors.light.components.button.white.background}
        start={[0, 0]}
        end={[1, 1]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
          </View>

          <TouchableOpacity onPress={close}>
            <Ionicons name="close" size={hp(3)} color={Colors.darkBlue} />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>{text}</Text>
        {children}
      </LinearGradient>
    </View>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  iconContainer: {
    height: hp(ComponentParams.button.height.medium),
    width: hp(ComponentParams.button.height.medium),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondaryWhite,
    borderRadius: wp(ComponentParams.button.height.medium),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  container: {
    position: "absolute",
    zIndex: 50,
    width: wp(100),
    paddingHorizontal: wp(4),
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    elevation: 3,
    shadowColor: Colors.darkBlue,
    backgroundColor: Colors.white,
    width: "100%",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderRadius: wp(ComponentParams.button.height.large),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkBlue,
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
