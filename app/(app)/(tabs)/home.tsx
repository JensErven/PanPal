import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { router } from "expo-router";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeader from "@/components/navigation/CustomHeader";
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
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const { user } = useContext<any>(AuthContext);

  const customHeaderChildren = () => {
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
    <>
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
        <StatusBar style="light" />
        <CustomHeader
          isTransparent={true}
          hasGoBack={false}
          headerTitle={"Home"}
          children={customHeaderChildren()}
        />
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, "#DDEBF3"]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          {/* <LinearGradient
            style={styles.inputGradientContainer}
            colors={["#DDEBF3", "#DDEBF3"]}
            start={[0.5, 0]}
            end={[0.5, 1]}
          >
            <Ionicons
              name="search"
              size={hp(2.7)}
              style={{ width: hp(2.7), height: hp(2.7) }}
              color="#A0B7D6"
            />
            <TextInput
              onChangeText={(text) => setSearchInputValue(text)}
              value={searchInputValue}
              style={styles.input}
              placeholderTextColor="#A0B7D6"
              placeholder="search for recipes"
            />
          </LinearGradient> */}
          <CustomKeyBoardView>
            <View style={styles.content}></View>
          </CustomKeyBoardView>
        </LinearGradient>
      </LinearGradient>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    padding: wp(4),
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingVertical: hp(2),
    gap: hp(4),
  },
  inputGradientContainer: {
    gap: wp(2),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: hp(ComponentParams.button.height.large),
    paddingHorizontal: wp(4),
    borderRadius: hp(ComponentParams.button.height.large),

    // borderColor: Colors.white, // "#DDEBF3"
    // borderWidth: 1,
  },
  input: {
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    fontSize: Fonts.text_2.fontSize,
    flex: 1,
    color: Colors.light.text,
  },
  headerRightButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.small),
  },
  plusButtonContentContainer: {
    padding: wp(4),
    gap: hp(2),
  },
});
