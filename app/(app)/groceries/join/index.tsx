import { View, ToastAndroid, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import FullScreenLoading from "@/components/FullScreenLoading";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import CustomHeader from "@/components/navigation/CustomHeader";
import RoundButton from "@/components/buttons/RoundButton";
import { Ionicons } from "@expo/vector-icons";
import { joinGroceryList } from "@/services/db/groceries.services";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import StandardButton from "@/components/buttons/StandardButton";
import Fonts from "@/constants/Fonts";

const GroceryListAddScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groceryListSharedCode, setGroceryListSharedCode] =
    useState<string>("");
  const { user } = useAuth();

  const handleJoinGroceryList = async (groceryListName: string) => {
    if (!user) return;
    if (!setGroceryListSharedCode || groceryListSharedCode === "") {
      ToastAndroid.show(
        "Please enter a shared code for the grocery list",
        ToastAndroid.SHORT
      );
      return;
    }

    await joinGroceryList(groceryListSharedCode, user.userId)
      .then((res) => {
        console.log("Joined GroceryList: ", res);
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        router.back();
      })
      .catch((err) => {
        console.log("Error: ", err);
        ToastAndroid.show("Failed to join grocery list", ToastAndroid.SHORT);
      });
  };

  const headerChildren = () => {
    return (
      <RoundButton
        handlePress={() => handleJoinGroceryList(groceryListSharedCode.trim())}
      >
        <Ionicons name="enter" size={hp(2.7)} color={Colors.white} />
      </RoundButton>
    );
  };

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
        hasGoBack={true}
        headerTitle={"Join Grocery List"}
        children={headerChildren()}
      />
      <View
        style={{
          position: "absolute",
          bottom: hp(2),
          right: wp(4),
          zIndex: 1000,
        }}
      ></View>
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <CustomKeyBoardView>
            <View style={styles.content}>
              <View style={{ flexDirection: "column", gap: hp(2) }}>
                <View style={styles.contentItem}>
                  <View style={styles.contentItemInputContainer}>
                    <Ionicons
                      name="code-outline"
                      size={hp(2.7)}
                      color={"#A0B7D6"}
                    />
                    <TextInput
                      value={groceryListSharedCode}
                      onChangeText={setGroceryListSharedCode}
                      style={styles.contentItemInput}
                      placeholder="Enter shared code"
                      placeholderTextColor={"#A0B7D6"}
                    />
                    {groceryListSharedCode.length > 0 && (
                      <View style={styles.clearButton}>
                        <RoundButton
                          height={ComponentParams.button.height.small}
                          transparent={false}
                          backgroundColor={Colors.primarySkyBlue}
                          handlePress={() => setGroceryListSharedCode("")}
                        >
                          <Ionicons
                            name="close"
                            size={hp(2.7)}
                            color={Colors.darkGrey}
                          />
                        </RoundButton>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <StandardButton
                iconRight={
                  <RoundButton
                    height={ComponentParams.button.height.medium}
                    transparent={true}
                    children={
                      <Ionicons
                        name="enter"
                        size={hp(2.7)}
                        color={Colors.white}
                      />
                    }
                    handlePress={() =>
                      handleJoinGroceryList(groceryListSharedCode.trim())
                    }
                  />
                }
                textValue="Join"
                clickHandler={() =>
                  handleJoinGroceryList(groceryListSharedCode.trim())
                }
                colors={Colors.light.components.button.purple.background}
                textColor={Colors.white}
                height={ComponentParams.button.height.medium}
              />
            </View>
          </CustomKeyBoardView>
        )}
      </LinearGradient>
    </LinearGradient>
  );
};

export default GroceryListAddScreen;

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
    flexDirection: "column",
    justifyContent: "space-between",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    padding: wp(4),
    gap: hp(2),
    paddingBottom: hp(2),
  },
  contentItemInput: {
    height: hp(ComponentParams.button.height.large),
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemInputContainer: {
    backgroundColor: Colors.secondaryWhite,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: hp(ComponentParams.button.height.large),
    borderRadius: hp(ComponentParams.button.height.large),
    paddingRight: wp(1),
    paddingLeft: wp(4),
    gap: wp(2),
  },
  clearButton: {
    marginRight: wp(2),
  },
  contentItem: {
    gap: hp(1),
    borderRadius: hp(2),
  },
  inputLabel: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  suggestionsListContainer: {
    flexWrap: "wrap",
    flex: 1,
    gap: hp(1),
    flexDirection: "row",
  },
});
