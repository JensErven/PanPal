import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "@/constants/ScreenParams";

const Generatelayout = () => {
  const screenTitle = "PanPal";
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,

          header: () => (
            <SafeAreaView style={styles.container}>
              <View style={styles.headerContainer}>
                <TouchableOpacity
                  style={styles.goBackButtonContainer}
                  activeOpacity={1}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={25} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">{screenTitle}</Text>
              </View>
              <View style={styles.creditsCounterContainer}>
                <Text className="font-bold text-md text-slate-800">
                  3 credits
                </Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
};

export default Generatelayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dde1e7",
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: SCREEN_WIDTH,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  headerContainer: {
    display: "flex",
    height: "auto",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
  },
  goBackButtonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
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
  creditsCounterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    height: 48,
    borderRadius: 24,
    backgroundColor: "lightblue",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    columnGap: 5,
    paddingHorizontal: 10,
  },
});
