import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext } from "react";

import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/context/authContext";
import { router } from "expo-router";
import ComponentParams from "@/constants/ComponentParams";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { blurhash } from "@/utils/common";
import Fonts from "@/constants/Fonts";
import StandardButton from "@/components/StandardButton";

const ProfileScreen = () => {
  const { user, logout, storeUserTastePreferencesToFirebase } =
    useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isBusinessModelOn, setIsBusinessModelOn] =
    React.useState<boolean>(false);
  const handleLogout = async () => {
    await storeUserTastePreferencesToFirebase(user.uid);
    await AsyncStorage.removeItem("userTastePreferences");
    await logout();
  };

  const tastPreferencesChildren = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={() => router.push("/profile/edit")}
        >
          <Ionicons name="pencil" size={hp(2.7)} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={hp(2.7)} color={Colors.white} />
        </TouchableOpacity>
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
        headerTitle={"Your Profile"}
        hasGoBack={true}
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
                  colors={[Colors.white, "#DDEBF3"]}
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
                      color={Colors.darkBlue}
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

                <Text style={styles.subTitle}>
                  {user.bio ? user.bio : "No bio found."}
                </Text>
              </View>

              <LinearGradient
                style={styles.tastePreferenceNoteContainer}
                colors={[Colors.white, Colors.white, Colors.secondaryWhite]}
                start={[0.5, 0]}
                end={[0.5, 1]}
              >
                <View style={styles.tastePreferenceNoteContent}>
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

                    <Text style={styles.subTitle}>
                      Your taste profile helps me generate recipes that cater to
                      your preferences. You can update your taste profile at any
                      time.
                    </Text>
                  </View>
                  <View style={{ width: "100%" }}>
                    <StandardButton
                      textValue="View Taste Profile"
                      height={ComponentParams.button.height.medium}
                      colors={[
                        Colors.light.components.button.purple.background[0],
                        Colors.light.components.button.purple.background[1],
                        Colors.light.components.button.purple.background[2],
                      ]}
                      borderColor={
                        Colors.light.components.button.purple.background[0]
                      }
                      textColor={Colors.white}
                      shadowColor={
                        Colors.light.components.button.white.dropShadow
                      }
                      clickHandler={() => {
                        router.push("/profile/tastePreferences");
                      }}
                    />
                  </View>
                </View>
              </LinearGradient>
              <LinearGradient
                style={styles.tastePreferenceNoteContainer}
                colors={[Colors.white, Colors.white, Colors.secondaryWhite]}
                start={[0.5, 0]}
                end={[0.5, 1]}
              >
                <View style={styles.tastePreferenceNoteContent}>
                  <View style={styles.titleContainer}>
                    <View className="flex w-full justify-between flex-row">
                      <Text style={styles.title}>Your PanPal Coins</Text>
                      <View className="flex flex-row gap-x-1 justify-center items-center">
                        <Text style={styles.panpalCreditsText}>15</Text>
                        <LinearGradient
                          style={styles.panpalCreditsButtonContainer}
                          colors={[
                            Colors.light.components.button.gold.background[0],
                            Colors.light.components.button.gold.background[1],
                          ]}
                          start={[0.5, 0]}
                          end={[0.5, 1]}
                        >
                          <Text style={styles.panpalCreditsButtonText}>pp</Text>
                        </LinearGradient>
                      </View>
                    </View>
                    {isBusinessModelOn ? (
                      <>
                        <Text style={styles.subTitle}>
                          Every day, your PanPal coins are reset to 15, which
                          can be used for a variety of features such as
                          generating recipes, enhancing recipes, generating
                          recipe images, and more. In case your coins are fully
                          used up, you can either purchase more coins or wait
                          for the next day to receive additional coins.
                        </Text>
                        <View style={{ width: "100%" }}>
                          <StandardButton
                            textValue="Get PanPal Coins"
                            height={ComponentParams.button.height.medium}
                            colors={[
                              Colors.light.components.button.gold.background[0],
                              Colors.light.components.button.gold.background[1],
                            ]}
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
                      <Text style={styles.subTitle}>
                        Every day, your PanPal coins are reset to 15, which can
                        be used for a variety of features such as generating
                        recipes, enhancing recipes, generating recipe images,
                        and more. In case your coins are fully used up, you can
                        wait for the next day to receive additional coins.
                      </Text>
                    )}
                  </View>
                </View>
              </LinearGradient>
              <LinearGradient
                style={styles.tastePreferenceNoteContainer}
                colors={[Colors.white, Colors.secondaryWhite]}
                start={[0.5, 0]}
                end={[0.5, 1]}
              >
                <View style={styles.tastePreferenceNoteContent}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Logout?</Text>
                    <Text style={styles.subTitle}>
                      You can logout from your account at any time.
                    </Text>
                  </View>
                  <View style={{ width: "100%" }}>
                    <StandardButton
                      textValue="Logout"
                      height={ComponentParams.button.height.medium}
                      colors={[
                        Colors.light.components.button.white.background[1],
                        Colors.light.components.button.white.background[0],
                      ]}
                      borderColor={Colors.light.components.button.white.border}
                      textColor={Colors.light.components.button.white.text}
                      shadowColor={
                        Colors.light.components.button.white.dropShadow
                      }
                      icon={
                        <Ionicons
                          name="log-out"
                          size={hp(2.7)}
                          color={Colors.light.components.button.white.text}
                        />
                      }
                      clickHandler={handleLogout}
                    />
                  </View>
                </View>
              </LinearGradient>
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
    padding: wp(4),
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
  profileImageContainer: {
    aspectRatio: 1,
    width: wp(25),
    height: wp(25),
    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    aspectRatio: 1,
    width: wp(23),
    height: wp(23),
    borderRadius: hp(ComponentParams.button.height.small),
  },
  userName: {
    flexWrap: "wrap",
    color: Colors.light.text,
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
    color: Colors.light.text,
  },
  userBioText: {
    flexWrap: "wrap",
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
    elevation: 3,
    shadowColor: Colors.darkBlue,
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
    marginBottom: hp(1),
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
