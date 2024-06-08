import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import PromptSuggestionCard from "./PromptSuggestionCard";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { addEmojisToPrompt } from "@/utils/general.utils";

interface PromptSuggestionsListProps {
  suggestions: string[];
}
const PromptSuggestionsList: React.FC<PromptSuggestionsListProps> = ({
  suggestions,
}) => {
  const formattedSuggestions = useMemo(() => {
    return suggestions.map(addEmojisToPrompt);
  }, [suggestions]);

  return (
    <View style={styles.suggestedTopicsContainer}>
      <View style={styles.column}>
        {formattedSuggestions
          .filter((_, index) => index % 2 === 0)
          .map((topic, index) => (
            <PromptSuggestionCard key={index} topic={topic} />
          ))}
      </View>
      <View style={[styles.column, styles.secondColumn]}>
        {formattedSuggestions
          .filter((_, index) => index % 2 !== 0)
          .map((topic, index) => (
            <PromptSuggestionCard key={index} topic={topic} />
          ))}
      </View>
    </View>
  );
};

export default PromptSuggestionsList;

const styles = StyleSheet.create({
  suggestedTopicsContainer: {
    flexDirection: "row",
    gap: wp(4),
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    gap: hp(2),
  },
  secondColumn: {
    marginTop: hp(2),
  },
});
