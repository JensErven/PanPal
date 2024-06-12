import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import StandardButton from "@/components/buttons/StandardButton";
import ComponentParams from "@/constants/ComponentParams";
import { router } from "expo-router";
import Fonts from "@/constants/Fonts";
import CircularProgress from "@/components/CircularProgress";
import PreferencesSelectCard from "@/components/cards/PreferencesSelectCard";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { allergyTypes } from "@/constants/tastePreferences/AllergyTypes";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { dislikedIngredientTypes } from "@/constants/tastePreferences/DislikedIngredientTypes";
import { preferenceType } from "@/models/PreferenceType";
import { preferenceOption } from "@/models/PreferenceOption";
import AsyncStorage from "@react-native-async-storage/async-storage";

const setPreferencesStep1 = () => {
  const [step, setStep] = React.useState<number>(0);
  const [contentSteps, setContentSteps] = React.useState<preferenceType[]>([
    {
      title: "Any Allergies?",
      searchInputPlaceholder: "search allergies...",
      addInputPlaceholder: "add other allergies...",
      options: allergyTypes,
      selectedOptions: [],
    },
    {
      title: "Preferred Cuisines",
      searchInputPlaceholder: "search cuisines...",
      addInputPlaceholder: "add other cuisines...",
      options: cuisineTypes,
      selectedOptions: [],
    },
  ]);

  const [progress, setProgress] = React.useState(
    (step / contentSteps.length) * 100
  );
  useEffect(() => {
    setProgress(((step + 1) / contentSteps.length) * 100);
  }, [step]);

  const handleNextStep = () => {
    if (step === contentSteps.length - 1) {
      savePreferencesToAsyncStorage(contentSteps);
      router.replace("/home");
      return;
    }
    setStep(step + 1);
  };
  const handlePreviousStep = () => {
    if (step === 0) {
      router.replace("/setPreferences/intro");
    }
    setStep(step - 1);
  };

  /**
   * Handles the selection of an option in the preferences.
   * @param option - The option to be selected.
   */
  const handleOptionSelect = (option: preferenceOption) => {
    if (contentSteps[step].selectedOptions.includes(option)) {
      setContentSteps((prev) => {
        const updatedContentSteps = [...prev];
        updatedContentSteps[step].selectedOptions = updatedContentSteps[
          step
        ].selectedOptions.filter((selectedOption) => selectedOption !== option);
        return updatedContentSteps;
      });
      return;
    }
    setContentSteps((prev) => {
      const updatedContentSteps = [...prev];
      updatedContentSteps[step].selectedOptions = [
        ...updatedContentSteps[step].selectedOptions,
        option,
      ];
      return updatedContentSteps;
    });
  };

  // Function to save preferences to AsyncStorage
  const savePreferencesToAsyncStorage = async (
    preferences: preferenceType[]
  ) => {
    try {
      const updatedPreferences = preferences.map((preference) => {
        const { options, ...props } = preference;
        return props;
      });
      await AsyncStorage.setItem(
        "userTastePreferences",
        JSON.stringify(updatedPreferences)
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };
  return (
    <LinearGradient
      style={styles.container}
      colors={[
        Colors.light.navHeader[2],
        Colors.light.navHeader[1],
        Colors.light.navHeader[0],
      ]}
      start={[0, 0]}
      end={[1, 1]}
    >
      <CustomKeyBoardView>
        <StatusBar style="light" />
        <View style={styles.content}>
          <View>
            <View style={styles.logoContainer}>
              <Text style={[{ color: Colors.darkBlue }, styles.logoTitle]}>
                Step {step + 1}
              </Text>
              <CircularProgress
                size={wp(20)}
                progress={progress}
                strokeWidth={wp(2)}
                strokeColor={
                  Colors.light.components.button.purple.background[2]
                }
                backgroundColor={Colors.darkBlue}
              />
            </View>

            <View style={styles.textContainer}>
              <View>
                <Text style={styles.title}>Add Taste Profile</Text>
              </View>
              <PreferencesSelectCard
                step={step}
                selectedOptions={contentSteps[step].selectedOptions}
                title={contentSteps[step].title}
                searchInputPlaceholder={
                  contentSteps[step].searchInputPlaceholder
                }
                addInputPlaceholder={contentSteps[step].addInputPlaceholder}
                options={contentSteps[step].options}
                onOptionSelect={(option) => {
                  handleOptionSelect(option);
                }}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View className="flex flex-row justify-between gap-x-2 ">
              <View style={{ flex: 1 / 2 }}>
                <StandardButton
                  textValue="Previous"
                  height={ComponentParams.button.height.large}
                  colors={[
                    Colors.light.components.button.white.background[0],
                    Colors.light.components.button.white.background[1],
                  ]}
                  borderColor={Colors.light.components.button.white.border}
                  textColor={Colors.light.components.button.white.text}
                  shadowColor={Colors.light.components.button.white.dropShadow}
                  clickHandler={() => {
                    handlePreviousStep();
                  }}
                />
              </View>
              <View style={{ flex: 1 / 2 }}>
                <StandardButton
                  textValue="Next"
                  height={ComponentParams.button.height.large}
                  colors={[
                    Colors.light.components.button.pink.background[0],
                    Colors.light.components.button.pink.background[1],
                  ]}
                  textColor={Colors.light.components.button.pink.text}
                  borderColor={Colors.light.components.button.pink.border}
                  shadowColor={Colors.light.components.button.pink.dropShadow}
                  clickHandler={() => {
                    handleNextStep();
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              className="flex w-full items-center mt-5"
              onPress={() => {
                router.replace("/home");
              }}
            >
              <Text
                style={[
                  styles.textSpan,
                  { marginLeft: wp(1), color: Colors.dark.text },
                ]}
              >
                Remind me later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default setPreferencesStep1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    height: "100%",
    paddingTop: hp(10),
    paddingBottom: hp(5),
    paddingHorizontal: wp(9),
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    gap: hp(1),
    alignItems: "center",
  },
  logoTitle: {
    opacity: 0.25,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
  },
  logo: {
    height: hp(10),
  },
  title: {
    fontSize: Fonts.heading_2.fontSize,
    textAlign: "center",
    fontFamily: Fonts.heading_2.fontFamily,
    lineHeight: Fonts.heading_2.lineHeight,
    color: Colors.dark.text,
  },
  subTitle: {
    textTransform: "capitalize",
    lineHeight: Fonts.heading_3.lineHeight,
    fontSize: Fonts.heading_3.fontSize,
    textAlign: "center",
    fontFamily: Fonts.heading_3.fontFamily,
    color: Colors.dark.text,
  },
  paragraph: {
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    color: Colors.dark.text,
    textAlign: "left",
    lineHeight: Fonts.text_2.lineHeight,
  },
  textContainer: {
    marginTop: hp(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(2),
    marginBottom: hp(5),
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(1),
  },
  textSpan: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: Colors.white,
    fontFamily: "QuickSandSemiBold",
    fontSize: Fonts.text_3.fontSize,
  },
});
