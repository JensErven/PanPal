import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Svg, { Path } from "react-native-svg";
import ComponentParams from "@/constants/ComponentParams";

const ios = Platform.OS === "ios";

const CustomHeader = ({
  hasBottomBorder = false,
  headerTitle,
  hasGoBack,
  isTransparent = false,
  children,
}: {
  hasBottomBorder?: boolean;
  headerTitle: string;
  hasGoBack: boolean;
  isTransparent?: boolean;
  children?: React.ReactNode;
}) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          paddingTop: ios ? top : top + 10,
          backgroundColor: isTransparent ? "transparent" : Colors.darkBlue,
          borderBottomWidth: hasBottomBorder ? wp(1) : 0,
        },
        styles.container,
      ]}
    >
      <View className="flex items-center justify-center flex-row gap-x-4">
        {hasGoBack && (
          <TouchableOpacity
            className="relative"
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={hp(3)} color={Colors.white} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>

      {children && (
        <>
          <View className="flex flex-row gap-x-2 justify-center items-center">
            {children}
          </View>
        </>
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: hp(3),
    color: "white",
    textTransform: "capitalize",
    fontFamily: "FredokaSemiBold",
  },
  image: {
    aspectRatio: 1,
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
  container: {
    borderColor: Colors.darkBlue,
    width: wp(100),
    height: hp(13),
    paddingHorizontal: wp(4),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: hp(2),
  },
});
