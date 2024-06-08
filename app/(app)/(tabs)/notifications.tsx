import { View, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";

import { LinearGradient } from "expo-linear-gradient";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";

import CustomHeader from "@/components/navigation/CustomHeader";
import { StatusBar } from "expo-status-bar";
import UnderDevelopmentCard from "@/components/cards/UnderDevelopmentCard";
import RoundButton from "@/components/buttons/RoundButton";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import { Ionicons } from "@expo/vector-icons";

const NotificationsScreen = () => {
  const { user } = useAuth();

  const customHeaderChildren = () => {
    return (
      <>
        {user && (
          <RoundButton
            handlePress={() => {
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
          </RoundButton>
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
        headerTitle={"Notifications"}
        hasGoBack={false}
        children={customHeaderChildren()}
      />

      <CustomKeyBoardView>
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, Colors.white]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <StatusBar style="light" />

          <View style={styles.content}>
            <UnderDevelopmentCard featureName="notifications" />
          </View>
        </LinearGradient>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default NotificationsScreen;

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
    minHeight: hp(100),
  },
  content: {
    paddingVertical: hp(2),
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    gap: hp(4),
  },
  profileImage: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
});
