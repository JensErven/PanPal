import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import StandardButton from "../buttons/StandardButton";

interface SetUpTasteProfileCardProps {
  title: string;
  extraInfo?: string;
  callToAction: () => void;
}

const SetUpTasteProfileCard: React.FC<SetUpTasteProfileCardProps> = ({
  title,
  callToAction,
  extraInfo,
}) => {
  const renderTitle = (title: string) => {
    const tasteProfileIndex = title.indexOf("Taste Profile");

    if (tasteProfileIndex !== -1) {
      return (
        <>
          <Text style={styles.title}>
            {title.substring(0, tasteProfileIndex)}
          </Text>
          <Text style={styles.boldText}>Taste Profile</Text>
          <Text style={styles.title}>
            {title.substring(tasteProfileIndex + "Taste Profile".length)}
          </Text>
        </>
      );
    } else {
      return <Text style={styles.title}>{title}</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradientContainer}
        colors={[Colors.white, Colors.secondaryWhite, Colors.primarySkyBlue]}
        start={[0, 0]}
        end={[1, 1]}
      />
      <View style={styles.titleContainer}>{renderTitle(title)}</View>
      {extraInfo && <Text style={styles.extraInfo}>{extraInfo}</Text>}
      <StandardButton
        textValue="Create Taste Profile"
        clickHandler={() => callToAction()}
        colors={Colors.light.components.button.purple.background}
        borderColor={Colors.light.components.button.purple.border}
        textColor={Colors.white}
        height={ComponentParams.button.height.medium}
      />
    </View>
  );
};

export default SetUpTasteProfileCard;

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    flexDirection: "column",
    padding: wp(4),
    gap: hp(2),
    display: "flex",
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.large / 2),
    overflow: "visible",
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.large / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  titleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  title: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkBlue,

    textAlignVertical: "center",
  },
  boldText: {
    marginTop: hp(0.25),
    textAlignVertical: "center",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
  extraInfo: {
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    lineHeight: Fonts.text_2.lineHeight,
    color: Colors.darkGrey,
  },
});
