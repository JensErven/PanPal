import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Alert,
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
import PagerView from "react-native-pager-view";

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
            ToastAndroid.show("1 PanPal Credits deducted", ToastAndroid.SHORT);
            setTips([...tips, ...parsedContent.tips]);
            saveTipsToRecipe([...tips, ...parsedContent.tips]);
          }
        }
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to generate tips. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const saveTipsToRecipe = (tips: string[]) => {
    const updatedRecipe = { ...recipe, tips };
    if (!recipe.id) return;
    recipeService.saveTipsToRecipe(recipe.id, tips).then(
      (response) => {
        if (response) setRecipe(updatedRecipe);
      },
      (error) => {
        Alert.alert("Error", "Failed to save tips to recipe");
      }
    );
  };

  return (
    <View style={styles.content}>
      <View style={styles.contentTitleContainer}>
        <View style={styles.contentTitleLeft}>
          <Ionicons name="sparkles" size={hp(2)} color={Colors.mediumPurple} />
          <Text style={styles.cardTitle}>Tips & Tricks</Text>
        </View>
        <View style={styles.contentTitleRight}>
          <Text style={styles.contentTitleRightText}>{tips.length}/10</Text>
        </View>
      </View>
      <View style={styles.itemListContainer}>
        {tips.length === 0 ? (
          <Text style={styles.cardText}>No tips available</Text>
        ) : (
          <>
            {tips.map((tip, index) => (
              <LinearGradient
                style={styles.tipItem}
                key={index}
                colors={[Colors.white, "#DDEBF3"]}
                start={[0.5, 0]}
                end={[0.5, 1]}
              >
                <View style={styles.tipItemInner}>
                  <Text style={styles.cardText}>{tip}</Text>
                </View>
              </LinearGradient>
            ))}
          </>
        )}
      </View>

      {tips.length < 10 && (
        <View style={{ flex: 1, width: "100%", paddingHorizontal: wp(4) }}>
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
        </View>
      )}
    </View>
  );
};

export default RecipeTipsCard;

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  contentTitleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: wp(4),
  },
  contentTitleLeft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  itemListContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: hp(2),
    paddingVertical: hp(2),
    overflow: "hidden",
    paddingHorizontal: wp(4),
  },
  contentTitleRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  contentTitleRightText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkGrey,
  },
  cardTitle: {
    lineHeight: Fonts.text_1.lineHeight,
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    marginLeft: wp(2),
  },
  tipItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    elevation: 2,
    shadowColor: Colors.cardDropShadow,
    padding: wp(2),
    borderRadius: hp(ComponentParams.button.height.small),
  },
  tipItemInner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    padding: wp(2),
    shadowColor: Colors.cardDropShadow,
  },
  cardText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  panpalCreditsContainer: {
    display: "flex",
    flexDirection: "row",
    marginRight: wp(1),
    gap: wp(1),
    justifyContent: "center",
    alignItems: "center",
  },
  panpalCreditsText: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.white,
    lineHeight: Fonts.text_2.lineHeight,
  },
  panpalCreditsButtonText: {
    textTransform: "uppercase",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGold,
    textAlign: "center",
    position: "absolute",
    textAlignVertical: "center",
  },
  panpalCreditsButtonContainer: {
    borderBottomColor: Colors.darkGold,
    borderBottomWidth: 1,
    borderRightColor: Colors.darkGold,
    borderRightWidth: 1,
    borderRadius: hp(ComponentParams.button.height.small),
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
  },
});
