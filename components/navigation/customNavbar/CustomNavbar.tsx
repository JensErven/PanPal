import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  SCREEN_WIDTH,
  NAVIGATION_BOTTOM_TABS_HEIGHT,
} from "@/constants/ScreenParams";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Tab } from "@/app/(app)/(tabs)/_layout";
import PanPalButtonRounded from "@/components/shared/panpal/PanPalButtonRounded";

const CustomNavbar = ({ tabs }: { tabs: Tab[] }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isPlusButtonPressed, setIsPlusButtonPressed] =
    useState<boolean>(false);
  const rotation = useSharedValue(0);

  const handleTabPress = (index: number) => {
    router.navigate(tabs[index].routeName);
    setActiveTab(index);
    setIsPlusButtonPressed(false);
    rotation.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });
  };

  const handlePlusButtonPress = () => {
    setIsPlusButtonPressed(!isPlusButtonPressed);
    rotation.value = withSpring(isPlusButtonPressed ? 0 : 1, {
      damping: 10,
      stiffness: 100,
    });
  };

  // animations
  const rotateCross = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value * 45}deg` },
        { scale: isPlusButtonPressed ? withSpring(1.5) : withSpring(1) },
      ],
    };
  });
  const extraButtonsContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: isPlusButtonPressed
        ? withTiming(1, { duration: 200 })
        : withTiming(0, { duration: 200 }),
      transform: [
        { translateY: isPlusButtonPressed ? withSpring(-50) : withSpring(0) },
        { scaleX: isPlusButtonPressed ? withSpring(1) : withSpring(0) },
      ],
    };
  });
  return (
    <View style={styles.container}>
      <View style={styles.panPalButtonContainer}>
        <PanPalButtonRounded />
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={[styles.plusButton]}
        onPress={() => handlePlusButtonPress()}
      >
        <Animated.View style={rotateCross}>
          <Ionicons name="add" size={28} color={"#ECF0F3"} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[styles.extraButtonsContainer, extraButtonsContainerStyle]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.extraButtonContainer}
          onPress={() => router.navigate("customRecipe")}
        >
          <View style={styles.extraButton}>
            <Ionicons name="rocket" size={24} color={"#F0F5F9"} />
          </View>
          <Text className="text-white">Add Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.extraButtonContainer}
          onPress={() => console.log("Extra Button 2 Pressed")}
        >
          <View style={styles.extraButton}>
            <Ionicons name="rocket" size={24} color={"#F0F5F9"} />
          </View>
          <Text className="text-white">Browse Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.extraButtonContainer}
          onPress={() => console.log("Extra Button 3 Pressed")}
        >
          <View style={styles.extraButton}>
            <Ionicons name="rocket" size={24} color={"#F0F5F9"} />
          </View>
          <Text className="text-white">Take picture</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.tabs}>
        <View style={styles.leftTabs}>
          {tabs.slice(0, 2).map((tab: Tab) => (
            <TouchableOpacity
              style={[
                styles.tabBarButton,
                activeTab === tab.index ? styles.pressedIn : styles.pressedOut,
              ]}
              activeOpacity={1}
              key={tab.index}
              onPress={() => handleTabPress(tab.index)}
            >
              <Ionicons
                name={tab.icon}
                size={28}
                color={activeTab === tab.index ? "#ECF0F3" : "#11263C"}
                style={{ opacity: activeTab === tab.index ? 1 : 0.5 }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.rightTabs}>
          {tabs.slice(2, 4).map((tab: Tab) => (
            <TouchableOpacity
              style={[
                styles.tabBarButton,
                activeTab === tab.index ? styles.pressedIn : styles.pressedOut,
              ]}
              activeOpacity={1}
              key={tab.index}
              onPress={() => handleTabPress(tab.index)}
            >
              <Ionicons
                name={tab.icon}
                size={28}
                color={activeTab === tab.index ? "#ECF0F3" : "#11263C"}
                style={{ opacity: activeTab === tab.index ? 1 : 0.5 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panPalButtonContainer: {
    position: "absolute",
    left: 15,
    bottom: NAVIGATION_BOTTOM_TABS_HEIGHT + 10,
    elevation: 5,
    zIndex: 1,
  },
  container: {
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: "#dde1e7",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  tabs: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SCREEN_WIDTH,
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
  },

  leftTabs: {
    flexDirection: "row",
    width: (SCREEN_WIDTH / 5) * 2,
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
    justifyContent: "flex-start",
    columnGap: 15,
    alignItems: "center",
  },
  rightTabs: {
    flexDirection: "row",
    width: (SCREEN_WIDTH / 5) * 2,
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
    justifyContent: "flex-end",
    columnGap: 15,
    alignItems: "center",
  },
  tabBarButton: {
    backgroundColor: "#dde1e7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 58,
    height: 58,
    borderRadius: 24,
    // Neumorphic styling
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  pressedIn: {
    // Neumorphic styling
    backgroundColor: "#11263C",
    shadowColor: "#ECF0F3",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ECF0F3",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 1,
  },
  pressedOut: {
    // Neumorphic styling
    backgroundColor: "#dde1e7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  extraButtonsContainer: {
    position: "absolute",
    rowGap: 10,
    width: SCREEN_WIDTH / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    paddingTop: 10,
    paddingBottom: 30,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 6,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    bottom: 30,
    backgroundColor: "#dde1e7",
    borderRadius: 30,
    paddingHorizontal: 10,
    // Neumorphic styling
  },
  plusButton: {
    position: "absolute",
    backgroundColor: "#11263C",
    width: 60,
    height: 60,
    borderRadius: 30,
    transform: [{ translateX: -30 }],
    left: "50%",
    bottom: 30,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ECF0F3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 1,
  },
  extraButton: {
    backgroundColor: "#52616B",
    opacity: 0.5,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    // Neumorphic styling
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  extraButtonContainer: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 5,
    columnGap: 5,
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#11263C",
    color: "#F0F5F9",
    borderRadius: 25,
    // Neumorphic styling
    shadowColor: "#52616B",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default CustomNavbar;
