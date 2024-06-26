import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ToastAndroid,
} from "react-native";
import React, { useContext, useMemo, useRef } from "react";
import { GroceryListType } from "@/services/db/groceries.services";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import ComponentParams from "@/constants/ComponentParams";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LineProgress from "@/components/LineProgress";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomSheetModal from "@/components/modals/CustomSheetModal";
import { leaveGroceryList } from "@/services/db/groceries.services";
import StandardButton from "@/components/buttons/StandardButton";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { AuthContext } from "@/context/authContext";

const GroceryListCard = ({ groceryList }: { groceryList: GroceryListType }) => {
  const { user } = useContext<any>(AuthContext);
  const groceryListSettingsModal = React.useRef<BottomSheetModal>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const SettingsModalHeaderChildren = (
    <>
      <Text style={styles.modalHeaderTitle}>Grocerylist options</Text>
      <Text style={styles.subTitle}>{groceryList.name}</Text>
    </>
  );

  const progress = useMemo(() => {
    const totalItems = groceryList.items.length;
    const checkedItems = groceryList.items.filter(
      (item) => item.checked
    ).length;
    return totalItems === 0 ? 0 : (checkedItems / totalItems) * 100;
  }, [groceryList.items]);

  const handleDeleteGroceryList = async () => {
    if (!user && !groceryList.id) return;
    await leaveGroceryList(groceryList.id, user.userId);
    groceryListSettingsModal.current?.close();
  };

  const handleNavigateToRecipe = async (groceryListId: string) => {
    router.push({
      pathname: `/groceries/details/[id]`,
      params: { id: groceryListId },
    });
  };

  const handleShareGroceryList = async (groceryListId: string) => {
    const message = `Join my grocery list: ${groceryListId}`;

    try {
      await Share.share({
        message: message,
      });
      groceryListSettingsModal.current?.close();
      ToastAndroid.show(
        `Grocery list shared: ${groceryList.name}`,
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error("Error sharing the grocery list:", error);
    }
  };

  const SettingModalScrollViewChildren = (
    <View
      style={{
        flexDirection: "column",
        gap: hp(1),
        paddingHorizontal: wp(4),
        paddingTop: hp(2),
      }}
    >
      <StandardButton
        isDisabled={isLoading}
        clickHandler={handleDeleteGroceryList}
        textValue="Delete grocery list"
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
        clickHandler={() => handleShareGroceryList(groceryList.id)}
        textValue="Share grocery list"
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
            <Ionicons
              name="share-social-outline"
              size={hp(3.2)}
              color={Colors.darkGrey}
            />
          </View>
        }
      />
    </View>
  );

  return (
    <>
      <CustomSheetModal
        modalRef={groceryListSettingsModal}
        snapPoints={[hp(32)]}
        hasBackdrop={true}
        headerChildren={SettingsModalHeaderChildren}
        scrollViewChildren={SettingModalScrollViewChildren}
      />
      <TouchableOpacity
        onPress={() => handleNavigateToRecipe(groceryList.id)}
        style={styles.container}
      >
        <LinearGradient
          style={styles.gradientContainer}
          colors={[Colors.white, Colors.secondaryWhite]}
          start={[0, 0]}
          end={[1, 1]}
        />
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {groceryList.name}
            </Text>
            <View style={styles.groceryListCardIconsContainer}>
              {groceryList.uuids.length > 0 && (
                <View style={styles.peoplesCounterContainer}>
                  <Text
                    style={[
                      styles.subTitle,
                      {
                        marginBottom: hp(0.5),
                      },
                    ]}
                  >
                    {groceryList.uuids.length}
                  </Text>
                  <Ionicons
                    name="people"
                    size={hp(2.5)}
                    color={Colors.darkGrey}
                  />
                </View>
              )}

              <TouchableOpacity
                style={{ padding: wp(2), alignSelf: "flex-start" }}
                onPress={() => groceryListSettingsModal.current?.present()}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={hp(2.5)}
                  color={Colors.darkGrey}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.lowerContentContainer}>
            <View style={{ flex: 1 }}>
              <LineProgress
                height={hp(1.5)}
                progress={progress}
                strokeColor={Colors.mediumPurple}
                backgroundColor={Colors.secondaryWhite}
              />
            </View>
            <View>
              <Text style={styles.subTitle}>
                {groceryList.items.filter((item) => item.checked).length}/
                {groceryList.items.length}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default GroceryListCard;

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
  peoplesCounterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(0.5),
  },
  groceryListCardIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: hp(1),
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.large / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    width: "100%",
    gap: hp(2),
  },
  headerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lowerContentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(4),
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
