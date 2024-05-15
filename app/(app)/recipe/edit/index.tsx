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

const AddCustomRecipeScreen = () => {
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
        headerTitle={"Edit Recipe"}
        hasGoBack={true}
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
            <UnderDevelopmentCard />
          </View>
        </LinearGradient>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default AddCustomRecipeScreen;

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
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    gap: hp(4),
  },
});
