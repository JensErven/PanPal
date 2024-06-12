import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import { RecipeType } from "@/models/RecipeType";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import RoundButton from "@/components/buttons/RoundButton";
import { LinearGradient } from "expo-linear-gradient";

const EditRecipeStepList = ({
  recipe,
  setRecipe,
}: {
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
}) => {
  const [editStep, setEditStep] = useState<number | null>(null);
  const [stepsTextInput, setStepsTextInput] = useState<string>("");

  const handleAddStep = () => {
    if (recipe) {
      if (stepsTextInput === "") return;
      const newSteps = [...recipe.steps, stepsTextInput];
      setEditStep(null);
      setRecipe({ ...recipe, steps: newSteps });
      ToastAndroid.show("Step added", ToastAndroid.SHORT);
      setStepsTextInput("");
    }
  };

  return (
    <>
      <Text style={styles.contentItemTitle}>Steps</Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: wp(2),
        }}
      >
        <LinearGradient
          colors={[Colors.primarySkyBlue, Colors.secondaryWhite]}
          style={styles.contentItemInput}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <TextInput
            style={styles.textInput}
            value={stepsTextInput}
            placeholder="add steps"
            placeholderTextColor={
              Colors.light.components.inputField.placeholderTextColor
            }
            onChangeText={(text: string) => {
              setStepsTextInput(text);
            }}
            onSubmitEditing={handleAddStep}
            multiline={true}
          />
        </LinearGradient>
        <RoundButton
          handlePress={handleAddStep}
          transparent={false}
          backgroundColor={Colors.mediumBlue}
        >
          <Ionicons name="add" size={hp(2.7)} color={Colors.white} />
        </RoundButton>
      </View>
      {recipe && recipe?.steps.length > 0 && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: hp(1),
          }}
        >
          <Text style={styles.text}>Amount: {recipe?.steps.length}</Text>
          <TouchableOpacity
            onPress={() => {
              if (!recipe) return;
              setRecipe({ ...recipe, steps: [] });
            }}
          >
            <Text style={styles.textUnderline}>clear all</Text>
          </TouchableOpacity>
        </View>
      )}
      {recipe?.steps && (
        <View style={styles.stepItemList}>
          {recipe?.steps.map((step, index) => (
            <View key={index} style={styles.listItem}>
              <LinearGradient
                colors={[Colors.white, Colors.secondaryWhite]}
                style={styles.listItemGradientContainer}
                start={[0, 0]}
                end={[1, 1]}
              />
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: hp(1),
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.stepNumber}>
                  <LinearGradient
                    style={styles.stepNumberGradientContainer}
                    colors={[Colors.white, Colors.secondaryWhite]}
                    start={[0, 0]}
                    end={[1, 1]}
                  />
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: wp(2) }}>
                  <RoundButton
                    handlePress={() => {
                      if (!recipe) return;
                      const newSteps = recipe.steps.filter(
                        (item) => item !== step
                      );
                      setRecipe({
                        ...recipe,
                        steps: newSteps,
                      });
                    }}
                    transparent={false}
                    backgroundColor={"transparent"}
                  >
                    <Ionicons name="trash" size={hp(2.7)} color={"#C70000"} />
                  </RoundButton>
                </View>
              </View>
              {editStep === index ? (
                <TextInput
                  autoFocus={true}
                  style={styles.listItemTextInput}
                  editable={editStep === index}
                  value={step}
                  placeholder="step"
                  placeholderTextColor={
                    Colors.light.components.inputField.placeholderTextColor
                  }
                  onChangeText={(text: string) => {
                    if (recipe) {
                      const newSteps = recipe.steps.map((item, i) => {
                        if (i === index) return text;
                        return item;
                      });
                      setRecipe({
                        ...recipe,
                        steps: newSteps,
                      });
                    }
                  }}
                  onEndEditing={() => {
                    setEditStep(null);
                    if (step === "") {
                      const newSteps = recipe.steps.filter(
                        (item) => item !== step
                      );
                      setRecipe({
                        ...recipe,
                        steps: newSteps,
                      });
                    }
                  }}
                  multiline={true}
                  textAlignVertical="top"
                />
              ) : (
                <Text
                  onPress={() => setEditStep(index)}
                  style={styles.listItemText}
                >
                  {step ? step : "empty step"}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </>
  );
};

export default EditRecipeStepList;

const styles = StyleSheet.create({
  contentItemInput: {
    flex: 1,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    borderRightColor: Colors.white,
    borderRightWidth: 1,
  },
  stepNumberGradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  listItemGradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textInput: {
    width: "100%",
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),

    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  listItemText: {
    width: "100%",
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  listItemTextInput: {
    width: "100%",
    minHeight: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.secondaryWhite,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemTitle: {
    color: Colors.darkGrey,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
  },

  text: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  textUnderline: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textDecorationLine: "underline",
  },
  listItem: {
    flex: 1,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    backgroundColor: Colors.white,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    borderRightColor: Colors.white,
    borderRightWidth: 0.25,
    elevation: 10,
    gap: hp(1),
    shadowColor: Colors.darkBlue,
  },
  stepNumber: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
  },
  stepNumberText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  stepItemList: {
    width: "100%",
    flexDirection: "column",
    gap: hp(1),
  },
});
