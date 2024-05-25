import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect } from "react";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import StandardButton from "../buttons/StandardButton";
import { RecipeType } from "@/models/RecipeType";
import { openaiServices } from "@/services/api/openai.services";
import { tipsExampleJsonType } from "@/models/openai/tipsExampleJsonType";
import FullScreenLoading from "../FullScreenLoading";
import { recipeService } from "@/services/db/recipe.services";
import { AuthContext } from "@/context/authContext";

const RecipeTipsCard = ({
  recipe,
  setRecipe,
}: {
  recipe: RecipeType;
  setRecipe: (recipe: RecipeType) => void;
}) => {
  const { credits, subtractCredits } = React.useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tips, setTips] = React.useState<string[]>([]);

  useEffect(() => {
    if (!recipe) return;
    setTips(recipe.tips || []);
  }, [recipe]);

  const handleGenerateMoreTips = () => {
    if (tips.length >= 10) return;
    if (credits < 1) {
      ToastAndroid.show("Insufficient Panpal Credits", ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);
    openaiServices
      .createRecipeTip(recipe)
      .then((response) => {
        if (typeof response.content === "string") {
          const parsedContent = JSON.parse(response.content);
          if (parsedContent.responseType === "tips") {
            subtractCredits(1);
            ToastAndroid.show("1 Panpal Credit deducted", ToastAndroid.SHORT);
            setTips([...tips, ...parsedContent.tips]);
            saveTipsToRecipe([...tips, ...parsedContent.tips]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false); // Move setIsLoading(false) inside finally block
      });
  };

  const saveTipsToRecipe = (tips: string[]) => {
    const updatedRecipe = { ...recipe, tips };
    // Save the updated recipe to the database
    if (!recipe.id) return;
    recipeService.saveTipsToRecipe(recipe.id, tips).then(
      (response) => {
        if (response) setRecipe(updatedRecipe);
        console.log("Recipe updated with tips", response);
      },
      (error) => {
        console.log("Error updating recipe", error);
      }
    );
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.white, Colors.white]}
      start={[0.5, 0]}
      end={[0.5, 1]}
    >
      <View style={styles.content}>
        <View style={styles.contentTitleContainer}>
          <View style={styles.contentTitleLeft}>
            <Ionicons
              name="sparkles"
              size={hp(2)}
              color={Colors.mediumPurple}
            />
            <Text style={styles.cardTitle}>Tips & Tricks</Text>
          </View>
          <View style={styles.contentTitleRight}>
            <Text style={styles.contentTitleRightText}>{tips.length}/10</Text>
          </View>
        </View>
        <View style={styles.itemList}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.bulletPoint}>
                <Ionicons
                  name="ellipse"
                  size={wp(2)}
                  color={Colors.mediumPurple}
                />
              </View>
              <Text style={styles.cardText}>{tip}</Text>
            </View>
          ))}
        </View>
        {tips.length < 10 && (
          <StandardButton
            loading={isLoading}
            isDisabled={tips.length >= 10 || isLoading}
            height={ComponentParams.button.height.medium}
            borderColor={Colors.darkBlue}
            textColor={Colors.white}
            colors={Colors.light.components.button.purple.background}
            textValue={
              tips.length === 0 ? "Generate Tips" : "Generate More Tips"
            }
            iconRight={
              <View style={styles.panpalCreditsContainer}>
                <Text style={styles.panpalCreditsText}>1</Text>
                <LinearGradient
                  style={styles.panpalCreditsButtonContainer}
                  colors={[
                    Colors.light.components.button.gold.background[0],
                    Colors.light.components.button.gold.background[1],
                  ]}
                  start={[0.5, 0]}
                  end={[0.5, 1]}
                >
                  <Text style={styles.panpalCreditsButtonText}>pp</Text>
                </LinearGradient>
              </View>
            }
            clickHandler={handleGenerateMoreTips}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default RecipeTipsCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.medium),
    elevation: 2,
    shadowColor: Colors.darkBlue,
  },
  contentTitleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    width: "100%",
    gap: hp(2),
  },
  cardTitle: {
    fontFamily: Fonts.heading_3.fontFamily,
    fontSize: Fonts.heading_3.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.heading_3.lineHeight,
  },
  cardText: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    marginBottom: hp(1),
    flexWrap: "wrap",
    marginRight: wp(2),
  },
  bulletPoint: {
    width: wp(2),
    height: wp(2),
    borderRadius: hp(1),
    marginTop: hp(1),
  },
  tipItem: {
    display: "flex",
    flexDirection: "row",
    gap: wp(2),
    alignItems: "flex-start",
  },
  itemList: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: hp(1),
  },
  panpalCreditsButtonContainer: {
    backgroundColor: Colors.light.components.button.gold.background[0], // Set the background color to represent a coin
    borderRadius: hp(ComponentParams.button.height.small / 2), // Rounded border
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // Border width
    borderColor: Colors.light.components.button.gold.border, // Border color
  },
  panpalCreditsText: {
    textAlignVertical: "center",
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.white,
  },
  panpalCreditsButtonText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    lineHeight: Fonts.text_3.lineHeight,
    color: Colors.darkGold,
  },
  panpalCreditsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(1),
    backgroundColor: "transparent",
    height: hp(ComponentParams.button.height.medium),
    paddingHorizontal: wp(2),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  contentTitleLeft: {
    marginLeft: wp(1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    justifyContent: "center",
  },
  contentTitleRight: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  contentTitleRightText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
