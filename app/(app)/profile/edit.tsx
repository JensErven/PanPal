import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import React, { useContext, useMemo } from "react";
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
import { blurhash } from "@/utils/common";
import { userService } from "@/services/db/user.services";

export type UserData = {
  email: string;
  username: string;
  profileUrl: string;
  bio: string;
};
const editProfileScreen = () => {
  const { user, setUser } = useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] =
    React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>(
    user.username as string
  );
  const [profileUrl, setProfileUrl] = React.useState<string>(
    user.profileUrl as string
  );
  const [bio, setBio] = React.useState<string>(user.bio || ""); // Initialize with an empty string if user.bio is undefined
  const bioMaxCharCounter = useMemo(() => {
    return 200 - bio.length;
  }, [bio]);
  const handleSubmitEditProfile = async () => {
    if (!username) {
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
    const response = await userService.updateUser(
      user,
      updatedUserData,
      setUser
    );
    setIsLoading(false);

    if (!response.success) {
      Alert.alert("Error", response.message);
    } else {
      router.back();
    }
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    setTimeout(() => {
      setIsGeneratingImage(false);
    }, 5000);
  };

  const tastPreferencesChildren = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={handleSubmitEditProfile}
        >
          <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
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
        headerTitle={"Edit Profile"}
        hasGoBack={true}
        children={tastPreferencesChildren()}
      />
      <CustomKeyBoardView>
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, "#DDEBF3"]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <StatusBar style="light" />
          {isLoading ? (
            <ActivityIndicator
              size={wp(15)}
              style={{ padding: wp(5) }}
              color={Colors.mediumBlue}
            />
          ) : (
            <View style={styles.content}>
              <View style={styles.contentCardContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <LinearGradient
                  style={styles.inputGradientContainer}
                  colors={["#DDEBF3", "#DDEBF3"]}
                  start={[0.5, 0]}
                  end={[0.5, 1]}
                >
                  <TextInput
                    editable={!isLoading}
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    style={styles.input}
                    placeholderTextColor="#A0B7D6"
                    placeholder="Add your username"
                  />
                </LinearGradient>
              </View>

              <View style={styles.contentCardContainer}>
                <View className="flex flex-row justify-between items-center w-full">
                  <Text style={styles.inputLabel}>Bio</Text>
                  <Text style={styles.spanText}>{bioMaxCharCounter}</Text>
                </View>

                <LinearGradient
                  style={styles.inputGradientContainer}
                  colors={["#DDEBF3", "#DDEBF3"]}
                  start={[0.5, 0]}
                  end={[0.5, 1]}
                >
                  <TextInput
                    maxLength={200}
                    multiline={true}
                    numberOfLines={4}
                    editable={!isLoading}
                    autoCorrect={true}
                    onChangeText={(text) => setBio(text)}
                    value={bio}
                    style={styles.textArea}
                    placeholderTextColor="#A0B7D6"
                    placeholder="About yourself"
                  />
                </LinearGradient>
              </View>
              <View style={styles.contentCardContainer}>
                <Text style={styles.inputLabel}>Profile Image</Text>
                <LinearGradient
                  style={styles.imageInputGradientContainer}
                  colors={["#DDEBF3", "#DDEBF3"]}
                  start={[0.5, 0]}
                  end={[0.5, 1]}
                >
                  <View
                    style={{
                      paddingHorizontal: wp(4),
                      backgroundColor: Colors.white,
                      height: hp(ComponentParams.button.height.large),
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderTopLeftRadius: hp(
                        ComponentParams.button.height.small
                      ),
                      borderBottomLeftRadius: hp(
                        ComponentParams.button.height.small
                      ),
                      borderRightWidth: 1,
                      borderRightColor: "#DDEBF3",
                    }}
                  >
                    <Text style={styles.inputInfoLeftText}>Url</Text>
                  </View>
                  <TextInput
                    editable={!isLoading}
                    onChangeText={(text) => setProfileUrl(text)}
                    value={profileUrl}
                    style={styles.input}
                    placeholderTextColor="#A0B7D6"
                    placeholder="Add your username"
                  />
                </LinearGradient>

                <View style={styles.profileTopContainer}>
                  <LinearGradient
                    style={styles.profileImageContainer}
                    colors={[Colors.white, "#DDEBF3"]}
                    start={[0.5, 0]}
                    end={[0.5, 1]}
                  >
                    {isGeneratingImage ? (
                      <ActivityIndicator
                        size={wp(15)}
                        style={{ padding: wp(5) }}
                        color={Colors.mediumBlue}
                      />
                    ) : (
                      <>
                        {user.profileUrl ? (
                          <Image
                            style={styles.profileImage}
                            source={profileUrl ? profileUrl : blurhash}
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
                      </>
                    )}
                  </LinearGradient>

                  <LinearGradient
                    style={styles.generateImageButtonContainer}
                    colors={[Colors.white, "#DDEBF3"]}
                    start={[0.5, 0]}
                    end={[0.5, 1]}
                  >
                    <TouchableOpacity
                      disabled={isGeneratingImage}
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={handleGenerateImage}
                    >
                      <Ionicons
                        name="sparkles"
                        size={hp(2.7 * 2)}
                        color={Colors.darkBlue}
                      />
                      <Text style={styles.inputLabel}>
                        {isGeneratingImage ? "Generating..." : "Generate"}
                      </Text>
                      <View
                        className="flex flex-row gap-x-1 justify-center items-center"
                        style={styles.panPalCoinOuterContainer}
                      >
                        <Text style={styles.panpalCreditsText}></Text>
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
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
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
  container: {
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
    minHeight: hp(100),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
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
