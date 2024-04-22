import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import RoundButton from "@/components/shared/roundButton";

const Page = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  useState(false);
  const [showAddOptionButtons, setShowAddOptionButtons] = useState(false);

  // useEffect(() => {
  //   router.push("/(app)/(add)/customRecipe");
  // }, []);
  const handleButtonClick = (buttonId: string) => {
    console.log(`Button ${buttonId} clicked`); // Log the buttonId
    // Perform different actions based on buttonId
    if (buttonId === "generate") {
      setButtonClicked(!buttonClicked);
      router.push("/(app)/(generate)/generate");
      // Handle generate button click
      console.log("Generate button clicked");
    } else if (buttonId === "add") {
      // Handle add button click
      setShowAddOptionButtons(!showAddOptionButtons);
    } else if (buttonId === "custom recipe") {
      router.push("/(app)/(add)/customRecipe");
    } else if (buttonId === "browse recipe") {
      router.push("/(app)/(add)/browseRecipe");
    } else return;
  };
  return (
    <View style={styles.container}>
      <Text>Page</Text>
      <Link href={"/(app)/modal"}>
        <Text>Go to profile</Text>
      </Link>
      <View style={styles.roundedButtonContainer}>
        {!showAddOptionButtons && (
          <RoundButton
            size={50}
            buttonId="generate"
            onButtonClick={handleButtonClick}
            icon="color-wand-outline"
          />
        )}

        {showAddOptionButtons && (
          <>
            <RoundButton
              type="dependent"
              size={40}
              buttonId="custom recipe"
              onButtonClick={handleButtonClick}
              icon="pencil"
            />
            <RoundButton
              type="dependent"
              size={40}
              buttonId="browse recipe"
              onButtonClick={handleButtonClick}
              icon="globe"
            />
          </>
        )}
        <RoundButton
          rotation={showAddOptionButtons ? "45deg" : "0deg"}
          size={50}
          buttonId="add"
          onButtonClick={handleButtonClick}
          icon="add"
        />
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roundedButtonContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "column",
    gap: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
