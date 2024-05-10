import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TabBarItem } from "@/models/TabBarItem";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const CustomTabBar = ({ tabs }: { tabs: TabBarItem[] }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isPlusButtonPressed, setIsPlusButtonPressed] =
    useState<boolean>(false);
  const rotation = useSharedValue(0);
  const handleTabPress = (index: number) => {
    router.navigate(tabs[index].routeName);
    setActiveTab(index);
  };

  const handlePlusButtonPress = () => {
    setIsPlusButtonPressed(!isPlusButtonPressed);
    rotation.value = withSpring(isPlusButtonPressed ? 0 : 1, {
      damping: 10,
      stiffness: 100,
    });
  };
  const rotateCross = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value * 45}deg` },
        { scale: isPlusButtonPressed ? withSpring(1.5) : withSpring(1) },
      ],
    };
  });
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          Colors.light.components.button.purple.background[0],
          Colors.light.components.button.purple.background[1],
          Colors.light.components.button.purple.background[2],
        ]}
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
                    borderColor: Colors.light.components.button.white.border,
                    borderWidth: 2,
                    backgroundColor:
                      Colors.light.components.button.white.background[1],
                  },
              index === 1 ? { marginRight: wp(7) } : null,
              index === tabs.length - 2 ? { marginLeft: wp(7) } : null,
            ]}
            start={[0.5, 0]}
            end={[0.5, 1]}
            key={tab.index}
            colors={
              activeTab === tab.index
                ? [
                    Colors.light.components.button.purple.background[0],
                    Colors.light.components.button.purple.background[1],
                    Colors.light.components.button.purple.background[2],
                  ]
                : [
                    Colors.light.components.button.white.background[1],
                    Colors.light.components.button.white.background[0],
                  ]
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
                color={activeTab === tab.index ? Colors.white : "#A0B7D6"}
              />
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    height: hp(8),
    width: wp(100),
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
});

export default CustomTabBar;
