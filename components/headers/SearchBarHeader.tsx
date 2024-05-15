import {
  View,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import { ScrollView } from "react-native-gesture-handler";

const ios = Platform.OS === "ios";
const SearchBarHeader = ({
  children,
  searchInputValue,
  setSearchInputValue,
}: {
  children?: React.ReactNode;
  searchInputValue: string;
  setSearchInputValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: ios ? top : top + 10,
          backgroundColor: "transparent",
        },
        styles.container,
      ]}
    >
      <View style={{ paddingHorizontal: wp(4) }}>
        <LinearGradient
          style={styles.inputGradientContainer}
          colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"]}
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
          {searchInputValue.length > 0 && (
            <TouchableOpacity
              style={styles.clearInputValueButton}
              onPress={() => setSearchInputValue("")}
            >
              <Ionicons
                name="close"
                size={hp(2.7)}
                style={{ width: hp(2.7), height: hp(2.7) }}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>

      <ScrollView
        style={{ paddingHorizontal: wp(4), width: "100%" }}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={true}
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default SearchBarHeader;

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.darkBlue,
    height: "auto",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingBottom: hp(1),
    gap: hp(1),
  },
  inputGradientContainer: {
    gap: wp(2),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: hp(ComponentParams.button.height.large),
    paddingLeft: wp(4),
    paddingRight: wp(1),
    borderRadius: hp(ComponentParams.button.height.large),

    // borderColor: Colors.white, // "#DDEBF3"
    // borderWidth: 1,
  },
  input: {
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
    fontSize: Fonts.text_2.fontSize,
    flex: 1,
    color: Colors.white,
  },
  clearInputValueButton: {
    height: hp(ComponentParams.button.height.medium),
    width: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
