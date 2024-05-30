import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import StandardButton from "@/components/buttons/StandardButton";
import ComponentParams from "@/constants/ComponentParams";
const FilterFooter = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <View style={styles.footerContainer}>
      <View style={{ flex: 1, width: "100%" }}>
        <StandardButton
          textValue="Apply Filters"
          textColor={Colors.white}
          height={ComponentParams.button.height.medium}
          colors={[
            Colors.light.components.button.purple.background[0],
            Colors.light.components.button.purple.background[1],
            Colors.light.components.button.purple.background[2],
          ]}
          borderColor={Colors.light.components.button.purple.background[0]}
          clickHandler={closeModal}
        />
      </View>
    </View>
  );
};

export default FilterFooter;

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
