import { View, StyleSheet, Text } from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import RoundButton from "@/components/buttons/RoundButton";
import { AuthContext } from "@/context/authContext";
import { router } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";
import { Ionicons } from "@expo/vector-icons";
import FullScreenLoading from "@/components/FullScreenLoading";
import { useGroceries } from "@/context/GroceriesContext";
import {
  GroceryListType,
  createGroceryList,
} from "@/services/db/groceries.services";
import GroceryListCard from "@/components/cards/groceries/GroceryListCard";
import { Timestamp } from "firebase/firestore";
import Fonts from "@/constants/Fonts";
import StandardButton from "@/components/buttons/StandardButton";

const GroceriesScreen = () => {
  const { user } = useContext<any>(AuthContext);
  const { isLoading, groceryLists } = useGroceries();

  const sortedGroceryLists = useMemo(() => {
    return groceryLists.sort((a, b) => {
      if (!b.createdAt) return 0;
      if (!a.createdAt) return 0;
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    });
  }, [groceryLists]);

  const customHeaderChildren = () => {
    return (
      <>
        {/* {user && (
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
        )} */}
      </>
    );
  };

  const handleNavigateToCreateGroceryList = async () => {
    router.push("/groceries/add");
  };

  const handleJoinGroceryList = async () => {
    router.push("/groceries/join");
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
        hasGoBack={false}
        headerTitle={"Grocery Lists"}
        children={customHeaderChildren()}
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
              {sortedGroceryLists.length === 0 ? (
                <>
                  <Text style={styles.noContentText}>
                    No grocery lists found
                  </Text>
                  <StandardButton
                    isDisabled={isLoading}
                    clickHandler={() => handleNavigateToCreateGroceryList()}
                    textValue="Create grocery list"
                    colors={[Colors.primarySkyBlue, Colors.primarySkyBlue]}
                    height={ComponentParams.button.height.medium}
                    borderColor="transparent"
                    textColor={Colors.darkGrey}
                    iconRight={
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: hp(ComponentParams.button.height.small),
                          aspectRatio: 1,
                          borderRadius: hp(ComponentParams.button.height.small),
                          marginRight: wp(2),
                        }}
                      >
                        <Ionicons
                          name="add"
                          size={hp(3.2)}
                          color={Colors.darkGrey}
                        />
                      </View>
                    }
                  />
                  <StandardButton
                    isDisabled={isLoading}
                    clickHandler={() => handleJoinGroceryList()}
                    textValue="Join grocery list"
                    colors={[Colors.primarySkyBlue, Colors.primarySkyBlue]}
                    height={ComponentParams.button.height.medium}
                    borderColor="transparent"
                    textColor={Colors.darkGrey}
                    iconRight={
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: hp(ComponentParams.button.height.small),
                          aspectRatio: 1,
                          borderRadius: hp(ComponentParams.button.height.small),
                          marginRight: wp(2),
                        }}
                      >
                        <Ionicons
                          name="enter"
                          size={hp(3.2)}
                          color={Colors.darkGrey}
                        />
                      </View>
                    }
                  />
                </>
              ) : (
                <>
                  {sortedGroceryLists.map((groceryList) => (
                    <GroceryListCard
                      key={groceryList.id}
                      groceryList={groceryList}
                    />
                  ))}
                </>
              )}
            </View>
          </CustomKeyBoardView>
        )}
      </LinearGradient>
    </LinearGradient>
  );
};

export default GroceriesScreen;

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
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    padding: wp(4),
    gap: hp(2),
    paddingBottom: hp(14),
  },
  profileImage: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  noContentText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlign: "center",
  },
});
