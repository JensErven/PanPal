import { StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import CustomTabBar from "@/components/navigation/CustomTabBar";
import { TabBarItem } from "@/models/TabBarItem";

const tabs: TabBarItem[] = [
  {
    index: 0,
    routeName: "home",
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
const _layout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: true }}
      tabBar={(props) => <CustomTabBar tabs={tabs} {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
});
