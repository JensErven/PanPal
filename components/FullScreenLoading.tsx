import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";

const FullScreenLoading = () => {
  return (
    <View style={{ flex: 1, height: hp(100), justifyContent: "center" }}>
      <ActivityIndicator
        size={wp(25)}
        style={{ padding: wp(5) }}
        color={Colors.primarySkyBlue}
      />
    </View>
  );
};

export default FullScreenLoading;
