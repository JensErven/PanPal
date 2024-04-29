import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  SCREEN_WIDTH,
  NAVIGATION_BOTTOM_TABS_HEIGHT,
  ICON_SIZE_MEDIUM,
  ICON_SIZE_SMALL,
  BUTTON_HEIGHT_MEDIUM,
  BUTTON_HEIGHT_LARGE,
  BORDER_RADIUS_MEDIUM,
  BORDER_RADIUS_SMALL,
  ICON_SIZE_LARGE,
  BUTTON_HEIGHT_SMALL,
  BORDER_RADIUS_LARGE,
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
import Colors from "@/constants/Colors";

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
          <Ionicons name="add" size={ICON_SIZE_LARGE} color={Colors.pearl} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[styles.extraButtonsContainer, extraButtonsContainerStyle]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.extraButtonContainer}
          onPress={() => router.navigate("add/customRecipe")}
        >
          <View style={styles.extraButtonIconContainer}>
            <Ionicons
              name="rocket"
              size={ICON_SIZE_SMALL}
              color={Colors.frost}
            />
          </View>
          <Text className="text-white">Add Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.extraButtonContainer}
          onPress={() => console.log("Extra Button 2 Pressed")}
        >
          <View style={styles.extraButtonIconContainer}>
            <Ionicons
              name="rocket"
              size={ICON_SIZE_SMALL}
              color={Colors.frost}
            />
          </View>
          <Text className="text-white">Browse Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.extraButtonContainer}
          onPress={() => console.log("Extra Button 3 Pressed")}
        >
          <View style={styles.extraButtonIconContainer}>
            <Ionicons
              name="rocket"
              size={ICON_SIZE_SMALL}
              color={Colors.frost}
            />
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
                size={ICON_SIZE_MEDIUM}
                color={activeTab === tab.index ? Colors.slate : Colors.steel}
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
                size={ICON_SIZE_MEDIUM}
                color={activeTab === tab.index ? Colors.slate : Colors.steel}
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
    left: 16,
    bottom: NAVIGATION_BOTTOM_TABS_HEIGHT + 16,
    elevation: 5,
    zIndex: 1,
  },
  container: {
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.pearl,
    borderTopLeftRadius: BORDER_RADIUS_MEDIUM,
    borderTopRightRadius: BORDER_RADIUS_MEDIUM,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabs: {
    paddingHorizontal: 16,
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
    columnGap: 8,
    alignItems: "center",
  },
  rightTabs: {
    flexDirection: "row",
    width: (SCREEN_WIDTH / 5) * 2,
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
    justifyContent: "flex-end",
    columnGap: 8,
    alignItems: "center",
  },
  tabBarButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_HEIGHT_LARGE,
    height: BUTTON_HEIGHT_MEDIUM,
    borderRadius: BORDER_RADIUS_LARGE / 2,
  },
  pressedIn: {
    backgroundColor: Colors.porcelain,
    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 1,
  },
  pressedOut: {
    shadowColor: Colors.midnight,
    backgroundColor: Colors.pearl,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 2,
  },
  extraButtonsContainer: {
    position: "absolute",
    rowGap: 8,
    width: SCREEN_WIDTH / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    paddingTop: 8,
    paddingBottom: 24,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 6,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    bottom: 32,
    backgroundColor: Colors.porcelain,
    borderRadius: 30,
    paddingHorizontal: 10,
    // Neumorphic styling
  },
  plusButton: {
    position: "absolute",
    backgroundColor: Colors.midnight,
    width: BUTTON_HEIGHT_LARGE,
    height: BUTTON_HEIGHT_LARGE,
    borderRadius: BUTTON_HEIGHT_LARGE / 2,
    transform: [{ translateX: -BUTTON_HEIGHT_LARGE / 2 }],
    left: "50%",
    bottom: NAVIGATION_BOTTOM_TABS_HEIGHT / 2,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.porcelain,
    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 1,
  },
  extraButtonIconContainer: {
    backgroundColor: Colors.slate,
    width: BUTTON_HEIGHT_SMALL,
    height: BUTTON_HEIGHT_SMALL,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.midnight,
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
    height: BUTTON_HEIGHT_MEDIUM,
    backgroundColor: Colors.midnight,
    borderRadius: BORDER_RADIUS_LARGE,
    shadowColor: Colors.slate,
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
