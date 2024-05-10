import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const DetailsRecipe = () => {
  const { recipeId } = useLocalSearchParams();

  return (
    <View>
      <Text>{recipeId}</Text>
    </View>
  );
};

export default DetailsRecipe;
