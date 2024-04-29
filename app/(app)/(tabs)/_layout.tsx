import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, router } from "expo-router";
import {
  Pressable,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import CustomNavbar from "@/components/navigation/customNavbar/CustomNavbar";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import HeaderStandard from "@/components/shared/HeaderStandard";

export type Tab = {
  index: number;
  routeName: string;
  title: string;
  icon: "home" | "notifications" | "bookmark" | "basket";
};

export default function TabLayout() {
  const tabs: Tab[] = [
    {
      index: 0,
      routeName: "(home)",
      title: "Home",
      icon: "home",
    },
    {
      index: 1,
      routeName: "saved",
      title: "Saved",
      icon: "bookmark",
    },
    {
      index: 2,
      routeName: "groceries",
      title: "Groceries",
      icon: "basket",
    },
    {
      index: 3,
      routeName: "notifications",
      title: "Notifications",
      icon: "notifications",
    },
  ];

  // ...

  const selectedTab = useSharedValue("(home)");

  return (
    <Tabs
      initialRouteName="(home)"
      tabBar={(props) => <CustomNavbar tabs={tabs} {...props} />}
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={28} color={color} />
          ),
          headerShown: true,
          header: () => (
            <HeaderStandard
              screenTitle={"Notifications"}
              hasGoBackButton={false}
            ></HeaderStandard>
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmark" size={28} color={color} />
          ),
          headerShown: true,
          header: () => (
            <HeaderStandard
              screenTitle={"Saved"}
              hasGoBackButton={false}
            ></HeaderStandard>
          ),
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: "Groceries",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" size={28} color={color} />
          ),
          headerShown: true,
          header: () => (
            <HeaderStandard
              screenTitle={"Groceries"}
              hasGoBackButton={false}
            ></HeaderStandard>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
