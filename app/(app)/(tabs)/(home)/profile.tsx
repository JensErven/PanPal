import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useSession } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { Router, router } from "expo-router";

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
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.navigate("/preferences")}
        >
          <Text style={styles.buttonText}>Add A Preferences Profile</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={signOut} style={styles.signOutContainer}>
        <Text style={styles.signOutText}>Sign Out</Text>
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity>
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
    rowGap: 10,
    padding: 25,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
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
