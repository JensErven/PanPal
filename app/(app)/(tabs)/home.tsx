import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeader from "@/components/CustomHeader";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { blurhash } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const { user } = useContext<any>(AuthContext);

  // const handleLogout = async () => {
  //   await storeUserTastePreferencesToFirebase(user.uid);
  //   await AsyncStorage.removeItem("userTastePreferences");
  //   await logout();
  // };

  const handleNavigateToRecipe = async (recipeId: string) => {
    router.push({ pathname: `/recipe/details/`, params: { recipeId } });
  };

  const tastPreferencesChildren = () => {
    return (
      <>
        {user && (
          <TouchableOpacity
            style={styles.headerRightButton}
            onPress={() => {
              router.push("/profile");
            }}
          >
            {user.profileUrl ? (
              <Image
                style={styles.profileImage}
                source={user.profileUrl ? user.profileUrl : blurhash}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
              />
            ) : (
              <Ionicons name="person" size={hp(2.7)} color={Colors.white} />
            )}
          </TouchableOpacity>
        )}
      </>
    );
  };
  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={[
        Colors.light.navHeader[0],
        Colors.light.navHeader[1],
        Colors.light.navHeader[2],
      ]}
      start={[0, 0]}
      end={[1, 0]}
    >
      <CustomHeader
        isTransparent={true}
        hasGoBack={false}
        headerTitle={"Home"}
        children={tastPreferencesChildren()}
      />
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <CustomKeyBoardView>
          <StatusBar style="light" />

          <View style={styles.content}></View>
        </CustomKeyBoardView>
      </LinearGradient>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    padding: wp(5),
    gap: hp(4),
  },
  headerRightButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    justifyContent: "center",
    alignItems: "center",
  },
  profileTopContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: hp(1.5),
  },
  profileImage: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.small),
  },
  userName: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.light.text,
  },
  userEmail: {
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.light.text,
  },
  tastePreferenceNoteContainer: {
    width: "100%",
    padding: hp(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 5,
  },
  tastePreferenceNoteContent: {
    width: "100%",
    gap: hp(2.5),
  },
  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_1.lineHeight,
  },
  subTitle: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkBlue,
  },
  titleContainer: {
    paddingLeft: hp(1),
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    display: "flex",
    gap: wp(1),
  },
  alertButtonContainer: {
    backgroundColor: Colors.darkBlue,
    borderRadius: hp(ComponentParams.button.height.small / 2),
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
  },
  panpalCreditsButtonContainer: {
    backgroundColor: Colors.light.components.button.gold.background[0], // Set the background color to represent a coin
    borderRadius: hp(ComponentParams.button.height.small / 2), // Rounded border
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // Border width
    borderColor: Colors.light.components.button.gold.border, // Border color
  },
  panpalCreditsText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.light.text,
  },
  panpalCreditsButtonText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    lineHeight: Fonts.text_3.lineHeight,
    color: Colors.darkGold,
  },
});
