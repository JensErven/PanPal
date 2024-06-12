import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  Share,
} from "react-native";
import React, { useMemo } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/authContext";
import RoundButton from "@/components/buttons/RoundButton";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  GroceryListType,
  leaveGroceryList,
  getGroceryList,
  updateGroceryList,
} from "@/services/db/groceries.services";
import CustomHeader from "@/components/navigation/CustomHeader";
import { StatusBar } from "expo-status-bar";
import FullScreenLoading from "@/components/FullScreenLoading";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import ComponentParams from "@/constants/ComponentParams";
import { useGroceries } from "@/context/GroceriesContext";
import LineProgressBarHeader from "@/components/headers/LineProgressBarHeader";
import Fonts from "@/constants/Fonts";
import StandardButton from "@/components/buttons/StandardButton";
import AddGroceryItemModal, {
  itemType,
} from "@/components/cards/groceries/AddGroceryItemModal";
import GroceryListItem from "@/components/cards/groceries/GroceryListItem";

const GroceryListDetailsScreen = () => {
  const { user } = useAuth();
  const { groceryLists } = useGroceries();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [groceryList, setGroceryList] = React.useState<
    GroceryListType | undefined
  >(undefined);

  useFocusEffect(
    React.useCallback(() => {
      if (id === "") return;
      setIsLoading(true);
      findGroceryListInContext(id as string)
        .then((res) => {
          if (res && !res.uuids.includes(user.userId)) {
            router.back();
          }
          setGroceryList(res);
          setIsLoading(false);
        })
        .catch((err) => {
          getGroceryList(id as string)
            .then((res) => {
              console.log("Found GroceryList in DB: ", res);
              if (res) {
                console.log("Setting GroceryList: ", res);
              }

              setIsLoading(false);
            })
            .catch((err) => {
              console.log("Error: ", err);
              Alert.alert("Failed to fetch recipe", err.message);
              router.back();
              setIsLoading(false);
            });
        });
    }, [id, groceryLists])
  );

  const handleClearCheckedItems = async () => {
    if (!groceryList?.id) return;
    if (!groceryList?.items) return;
    if (!groceryList.uuids.includes(user.userId)) return;
    const updatedItems = groceryList.items.filter((item) => !item.checked);
    const updatedGroceryList = { ...groceryList, items: updatedItems };

    await updateGroceryList(groceryList.id, updatedGroceryList)
      .then((res) => {
        if (res.success) {
          setGroceryList(updatedGroceryList);
        }
      })
      .catch((err) => {
        console.log("Error updating grocery list: ", err);
      });
  };

  const handleItemPress = async (index: number) => {
    if (!groceryList?.id) return;
    if (!groceryList?.items) return;
    if (!groceryList.uuids.includes(user.userId)) return;
    const updatedItems = [...groceryList.items];
    updatedItems[index].checked = !updatedItems[index].checked;
    const updatedGroceryList = { ...groceryList, items: updatedItems };

    await updateGroceryList(groceryList.id, updatedGroceryList)
      .then((res) => {
        if (res.success) {
          setGroceryList(updatedGroceryList);
        }
      })
      .catch((err) => {
        console.log("Error updating grocery list: ", err);
      });
  };

  const handleDismissItem = async (index: number) => {
    if (!groceryList?.id) return;
    if (!groceryList?.items) return;
    if (!groceryList.uuids.includes(user.userId)) return;
    const updatedItems = [...groceryList.items];
    updatedItems.splice(index, 1);
    const updatedGroceryList = { ...groceryList, items: updatedItems };

    await updateGroceryList(groceryList.id, updatedGroceryList)
      .then((res) => {
        if (res.success) {
          setGroceryList(updatedGroceryList);
        }
      })
      .catch((err) => {
        console.log("Error updating grocery list: ", err);
      });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (selectedItems: itemType[]) => {
    if (!selectedItems) return;
    if (!groceryList) return;
    if (!groceryList.uuids.includes(user.userId)) return;
    handleUpdateGroceryList(groceryList.id, {
      ...groceryList,
      items: [...selectedItems],
    });
    setIsModalOpen(false);
  };

  const handleUpdateGroceryList = async (
    groceryListId: string,
    groceryListData: GroceryListType
  ) => {
    if (!groceryListData.uuids.includes(user.userId)) return;
    await updateGroceryList(groceryListId, groceryListData)
      .then((res) => {
        if (res.success) {
          setGroceryList(groceryListData);
        }
      })
      .catch((err) => {
        console.log("Error updating grocery list: ", err);
      });
  };

  const handleNavigateToGroceries = () => {
    router.navigate("(app)/(tabs)/groceries");
  };

  const authoriseToPerfomDbAction = () => {
    if (!user) {
      Alert.alert(
        "Not Authorised",
        "You are not authorised to perform this action"
      );
      return false;
    }
    if (!groceryList) {
      Alert.alert(
        "Not Authorised",
        "You are not authorised to perform this action"
      );
      return false;
    }
    if (!groceryList.uuids.includes(user.userId)) {
      Alert.alert(
        "Not Authorised",
        "You are not authorised to perform this action"
      );
      return false;
    }
    return true;
  };

  const handleDeleteGroceryList = async () => {
    if (!authoriseToPerfomDbAction()) return;
    setIsLoading(true);
    await leaveGroceryList(id as string, user.userId);
    ToastAndroid.show("Grocery List Deleted", ToastAndroid.SHORT);
    handleNavigateToGroceries();
    setIsLoading(false);
  };

  const handleShareGroceryList = async () => {
    if (!authoriseToPerfomDbAction()) return;
    const message = `Join my grocery list: ${id}`;

    try {
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error("Error sharing the grocery list:", error);
    }
  };

  const filteredGroceryListItems = useMemo(() => {
    // first unchecked, then the checked items
    // return groceryList?.items.sort((a, b) =>
    //   a.checked === b.checked ? 0 : a.checked ? 1 : -1
    // );
    return groceryList?.items;
  }, [groceryList?.items]);

  const handleEditItemPress = (index: number) => {
    if (!groceryList?.id) return;
    if (!groceryList?.items) return;
    if (!groceryList.uuids.includes(user.userId)) return;
    console.log("Edit Item Pressed: ", index);
    console.log("change unit of item: ", groceryList.items[index]);
    // const updatedItems = [...groceryList.items];
    // updatedItems[index].checked = !updatedItems[index].checked;
    // const updatedGroceryList = { ...groceryList, items: updatedItems };

    // handleUpdateGroceryList(groceryList.id, updatedGroceryList);
  };

  const CustomHeaderChildren = () => {
    return (
      <>
        <RoundButton handlePress={() => handleShareGroceryList()}>
          <Ionicons
            name="share-social-outline"
            size={hp(2.7)}
            color={Colors.white}
          />
        </RoundButton>
        <RoundButton handlePress={() => handleDeleteGroceryList()}>
          <Ionicons name="trash" size={hp(2.7)} color={Colors.white} />
        </RoundButton>
      </>
    );
  };

  const findGroceryListInContext = async (groceryListId: string) => {
    const groceryList = groceryLists.find(
      (groceryList: GroceryListType) => groceryList.id === groceryListId
    );
    if (groceryList) {
      return groceryList;
    }
  };

  const checkedItemsList = useMemo(() => {
    return groceryList?.items.filter((item) => item.checked);
  }, [groceryList?.items]);

  return (
    <>
      <LinearGradient
        style={styles.gradientBackground}
        colors={Colors.light.navHeader}
        start={[0, 0]}
        end={[1, 0]}
      >
        <StatusBar style="light" />
        <CustomHeader
          isTransparent={true}
          hasGoBack={true}
          headerTitle={isLoading ? "Loading..." : groceryList?.name || ""}
          children={CustomHeaderChildren()}
        />
        {groceryList && (
          <LineProgressBarHeader
            checkedItems={
              groceryList?.items.filter((item) => item.checked).length
            }
            totalItems={groceryList?.items.length ?? 0}
          />
        )}

        <LinearGradient
          style={styles.container}
          colors={[Colors.white, "#DDEBF3"]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <LinearGradient
            style={styles.bottomButtonContainer}
            colors={[
              "transparent",
              Colors.white,
              Colors.secondaryWhite,
              Colors.primarySkyBlue,
            ]}
          >
            <StandardButton
              clickHandler={handleOpenModal}
              height={ComponentParams.button.height.medium}
              textValue="Add Item"
              textColor={Colors.white}
              colors={Colors.light.components.button.purple.background}
              borderColor={Colors.light.components.button.purple.border}
              shadowColor={Colors.cardDropShadow}
              iconRight={
                <RoundButton
                  handlePress={handleOpenModal}
                  height={ComponentParams.button.height.medium}
                  transparent={true}
                  children={
                    <Ionicons name="add" size={hp(2.7)} color={Colors.white} />
                  }
                />
              }
            />
          </LinearGradient>
          {isLoading ? (
            <FullScreenLoading />
          ) : (
            groceryList && (
              <>
                <AddGroceryItemModal
                  groceryList={groceryList}
                  isModalOpen={isModalOpen}
                  closeModal={(selectedItems: itemType[]) => {
                    handleCloseModal(selectedItems);
                  }}
                />
                <CustomKeyBoardView>
                  <View style={styles.content}>
                    {filteredGroceryListItems?.length === 0 ? (
                      <Text style={styles.noContentText}>
                        No items in the grocery list
                      </Text>
                    ) : (
                      <View style={styles.ingredientsList}>
                        {filteredGroceryListItems?.map((item, index) => (
                          <GroceryListItem
                            dismissItem={handleDismissItem}
                            key={index}
                            item={item}
                            index={index}
                            itemPressed={handleItemPress}
                          />
                        ))}
                        {checkedItemsList && checkedItemsList.length > 0 && (
                          <View
                            style={{
                              paddingHorizontal: wp(4),
                              marginVertical: hp(1),
                            }}
                          >
                            <StandardButton
                              clickHandler={handleClearCheckedItems}
                              height={ComponentParams.button.height.medium}
                              textValue="Clear Checked Items"
                              textColor={Colors.darkGrey}
                              iconRight={
                                <RoundButton
                                  handlePress={handleClearCheckedItems}
                                  height={ComponentParams.button.height.medium}
                                  transparent={false}
                                  backgroundColor={Colors.primarySkyBlue}
                                  children={
                                    <Ionicons
                                      name="trash"
                                      size={hp(2.7)}
                                      color={Colors.darkGrey}
                                    />
                                  }
                                />
                              }
                              colors={
                                Colors.light.components.button.white.background
                              }
                              borderColor={
                                Colors.light.components.button.white.border
                              }
                              shadowColor={Colors.cardDropShadow}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </CustomKeyBoardView>
              </>
            )
          )}
        </LinearGradient>
      </LinearGradient>
    </>
  );
};

export default GroceryListDetailsScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: wp(1),
  },
  noContentText: {
    marginTop: hp(2),
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  bottomGradient: {
    zIndex: 50,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: hp(15),
  },
  // ingredientsItems:
  ingredientsList: {
    paddingVertical: hp(2),
    paddingBottom: hp(14),
    marginBottom: hp(14),
  },
  text: {
    width: "100%",
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
    textAlignVertical: "center",
  },
  ingredientImage: {
    backgroundColor: "transparent",
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
  },

  bottomButtonContainer: {
    backgroundColor: "transparent",
    width: wp(100),
    height: hp(14),
    justifyContent: "flex-end",
    zIndex: 1000,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    position: "absolute",
    bottom: hp(0),
    left: wp(0),
  },
  clearButton: {
    flexDirection: "row",
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    height: hp(ComponentParams.button.height.medium),
    paddingHorizontal: wp(4),
    elevation: 2,
    shadowColor: Colors.cardDropShadow,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
