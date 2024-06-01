import React, { useContext, useMemo, useRef } from "react";
import { View, StyleSheet, Animated, ToastAndroid, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  GroceryListType,
  createGroceryList,
} from "@/services/db/groceries.services";
import { AuthContext } from "@/context/authContext";
import { Timestamp } from "firebase/firestore";
import StandardButton from "../buttons/StandardButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomSheetModal from "../modals/CustomSheetModal";
import { TextInput } from "react-native-gesture-handler";
import Fonts from "@/constants/Fonts";

const PlusButtonContentView = ({
  activeTab,
  closeContentView,
}: {
  activeTab: number;
  closeContentView: () => void;
}) => {
  const { user } = useContext<any>(AuthContext);
  const translateY = new Animated.Value(hp(10)); // Initial translateY value
  Animated.spring(translateY, {
    toValue: 0,
    useNativeDriver: true,
  }).start(); // Start translateY animation
  const modalRefAddGroceryList = useRef<BottomSheetModal>(null);
  const [groceryListName, setGroceryListName] = React.useState<string>("");

  const handleNavigateToRecipe = async (groceryListId: string) => {
    router.push({
      pathname: `/groceries/details/[id]`,
      params: { id: groceryListId },
    });
  };

  const handleAddGroceryList = async (groceryListName: string) => {
    if (!user) return;
    if (groceryListName === "") {
      ToastAndroid.show(
        "Please enter a name for the grocery list",
        ToastAndroid.SHORT
      );
      return;
    }

    const newGroceryList: GroceryListType = {
      id: "",
      name: groceryListName,
      uuids: [user.userId],
      items: [],
      createdAt: Timestamp.now(),
    };
    await createGroceryList(newGroceryList).then((res) => {
      modalRefAddGroceryList.current?.close();
      ToastAndroid.show("Grocery List Created", ToastAndroid.SHORT);

      if (!res.groceryListData) return;
      setTimeout(() => {
        handleNavigateToRecipe(res.groceryListData.id);
      }, 1000);
    });
  };

  const handleJoinGroceryList = async () => {
    router.push("/groceries/join");
  };

  const plusButtonContent = useMemo(() => {
    switch (activeTab) {
      case 0:
        return (
          <View style={styles.plusButtonContentContainer}>
            <StandardButton
              iconRight={
                <Ionicons
                  name="add"
                  size={hp(3.5)}
                  color={Colors.white}
                  style={{ marginRight: wp(2) }}
                />
              }
              textValue="add custom recipe"
              clickHandler={() => {
                closeContentView();
                router.push("/recipe/add");
              }}
              colors={Colors.light.components.button.purple.background}
              textColor={Colors.white}
              height={ComponentParams.button.height.medium}
              borderColor={Colors.light.components.button.purple.border}
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.plusButtonContentContainer}>
            <StandardButton
              iconRight={
                <Ionicons
                  name="add"
                  size={hp(3.5)}
                  color={Colors.white}
                  style={{ marginRight: wp(2) }}
                />
              }
              textValue="add custom recipe"
              clickHandler={() => {
                closeContentView();
                router.push("/recipe/add");
              }}
              colors={Colors.light.components.button.purple.background}
              textColor={Colors.white}
              height={ComponentParams.button.height.medium}
              borderColor={Colors.light.components.button.purple.border}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.plusButtonContentContainer}>
            <StandardButton
              iconRight={
                <Ionicons
                  style={{ marginRight: wp(2) }}
                  name="add"
                  size={hp(3.5)}
                  color={Colors.white}
                />
              }
              textValue="create grocery list"
              clickHandler={() => {
                // modalRefAddGroceryList.current?.present();
                router.push("/groceries/add");
              }}
              colors={Colors.light.components.button.purple.background}
              textColor={Colors.white}
              height={ComponentParams.button.height.medium}
              borderColor={Colors.light.components.button.purple.border}
            />
            <StandardButton
              iconRight={
                <Ionicons
                  style={{ marginRight: wp(2) }}
                  name="enter"
                  size={hp(3.5)}
                  color={Colors.white}
                />
              }
              textValue="join grocery list"
              clickHandler={() => {
                handleJoinGroceryList();
              }}
              colors={Colors.light.components.button.purple.background}
              textColor={Colors.white}
              height={ComponentParams.button.height.medium}
              borderColor={Colors.light.components.button.purple.border}
            />
          </View>
        );
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <>
      <CustomSheetModal
        snapPoints={[hp(100)]}
        modalRef={modalRefAddGroceryList}
        headerChildren={
          <>
            <Text style={styles.modalTitle}>Create Grocery List</Text>
            <View style={styles.contentItemInputContainer}>
              <TextInput
                autoFocus
                onSubmitEditing={() => handleAddGroceryList(groceryListName)}
                value={groceryListName}
                onChangeText={(text: string) => setGroceryListName(text)}
                style={styles.contentItemInput}
                placeholder="grocery list name"
                placeholderTextColor={Colors.primarySkyBlue}
              />
            </View>
          </>
        }
        footerChildren={
          <StandardButton
            iconRight={
              <Ionicons
                name="create"
                size={hp(2.7)}
                color={Colors.white}
                style={{ marginRight: wp(4) }}
              />
            }
            textValue="Save"
            clickHandler={() => handleAddGroceryList(groceryListName)}
            colors={Colors.light.components.button.purple.background}
            textColor={Colors.white}
            height={ComponentParams.button.height.medium}
          />
        }
      />
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY }] }, // Apply translateY animation
        ]}
      >
        <LinearGradient
          colors={[Colors.primarySkyBlue, Colors.secondaryWhite]}
          style={styles.gradient}
        />
        <View style={{ zIndex: 51 }}>{plusButtonContent}</View>
      </Animated.View>
    </>
  );
};

export default PlusButtonContentView;

const styles = StyleSheet.create({
  container: {
    zIndex: 49,
    position: "absolute",
    bottom: hp(10),
    flex: 1,
    paddingBottom: hp(2),
    width: wp(92), // Adjusted width to take into account left and right margins
    marginHorizontal: wp(4),
    height: "auto",
    borderRadius: hp(ComponentParams.button.height.small),
    overflow: "hidden",
    backgroundColor: Colors.primarySkyBlue,
    elevation: 2,
    shadowColor: Colors.cardDropShadow,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: Colors.primarySkyBlue,
    borderWidth: wp(0.5),
    borderRadius: hp(ComponentParams.button.height.small),
  },
  plusButtonContentContainer: {
    padding: wp(4),
    gap: hp(1),
  },
  modalTitle: {
    marginBottom: hp(1),
    color: Colors.darkGrey,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
  },
  contentItemInputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.secondaryWhite,
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    gap: wp(2),
  },
  contentItemInput: {
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
