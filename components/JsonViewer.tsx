// Importing necessary modules
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Function to display JSON object in a formatted way
const JSONViewer = ({ data }: { data: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.jsonText}>{JSON.stringify(data, null, 2)}</Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 10,
  },
  jsonText: {
    fontFamily: "Courier New",
    fontSize: 12,
  },
});

export default JSONViewer;
