import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "@/components/navigation/CustomHeader";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/context/authContext";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import { userService } from "@/services/db/user.services";
import RoundButton from "@/components/buttons/RoundButton";
import FullScreenLoading from "@/components/FullScreenLoading";
import EditProfileUsername from "@/components/edits/EditProfileUsername";
import EditProfileBio from "@/components/edits/EditProfileBio";

export type UserData = {
  email: string;
  username: string;
  profileUrl: string;
  bio: string;
};
const editProfileScreen = () => {
  const { user, setUser } = useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>(user.username || "");
  const [bio, setBio] = React.useState<string>(user.bio || "");
  const [profileUrl, setProfileUrl] = React.useState<string>(
    user.profileUrl || ""
  );

  const handleSubmitEditProfile = async () => {
    if (username.trim() === "" || bio.trim() === "") {
      Alert.alert("Edit Profile", "Please fill all the fields");
      return;
    }
    setIsLoading(true);

    const updatedUserData: UserData = {
      email: user.email,
      username: username.trim(),
      profileUrl: profileUrl.trim(),
      bio: bio.trim(),
    };

    const response = await userService.updateUser(user, updatedUserData);

    setIsLoading(false);

    if (!response.success) {
      Alert.alert("Error", response.message);
    } else {
      router.back();
    }
  };

  const headerChildren = () => {
    return (
      <RoundButton handlePress={handleSubmitEditProfile}>
        <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
      </RoundButton>
    );
  };

  // useEffect(() => {
  //   console.log("User", user);
  // }, [user]);

  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={Colors.light.navHeader}
      start={[0, 0]}
      end={[1, 0]}
    >
      <StatusBar style="light" />
      <CustomHeader
        isTransparent={true}
        headerTitle={"Edit Profile"}
        hasGoBack={true}
        children={headerChildren()}
      />
      <CustomKeyBoardView>
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, "#DDEBF3"]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          {isLoading ? (
            <FullScreenLoading />
          ) : (
            <View style={styles.content}>
              <View style={styles.contentItem}>
                <EditProfileUsername
                  username={username}
                  setUsername={setUsername}
                />
              </View>
              <View style={styles.contentItem}>
                <EditProfileBio bio={bio} setBio={setBio} />
              </View>
            </View>
          )}
        </LinearGradient>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default editProfileScreen;

const styles = StyleSheet.create({
  panPalCoinOuterContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: wp(0.5),
    position: "absolute",
    top: hp(2),
    right: hp(2),
  },
  panpalCreditsText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
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
  gradientBackground: {
    flex: 1,
  },
  contentItem: {
    gap: hp(1),
    borderRadius: hp(2),
  },
  container: {
    overflow: "hidden",
    flex: 1,
    minHeight: hp(100),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    gap: hp(4),
  },
  profileTopContainer: {
    marginTop: hp(1),
    gap: hp(2),
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  profileImageContainer: {
    flex: 1 / 2,
    aspectRatio: 1,

    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    aspectRatio: 1,
    width: "90%",
    borderRadius: hp(ComponentParams.button.height.small),
  },
  userName: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    textTransform: "capitalize",
  },
  contentCardContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    gap: hp(1),
  },
  inputLabel: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.light.text,
    lineHeight: Fonts.text_1.lineHeight,
  },
  generateImageButtonContainer: {
    flex: 1 / 2,
    aspectRatio: 1,
    height: wp(50),
    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 3,
  },
  inputGradientContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    // borderColor: Colors.white, // "#DDEBF3"
    // borderWidth: 1,
  },

  imageInputGradientContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    // borderColor: Colors.white, // "#DDEBF3"
    // borderWidth: 1,
  },
  input: {
    width: "100%",
    color: Colors.light.text,
    height: hp(ComponentParams.button.height.large),
    fontFamily: Fonts.text_2.fontFamily,
    flex: 1,
    fontSize: Fonts.text_2.fontSize,
    paddingHorizontal: wp(4),
  },
  textArea: {
    textAlignVertical: "top",
    paddingVertical: hp(2),
    width: "100%",
    color: Colors.light.text,
    height: "auto",
    fontFamily: Fonts.text_2.fontFamily,
    flex: 1,
    fontSize: Fonts.text_2.fontSize,
    paddingHorizontal: wp(4),
  },
  inputInfoLeftText: {
    color: Colors.light.text,
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
  },
  spanText: {
    color: Colors.light.text,
    lineHeight: Fonts.text_3.lineHeight,
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_3.fontSize,
  },
});
