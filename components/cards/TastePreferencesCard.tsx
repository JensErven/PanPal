import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useAuth } from "@/context/authContext";
import { updateTastePreferences } from "@/services/db/tastePreferences.services";
import { allergyTypes } from "@/constants/tastePreferences/AllergyTypes";
import { router } from "expo-router";
import StandardButton from "../buttons/StandardButton";
import CustomSheetModal from "../modals/CustomSheetModal";
import OptionTagButton from "../buttons/OptionTagButton";

interface TastePreferencesCardProps {
  title: string;
  subTitle?: string;
  selectedPreferences: string[];
  deletePreferences: (title: string) => void;
  isLoading: boolean;
}

const TastePreferencesCard = ({
  title,
  subTitle,
  selectedPreferences,
  deletePreferences,
  isLoading,
}: TastePreferencesCardProps) => {
  const tastePreferencesSettingsModal = useRef<BottomSheetModal>(null);

  const handleEditTastePreferences = (title: string) => async () => {
    tastePreferencesSettingsModal.current?.close();

    router.push({
      pathname: `/profile/taste-preferences/edit`,
      params: { title },
    });
  };

  const SettingsModalHeaderChildren = (
    <>
      <Text style={styles.modalHeaderTitle}>{title} options</Text>
      <Text style={styles.subTitle}>
        What would you like to do with your {title.toLowerCase()}?
      </Text>
    </>
  );

  const SettingModalScrollViewChildren = (
    <View
      style={{
        flexDirection: "column",
        gap: hp(1),
        paddingTop: hp(2),
        marginHorizontal: wp(4),
      }}
    >
      <StandardButton
        isDisabled={isLoading}
        clickHandler={() => {
          deletePreferences(title);
          tastePreferencesSettingsModal.current?.close();
        }}
        textValue={`Delete all`}
        colors={[Colors.primarySkyBlue, Colors.primarySkyBlue]}
        height={ComponentParams.button.height.medium}
        borderColor="transparent"
        textColor={Colors.darkGrey}
        iconRight={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: hp(ComponentParams.button.height.small),
              aspectRatio: 1,
              borderRadius: hp(ComponentParams.button.height.small),
              marginRight: wp(2),
            }}
          >
            <Ionicons name="trash" size={hp(3.2)} color={"#C70000"} />
          </View>
        }
      />
      <StandardButton
        isDisabled={isLoading}
        clickHandler={handleEditTastePreferences(title)}
        textValue={`Edit`}
        colors={[Colors.primarySkyBlue, Colors.primarySkyBlue]}
        height={ComponentParams.button.height.medium}
        borderColor="transparent"
        textColor={Colors.darkGrey}
        iconRight={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: hp(ComponentParams.button.height.small),
              aspectRatio: 1,
              borderRadius: hp(ComponentParams.button.height.small),
              marginRight: wp(2),
            }}
          >
            <Ionicons name="pencil" size={hp(3.2)} color={Colors.darkGrey} />
          </View>
        }
      />
    </View>
  );

  return (
    <>
      <CustomSheetModal
        modalRef={tastePreferencesSettingsModal}
        snapPoints={[hp(36)]}
        hasBackdrop={true}
        headerChildren={SettingsModalHeaderChildren}
        scrollViewChildren={SettingModalScrollViewChildren}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={handleEditTastePreferences(title)}
      >
        <LinearGradient
          style={styles.gradientContainer}
          colors={[Colors.white, Colors.secondaryWhite]}
          start={[0, 0]}
          end={[1, 1]}
        />
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
            {subTitle && (
              <Text
                style={styles.subTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedPreferences.length > 0
                  ? subTitle
                  : `No ${title.toLowerCase()} selected`}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={{ padding: wp(2), alignSelf: "flex-start" }}
            onPress={() => tastePreferencesSettingsModal.current?.present()}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={hp(2.5)}
              color={Colors.darkGrey}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.lowerContentContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.darkGrey} />
          ) : (
            <View style={styles.lowerContentContainer}>
              {selectedPreferences.map((preference, index) => {
                return (
                  <OptionTagButton
                    key={index}
                    option={preference}
                    selectOption={() => {
                      return;
                    }}
                    selected={true}
                  />
                );
              })}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    flexDirection: "column",
    gap: hp(2),
    display: "flex",
    padding: wp(4),
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: Colors.white,
    borderRadius: hp(ComponentParams.button.height.large / 2),
    overflow: "visible",
  },
  contentContainer: {
    width: "100%",
    gap: hp(2),
  },
  headerContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lowerContentContainer: {
    width: "100%",
    gap: hp(1),
    flexDirection: "row",
    flexWrap: "wrap", // Allow items to wrap to the next line
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.large / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    alignSelf: "flex-start",
    flex: 1,
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  modalHeaderTitle: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.darkBlue,
    textTransform: "capitalize",
  },
  subTitle: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
  },
});

export default TastePreferencesCard;
