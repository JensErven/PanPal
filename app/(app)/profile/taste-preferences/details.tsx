import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  SectionList,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

import CustomHeader from "@/components/navigation/CustomHeader";
import ComponentParams from "@/constants/ComponentParams";
import { useAuth } from "@/context/authContext";
import FullScreenLoading from "@/components/FullScreenLoading";
import { StatusBar } from "expo-status-bar";
import { updateTastePreferences } from "@/services/db/tastePreferences.services";
import TastePreferencesCard from "@/components/cards/TastePreferencesCard";

type contentType = {
  title: string;
  subTitle?: string;
  selectedPreferences: string[];
  isLoading: boolean;
};

const TastePreferencesScreen = () => {
  const { tastePreferences, user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (tastePreferences) {
      setIsLoading(false);
    }
  }, []);

  const contents: contentType[] = [
    {
      title: "Cuisine Types",
      subTitle: "Your favorite cuisines are...",
      selectedPreferences: tastePreferences.cuisineTypes,
      isLoading: isLoading,
    },
    {
      title: "Allergy Types",
      subTitle: "Your allergies are...",
      selectedPreferences: tastePreferences.allergyTypes,
      isLoading: isLoading,
    },
    {
      title: "Disliked Ingredients",
      subTitle: "Your disliked ingredients are...",
      selectedPreferences: tastePreferences.dislikedIngredients,
      isLoading: isLoading,
    },
    {
      title: "Diet Types",
      subTitle: "Your diet types are...",
      selectedPreferences: tastePreferences.dietTypes,
      isLoading: isLoading,
    },
  ];

  const handleDeletePreferences = async (title: string) => {
    if (!user) return;
    switch (title) {
      case "Cuisine Types":
        // remove all cuisine types but keep the other types the same
        await updateTastePreferences(user.userId, {
          cuisineTypes: [],
          allergyTypes: tastePreferences.allergyTypes,
          dislikedIngredients: tastePreferences.dislikedIngredients,
          dietTypes: tastePreferences.dietTypes,
        });
        break;
      case "Allergy Types":
        await updateTastePreferences(user.userId, {
          allergyTypes: [],
          cuisineTypes: tastePreferences.cuisineTypes,
          dislikedIngredients: tastePreferences.dislikedIngredients,
          dietTypes: tastePreferences.dietTypes,
        });
        break;
      case "Disliked Ingredients":
        await updateTastePreferences(user.userId, {
          dislikedIngredients: [],
          cuisineTypes: tastePreferences.cuisineTypes,
          allergyTypes: tastePreferences.allergyTypes,
          dietTypes: tastePreferences.dietTypes,
        });
        break;
      case "Diet Types":
        await updateTastePreferences(user.userId, {
          dietTypes: [],
          cuisineTypes: tastePreferences.cuisineTypes,
          allergyTypes: tastePreferences.allergyTypes,
          dislikedIngredients: tastePreferences.dislikedIngredients,
        });
        break;
    }
  };

  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={Colors.light.navHeader}
      start={[0, 0]}
      end={[1, 0]}
    >
      <StatusBar style="light" />
      <CustomHeader
        isTransparent={true}
        headerTitle={"Taste Profile"}
        hasGoBack={true}
      />
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <View style={styles.content}>
          {isLoading ? (
            <FullScreenLoading />
          ) : (
            <>
              <FlatList
                contentContainerStyle={{
                  paddingVertical: hp(2),
                  paddingHorizontal: wp(4),
                  gap: hp(2),
                }}
                data={contents}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                  <TastePreferencesCard
                    deletePreferences={handleDeletePreferences}
                    title={item.title}
                    subTitle={item.subTitle}
                    selectedPreferences={item.selectedPreferences}
                    isLoading={item.isLoading}
                  />
                )}
              />
            </>
          )}
        </View>
      </LinearGradient>
    </LinearGradient>
  );
};

export default TastePreferencesScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
  },
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
  },
});
