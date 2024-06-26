import React, { useContext, useEffect, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TabBarItem } from "@/models/TabBarItem";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { usePlusButton } from "@/context/PlusButtonContext";

import { useActiveTab } from "@/context/activeTabContext";
import StandardButton from "../buttons/StandardButton";
import ComponentParams from "@/constants/ComponentParams";
import PlusButtonContentView from "./PlusButtonContentView";
import FloatingPanPalButton from "../buttons/FloatingPanPalButton";
import {
  GroceryListType,
  createGroceryList,
} from "@/services/db/groceries.services";
import { AuthContext } from "@/context/authContext";
import { Timestamp } from "firebase/firestore";

const CustomTabBar = ({ tabs }: { tabs: TabBarItem[] }) => {
  const { setActiveTab, activeTab } = useActiveTab();
  const { isPlusButtonPressed, setIsPlusButtonPressed } = usePlusButton();

  // animating values
  const rotation = useSharedValue(0);

  // function to handle tab press
  const handleTabPress = (index: number) => {
    router.navigate(tabs[index].routeName);
    setActiveTab(index);
  };

  // function to handle plus button press
  const handlePlusButtonPress = () => {
    setIsPlusButtonPressed((prev) => !prev);
    rotation.value = withSpring(isPlusButtonPressed ? 0 : 1, {
      damping: 10,
      stiffness: 100,
    });
  };

  useEffect(() => {
    rotation.value = withSpring(isPlusButtonPressed ? 1 : 0, {
      damping: 10,
      stiffness: 100,
    });
  }, [isPlusButtonPressed]);

  // animated styles
  const rotateCross = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value * 45}deg` },
        { scale: isPlusButtonPressed ? withSpring(1.5) : withSpring(1) },
      ],
    };
  });

  return (
    <>
      {isPlusButtonPressed && (
        <PlusButtonContentView
          activeTab={activeTab}
          closeContentView={() => setIsPlusButtonPressed(false)}
        />
      )}
      <FloatingPanPalButton />
      <LinearGradient
        style={styles.bottomGradient}
        colors={["transparent", Colors.secondaryWhite, Colors.primarySkyBlue]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      />
      <View style={[styles.container]}>
        <LinearGradient
          colors={Colors.light.components.button.purple.background}
          start={[0, 0]}
          end={[0.5, 1]}
          style={styles.plusButtonGradientcontainer}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.plusButton}
            onPress={handlePlusButtonPress}
          >
            <Animated.View style={rotateCross}>
              <Ionicons name="add" size={hp(3.5)} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <LinearGradient
              style={[
                styles.tabGradientContainer,
                activeTab === tab.index
                  ? {
                      borderColor:
                        Colors.light.components.button.purple.background[0],
                      borderWidth: 2,
                      backgroundColor:
                        Colors.light.components.button.purple.background[0],
                    }
                  : {
                      borderColor: Colors.primarySkyBlue,
                      borderWidth: 2,
                    },
                index === 1 ? { marginRight: wp(7) } : null,
                index === tabs.length - 2 ? { marginLeft: wp(7) } : null,
              ]}
              start={[0.5, 0]}
              end={[0.5, 1]}
              key={tab.index}
              colors={
                activeTab === tab.index
                  ? Colors.light.components.button.purple.background
                  : [Colors.white, Colors.primarySkyBlue]
              }
            >
              <TouchableOpacity
                key={tab.index}
                style={[styles.tab]}
                onPress={() => handleTabPress(tab.index)}
              >
                <Ionicons
                  name={tab.icon}
                  size={hp(3)}
                  color={
                    activeTab === tab.index ? Colors.white : Colors.darkGrey
                  }
                />
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: Colors.secondaryWhite,
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    height: hp(8),
    width: wp(100),
    zIndex: 50,
    elevation: 2,
    shadowColor: Colors.darkGrey,
    shadowOffset: { width: 0, height: 2 },
  },
  bottomGradient: {
    zIndex: 47,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: hp(12),
  },
  tabContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: hp(1),
    paddingVertical: hp(1),
    justifyContent: "space-between",
    width: "100%",
  },
  tabGradientContainer: {
    backgroundColor: Colors.primarySkyBlue,
    flex: 1,
    borderRadius: hp(4),
    overflow: "hidden",
    borderTopWidth: 0,
    borderLeftWidth: 1,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: hp(1.5),
  },
  plusButton: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(15),
    justifyContent: "center",
    alignItems: "center",
  },
  plusButtonGradientcontainer: {
    zIndex: 1,
    position: "absolute",
    bottom: hp(8) - wp(7.5),
    left: wp(42.5),
    width: wp(15),
    height: wp(15),
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
    borderRadius: wp(15),
    borderColor: Colors.light.components.button.purple.background[0],
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    backgroundColor: Colors.light.components.button.purple.background[0],
  },
  // plusButtonContent
});

export default CustomTabBar;
