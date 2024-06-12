import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { RecipeType } from "@/models/RecipeType";
import RecipeSuggestionCard from "./RecipeSuggestionCard";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import { Ionicons } from "@expo/vector-icons";
import GenerateRecipeSuggestionCard from "./GenerateRecipeSuggestionCard";
import PopUp from "@/components/modals/PopUp";
import Fonts from "@/constants/Fonts";

interface RecipeSuggestionsListProps {
  recipeSuggestions: RecipeType[];
  user?: any;
  credits?: number;
  generateRecipe?: () => void;
  saveRecipe?: (recipe: RecipeType) => void;
  handleClick?: (recipe: RecipeType) => void;
}

const RecipeSuggestionsList: React.FC<RecipeSuggestionsListProps> = ({
  recipeSuggestions,
  user,
  credits,
  generateRecipe,
  saveRecipe,
  handleClick,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveRecipeLoading, setSaveRecipeLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const cardRefs = useRef<{ [key: number]: View | null }>({}).current;
  const [currentIndex, setCurrentIndex] = useState(
    recipeSuggestions.length - 1
  );

  useEffect(() => {
    // Scroll to the last added recipe card
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        animated: true,
        x: currentIndex * (wp(80) + wp(4)), // Adjust for card width and margin
      });
    }
  }, [currentIndex]);

  // Function to handle scroll end
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (wp(80) + wp(4)));
    setCurrentIndex(index);
  };

  const handleGenerateRecipe = async () => {
    setLoading(true);
    await generateRecipe?.();
    setLoading(false);
  };

  const handleSaveRecipe = async () => {
    setSaveRecipeLoading(true);
    await saveRecipe?.(recipeSuggestions[currentIndex]);
    setSaveRecipeLoading(false);
  };

  const [shouldShowCreditsInfoPopUp, setShouldShowCreditsInfoPopUp] =
    useState<boolean>(false);

  const handleCreditsInfoPopUpClose = () => {
    setShouldShowCreditsInfoPopUp(false);
  };

  return (
    <>
      {/* Your existing code for PopUp component */}
      <ScrollView
        ref={scrollViewRef}
        snapToInterval={wp(80) + wp(4)}
        decelerationRate="normal"
        horizontal={true}
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd} // Call handleScrollEnd on scroll end
      >
        {recipeSuggestions.map((recipe, index) => (
          <View
            style={styles.cardContainer}
            key={index}
            ref={(ref) => {
              cardRefs[index] = ref;
            }}
          >
            <RecipeSuggestionCard
              recipe={recipe}
              loading={saveRecipeLoading}
              username={user?.username}
              saveRecipe={(recipe: RecipeType) =>
                saveRecipe && saveRecipe(recipe)
              }
              handleClick={(recipe: RecipeType) =>
                handleClick && handleClick(recipe)
              }
            />
          </View>
        ))}
        <GenerateRecipeSuggestionCard
          generateRecipe={handleGenerateRecipe}
          username={user?.username}
          credits={credits || 0}
          loading={loading}
        />
      </ScrollView>
      <View style={styles.dotContainer}>
        {recipeSuggestions.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
            onPress={() => setCurrentIndex(index)}
          />
        ))}
      </View>
    </>
  );
};
export default RecipeSuggestionsList;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    overflow: "visible",
  },
  cardContainer: {
    marginRight: wp(4),
    width: wp(80),
    overflow: "visible",
  },
  dotContainer: {
    flexDirection: "row",
    borderRadius: wp(1),
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: wp(2),
    aspectRatio: 1,
    marginHorizontal: wp(1),
  },
  dotActive: {
    width: wp(2),
    elevation: 2,
    borderRadius: wp(1),
    shadowColor: Colors.darkBlue,
    backgroundColor: Colors.mediumPurple,
  },
  dotInactive: {
    borderRadius: wp(1),
    elevation: 2,
    shadowColor: Colors.darkBlue,
    backgroundColor: Colors.primarySkyBlue,
  },
  generateMoreRecipesContainerCard: {
    width: wp(80),
    borderColor: Colors.white,
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    padding: wp(4),
    shadowColor: Colors.darkBlue,
    elevation: 4,
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    height: hp(38),
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  recipeTitle: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
  callToActionText: {
    textAlign: "center",
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
});
