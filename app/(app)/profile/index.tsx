import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import CustomHeader from "@/components/navigation/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import ComponentParams from "@/constants/ComponentParams";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import Fonts from "@/constants/Fonts";
import StandardButton from "@/components/buttons/StandardButton";
import RoundButton from "@/components/buttons/RoundButton";
import CoinCount from "@/components/common/CoinCount";

const ProfileScreen = () => {
  const { user, logout, storeUserTastePreferencesToFirebase, credits } =
    useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBusinessModelOn, setIsBusinessModelOn] = useState<boolean>(false);
  const handleLogout = async () => {
    await storeUserTastePreferencesToFirebase(user.uid);
    await AsyncStorage.removeItem("userTastePreferences");
    await logout();
  };

  const headerChildren = () => {
    return (
      <>
        <RoundButton handlePress={() => router.push("/profile/edit")}>
          <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
        </RoundButton>
        <RoundButton handlePress={handleLogout}>
          <Ionicons name="log-out" size={hp(2.7)} color={Colors.white} />
        </RoundButton>
      </>
    );
  };
  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={Colors.light.navHeader}
      start={[0, 0]}
      end={[1, 0]}
    >
      <CustomHeader
        isTransparent={true}
        headerTitle={"Your Profile"}
        hasGoBack={true}
        children={headerChildren()}
      />
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <CustomKeyBoardView>
          {isLoading ? (
            <ActivityIndicator
              size={wp(15)}
              style={{ padding: wp(5) }}
              color={Colors.mediumBlue}
            />
          ) : (
            <View style={styles.content}>
              <View style={styles.profileTopContainer}>
                <LinearGradient
                  style={styles.profileImageContainer}
                  colors={[Colors.white, Colors.primarySkyBlue]}
                  start={[0.5, 0]}
                  end={[0.5, 1]}
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
                    <Ionicons
                      name="person"
                      size={hp(2.7 * 2)}
                      color={Colors.primarySkyBlue}
                    />
                  )}
                </LinearGradient>

                <View className="flex flex-col items-start h-full flex-1">
                  <Text style={styles.userName}>{user.username}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.titleContainer}>
                <View className="flex w-full justify-between flex-row">
                  <Text style={styles.title}>About Me</Text>
                </View>

                <Text style={styles.text}>
                  {user.bio ? user.bio : "No bio found."}
                </Text>
              </View>
              <View style={styles.contentItemcontainer}>
                <LinearGradient
                  style={styles.contentItemGradientContainer}
                  colors={[
                    Colors.white,
                    Colors.secondaryWhite,
                    Colors.primarySkyBlue,
                  ]}
                  start={[0, 0]}
                  end={[1, 1]}
                />

                <View style={styles.titleContainer}>
                  <View className="flex w-full justify-between flex-row">
                    <Text style={styles.title}>Your Taste Profile</Text>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "No Taste Profile",
                          "No taste profile found. Please update your taste profile."
                        );
                      }}
                      style={styles.alertButtonContainer}
                    >
                      <Ionicons
                        name="alert"
                        size={hp(2.7)}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.text}>
                    Your taste profile helps me generate recipes that cater to
                    your preferences. You can update your taste profile at any
                    time.
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <StandardButton
                    textValue="View Taste Profile"
                    height={ComponentParams.button.height.medium}
                    colors={Colors.light.components.button.purple.background}
                    borderColor={
                      Colors.light.components.button.purple.background[0]
                    }
                    textColor={Colors.white}
                    shadowColor={
                      Colors.light.components.button.white.dropShadow
                    }
                    clickHandler={() => {
                      router.push("/profile/taste-preferences/details");
                    }}
                  />
                </View>
              </View>
              <View style={styles.contentItemcontainer}>
                <LinearGradient
                  style={styles.contentItemGradientContainer}
                  colors={[
                    Colors.white,
                    Colors.secondaryWhite,
                    Colors.primarySkyBlue,
                  ]}
                  start={[0, 0]}
                  end={[1, 1]}
                />
                <View style={styles.titleContainer}>
                  <View className="flex w-full justify-between flex-row">
                    <Text style={styles.title}>Your PanPal Credits</Text>
                    <CoinCount
                      isTransparent={false}
                      count={credits.credits}
                      textColor={Colors.darkBlue}
                    />
                  </View>
                  {isBusinessModelOn ? (
                    <>
                      <Text style={styles.text}>
                        Every day, your PanPal credits are reset to 50, which
                        can be used for a variety of features such as generating
                        recipes, enhancing recipes, generating recipe images,
                        and more. In case your credits are fully used up, you
                        can either purchase more credits or wait for the next
                        day to receive additional credits.
                      </Text>
                      <View style={{ width: "100%" }}>
                        <StandardButton
                          textValue="Get PanPal Coins"
                          height={ComponentParams.button.height.medium}
                          colors={
                            Colors.light.components.button.gold.background
                          }
                          borderColor={Colors.darkGold}
                          textColor={Colors.light.text}
                          shadowColor={
                            Colors.light.components.button.white.dropShadow
                          }
                          clickHandler={handleLogout}
                        />
                      </View>
                    </>
                  ) : (
                    <Text style={styles.text}>
                      Every day, your PanPal credits are reset to 50, which can
                      be used for a variety of features such as generating
                      recipes, enhancing recipes, generating recipe images, and
                      more. In case your credits are fully used up, you can wait
                      for the next day to receive additional credits.
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.contentItemcontainer}>
                <LinearGradient
                  style={styles.contentItemGradientContainer}
                  colors={[
                    Colors.white,
                    Colors.secondaryWhite,
                    Colors.primarySkyBlue,
                  ]}
                  start={[0, 0]}
                  end={[1, 1]}
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Logout?</Text>
                  <Text style={styles.text}>
                    You can logout from your account at any time.
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <StandardButton
                    textValue="Logout"
                    height={ComponentParams.button.height.medium}
                    colors={Colors.light.components.button.white.background}
                    borderColor={Colors.light.components.button.white.border}
                    textColor={Colors.darkGrey}
                    shadowColor={
                      Colors.light.components.button.white.dropShadow
                    }
                    icon={
                      <Ionicons
                        name="log-out"
                        size={hp(2.7)}
                        color={Colors.darkGrey}
                      />
                    }
                    clickHandler={handleLogout}
                  />
                </View>
              </View>
            </View>
          )}
        </CustomKeyBoardView>
      </LinearGradient>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  titleContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  contentItemcontainer: {
    padding: wp(4),
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    backgroundColor: Colors.white,
    alignItems: "center",
    elevation: 10,
    shadowColor: Colors.cardDropShadow,
    flexDirection: "column",
    gap: hp(2),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  contentItemGradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingTop: hp(2),
    paddingBottom: hp(8),
    paddingHorizontal: wp(4),
    gap: hp(4),
  },
  profileTopContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: hp(1.5),
  },
  profileImageContainer: {
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.large / 2),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    aspectRatio: 1,
    width: hp(ComponentParams.button.height.large * 2),
    height: hp(ComponentParams.button.height.large * 2),
    elevation: 2,
    shadowColor: Colors.cardDropShadow,
  },
  profileImage: {
    backgroundColor: "transparent",
    width: "100%",
    aspectRatio: 1,
    borderRadius: hp(ComponentParams.button.height.large / 2),
  },
  userName: {
    flexWrap: "wrap",
    color: Colors.darkBlue,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    textTransform: "capitalize",
  },
  userEmail: {
    flexWrap: "wrap",
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkGrey,
  },
  userBioText: {
    flexWrap: "wrap",
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.light.text,
  },

  title: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  text: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
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
