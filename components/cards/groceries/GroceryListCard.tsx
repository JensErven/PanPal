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
  const [fetchedGroceries, setFetchedGroceries] = React.useState<number>(0);
  const SettingsModalHeaderChildren = (
    <>
      <Text style={styles.title}>Grocerylist options</Text>
      <Text style={styles.subTitle}>{groceryList.name}</Text>
    </>
  );

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
  const progress = useMemo(() => {
    return fetchedGroceries / groceryList.items.length;
  }, [fetchedGroceries, groceryList.items.length]);

  const SettingModalScrollViewChildren = (
    <>
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
    </>
  );

  return (
    <>
      <CustomSheetModal
        modalRef={groceryListSettingsModal}
        snapPoints={[hp(31)]}
        hasBackdrop={true}
        headerChildren={SettingsModalHeaderChildren}
        scrollViewChildren={SettingModalScrollViewChildren}
      />
      <TouchableOpacity onPress={() => handleNavigateToRecipe(groceryList.id)}>
        <LinearGradient
          style={styles.container}
          colors={[Colors.white, Colors.white, Colors.secondaryWhite]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{groceryList.name}</Text>
              <TouchableOpacity
                onPress={() => groceryListSettingsModal.current?.present()}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={hp(2.5)}
                  color={Colors.darkGrey}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.lowerContentContainer}>
              <View style={{ flex: 1 }}>
                <LineProgress
                  height={hp(1)}
                  progress={progress}
                  strokeColor={Colors.mediumPurple}
                  backgroundColor={Colors.secondaryWhite}
                />
              </View>
              <View>
                <Text style={styles.subTitle}>
                  {fetchedGroceries}/{groceryList.items.length}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

export default GroceryListCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: hp(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: hp(ComponentParams.button.height.small),
    elevation: 3,
    shadowColor: Colors.cardDropShadow,
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
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  subTitle: {
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
  },
});
