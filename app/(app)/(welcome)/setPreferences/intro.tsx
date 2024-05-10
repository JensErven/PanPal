import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import StandardButton from "@/components/StandardButton";
import ComponentParams from "@/constants/ComponentParams";
import { router } from "expo-router";
import Fonts from "@/constants/Fonts";
import { blurhash } from "@/utils/common";

const setPreferencesIntro = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[
        Colors.light.navHeader[2],
        Colors.light.navHeader[1],
        Colors.light.navHeader[0],
      ]}
      start={[0, 0]}
      end={[1, 1]}
    >
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={[{ color: Colors.darkBlue }, styles.logoTitle]}>
            PanPal
          </Text>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("@/assets/images/panpal-icon-medium.png")}
          />
        </View>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.title}>Add Taste Profile</Text>
          </View>
          <Text style={styles.paragraph}>
            I'm not just about recipes - but about YOUR recipes. Tell me about
            your taste profile, your preferred cuisines, any allergies, or
            ingredients you don't like. This way, when I generates recipes for
            you, I will always cater to your preferences, ensuring you get the
            best recipes every time. Let's get started!
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <StandardButton
            textValue="Continue"
            height={ComponentParams.button.height.large}
            colors={[
              Colors.light.components.button.pink.background[0],
              Colors.light.components.button.pink.background[1],
            ]}
            borderColor={Colors.light.components.button.pink.border}
            textColor={Colors.light.components.button.pink.text}
            shadowColor={Colors.light.components.button.pink.dropShadow}
            clickHandler={() => {
              router.push("/setPreferences/");
            }}
          />
          <TouchableOpacity
            className="flex w-full items-center mt-5"
            onPress={() => {
              router.replace("/home");
            }}
          >
            <Text
              style={[
                styles.textSpan,
                { marginLeft: wp(1), color: Colors.dark.text },
              ]}
            >
              Remind me later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default setPreferencesIntro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: hp(10),
    paddingBottom: hp(5),
    paddingHorizontal: wp(9),
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    gap: hp(0.5),
    alignItems: "center",
  },
  logoTitle: {
    opacity: 0.25,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
  },
  logo: {
    height: hp(10),
  },
  title: {
    fontSize: Fonts.heading_2.fontSize,
    textAlign: "center",
    fontFamily: Fonts.heading_2.fontFamily,
    lineHeight: Fonts.heading_2.lineHeight,
    color: Colors.dark.text,
  },
  subTitle: {
    textTransform: "capitalize",
    lineHeight: Fonts.heading_3.lineHeight,
    fontSize: Fonts.heading_3.fontSize,
    textAlign: "center",
    fontFamily: Fonts.heading_3.fontFamily,
    color: Colors.dark.text,
  },
  paragraph: {
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    color: Colors.dark.text,
    textAlign: "left",
    lineHeight: Fonts.text_2.lineHeight,
  },
  textContainer: {
    marginTop: hp(5),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(2),
    marginBottom: hp(5),
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(1),
  },
  textSpan: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: Colors.white,
    fontFamily: "QuickSandSemiBold",
    fontSize: Fonts.text_3.fontSize,
  },
});
