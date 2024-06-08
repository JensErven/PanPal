import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import Fonts from "@/constants/Fonts";
import { AuthContext, useAuth } from "@/context/authContext";
import StandardButton from "@/components/buttons/StandardButton";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
const WelcomeScreen = () => {
  const { user } = useAuth();
  // Define animated values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Start animation when component mounts
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
  }, []);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

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
            <Text style={styles.title}> Welcome to PanPal!</Text>
            {user.username && (
              <View style={styles.subTitleContainer}>
                <Animated.Text style={[styles.subTitle, animatedStyle]}>
                  {user.username}
                </Animated.Text>
              </View>
            )}
          </View>

          <Text style={styles.paragraph}>
            Get ready to discover delicious recipes, handy cooking tips, and
            join a vibrant culinary community. But wait, there's more! Let's
            cook up something amazing together! 🎉🍳
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
              router.replace("/setPreferences/intro");
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
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default WelcomeScreen;

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
  subTitleContainer: {
    display: "flex",
    justifyContent: "center",
    lineHeight: Fonts.heading_3.lineHeight,
    alignItems: "center",
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
