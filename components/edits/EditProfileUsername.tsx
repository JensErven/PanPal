import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

const EditProfileUsername = ({
  username,
  setUsername,
  maxCharAmount = 35,
}: {
  username: string;
  setUsername: (username: string) => void;
  maxCharAmount?: number;
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={styles.contentItemTitle}>Username</Text>
        <Text style={styles.text}>
          {username?.length || 0}/{maxCharAmount}
        </Text>
      </View>

      <LinearGradient
        colors={[Colors.primarySkyBlue, Colors.secondaryWhite]}
        style={styles.contentItemInput}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <TextInput
          maxLength={maxCharAmount}
          style={styles.textInput}
          value={username}
          placeholder="username"
          placeholderTextColor={"#A0B7D6"}
          onChangeText={(text: string) => {
            if (username !== undefined) setUsername(text);
          }}
        />
      </LinearGradient>
    </View>
  );
};

export default EditProfileUsername;

const styles = StyleSheet.create({
  contentItemInput: {
    flex: 1,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    borderRightColor: Colors.white,
    borderRightWidth: 1,
  },
  textInput: {
    width: "100%",
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),

    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemTitle: {
    color: Colors.darkGrey,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
  },
});
