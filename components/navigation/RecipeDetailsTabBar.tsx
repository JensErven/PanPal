import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";

const RecipeDetailsTabBar = ({
  displayContent = false,
  selectedTab,
  tabBarTitles,
  children,
  onPress,
}: {
  displayContent?: boolean;
  selectedTab: number;
  tabBarTitles: string[];
  children?: React.ReactNode;
  onPress: (index: number) => void;
}) => {
  return (
    <View style={styles.content}>
      <View style={styles.tabBarItemsContainer}>
        {tabBarTitles.map((title, index) => (
          <TouchableOpacity
            onPress={() => onPress(index)}
            key={title}
            style={[
              styles.tabBarItem,
              {
                elevation: selectedTab === index ? 2 : 0,
                shadowColor: Colors.darkBlue,
                backgroundColor:
                  selectedTab === index ? Colors.primarySkyBlue : "transparent",
                borderRadius: hp(ComponentParams.button.height.medium),
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text
              style={[
                styles.tabBarItemText,
                {
                  color:
                    selectedTab === index ? Colors.darkGrey : Colors.darkGrey,
                },
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {children && (
        <View style={{ gap: hp(4), display: displayContent ? "flex" : "none" }}>
          {children}
        </View>
      )}
    </View>
  );
};

export default RecipeDetailsTabBar;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    gap: hp(2),
  },
  tabBarItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(1),
    paddingVertical: wp(1),
    height: hp(ComponentParams.button.height.medium),
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.medium),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
  },
  tabBarItem: {
    height: "100%",
    width: "50%",
    alignItems: "center",
  },
  tabBarItemText: {
    color: Colors.darkBlue,
    fontSize: Fonts.text_1.fontSize,
    fontFamily: Fonts.text_1.fontFamily,
    lineHeight: Fonts.text_1.lineHeight,
  },
});
