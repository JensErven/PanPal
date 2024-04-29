import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useSession } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { Router, router } from "expo-router";
import ButtonStandard from "@/components/shared/ButtonStandard";
import Colors from "@/constants/Colors";
import { BORDER_RADIUS_SMALL } from "@/constants/ScreenParams";

const ProfileScreen = () => {
  const { signOut, session } = useSession();

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.titleText}>Jens Erven</Text>

      <View style={styles.preferencesContainer}>
        <Text style={styles.preferencesTitle}>
          Set up your Taste Profile. Get custom recipes.
        </Text>
        <Text>
          The foods you like. The flavors you don't. Save it to your Taste
          Profile, so PanPal can create really delicious recipes made just for
          you. Update it and change it anytime.
        </Text>
        <View>
          <ButtonStandard
            backgroundColor={Colors.midnight}
            title="Add A Preferences Profile"
            clicked={() => router.push("/(app)/profile/preferences")}
          />
        </View>
      </View>

      <ButtonStandard
        backgroundColor={Colors.terracotta}
        title="Sign Out"
        clicked={signOut}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "space-around",
    padding: 20,
    alignItems: "center",
  },
  preferencesContainer: {
    backgroundColor: Colors.pearl,
    display: "flex",
    rowGap: 16,
    borderRadius: BORDER_RADIUS_SMALL,
    padding: 16,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.pearl,

    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    backgroundColor: "blue",
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  signOutContainer: {
    width: "100%",
    columnGap: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    borderRadius: 10,
    backgroundColor: "red",
  },
  signOutText: {
    color: "white",
  },
});
