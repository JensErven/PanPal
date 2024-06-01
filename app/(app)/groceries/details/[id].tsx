import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  Share,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { AuthContext } from "@/context/authContext";
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
import { GroceriesContext, useGroceries } from "@/context/GroceriesContext";
import LineProgressBarHeader from "@/components/headers/LineProgressBarHeader";
import Fonts from "@/constants/Fonts";
import { Image } from "expo-image";
import { blurhash } from "@/utils/general.utils";

const GroceryListDetailsScreen = () => {
  const { user } = React.useContext<any>(AuthContext);
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [groceryList, setGroceryList] = React.useState<
    GroceryListType | undefined
  >(undefined);
  const { groceryLists } = useGroceries();

  // retrieve groceryList based on id
  useFocusEffect(
    React.useCallback(() => {
      if (id === "") return;
      setIsLoading(true);
      findGroceryListInContext(id as string)
        .then((res) => {
          console.log("Found GroceryList in Context: ", res);
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
    }, [id])
  );

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

  const handleAddGroceryItem = async () => {
    // if (!groceryList) return;
    // if (!groceryList.uuids.includes(user.userId)) return;
    // router.navigate("(app)/(tabs)/groceries/add-item", {
    //   groceryListId: groceryList.id,
    // });
    if (!groceryList) return;
    const newItem = { name: "New Item", checked: false };
    groceryList.items.push(newItem);
    await updateGroceryList(groceryList.id, {
      ...groceryList,
      items: groceryList.items,
    }).then((res) => {
      if (res.success) {
        setGroceryList({ ...groceryList, items: groceryList.items });
      }
    });
  };

  useEffect(() => {
    if (!groceryList) return;
    console.log("GroceryList: ", groceryList);
    if (groceryList.uuids.includes(user.userId)) return;
    router.back();
  }, [groceryList]);

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
  return (
    <LinearGradient
      style={styles.gradientBackground}
      colors={[
        Colors.light.navHeader[0],
        Colors.light.navHeader[1],
        Colors.light.navHeader[2],
      ]}
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
      <LineProgressBarHeader
        checkedItems={
          groceryList?.items.filter((item) => item.checked).length ?? 0
        }
        totalItems={groceryList?.items.length ?? 0}
      />
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <View
          style={{
            position: "absolute",
            bottom: hp(2),
            right: wp(4),
            zIndex: 100,
          }}
        >
          <RoundButton
            transparent={false}
            backgroundColor={Colors.mediumPurple}
            handlePress={handleAddGroceryItem}
            children={
              <Ionicons name="add" size={hp(2.7)} color={Colors.white} />
            }
          />
        </View>
        <LinearGradient
          style={styles.bottomGradient}
          colors={["transparent", Colors.secondaryWhite, Colors.primarySkyBlue]}
          start={[0.5, 0]}
          end={[0.5, 1]}
        />
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          groceryList && (
            <CustomKeyBoardView>
              <View style={styles.content}>
                <View style={styles.ingredientsList}>
                  {groceryList.items.map((ingredient, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.groceryItem}
                      onPress={() => {
                        handleItemPress(index);
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          handleItemPress(index);
                        }}
                        style={[
                          styles.checkItemButton,
                          ingredient.checked
                            ? { backgroundColor: Colors.mediumPurple }
                            : { backgroundColor: Colors.secondaryWhite },
                        ]}
                      >
                        {ingredient.checked ? (
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={hp(ComponentParams.button.height.small)}
                            color={Colors.white}
                          />
                        ) : (
                          <Ionicons
                            name="ellipse-outline"
                            size={hp(ComponentParams.button.height.small)}
                            color={Colors.white}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={styles.ingredientItem}>
                        <LinearGradient
                          style={styles.stepNumber}
                          colors={[Colors.white, Colors.primarySkyBlue]}
                        >
                          <Ionicons
                            name="image"
                            size={hp(2.7)}
                            color={Colors.primarySkyBlue}
                          />
                        </LinearGradient>
                        <Text style={[styles.text]}>{ingredient.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </CustomKeyBoardView>
          )
        )}
      </LinearGradient>
    </LinearGradient>
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
  content: {
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    paddingBottom: hp(20),
    gap: hp(4),
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
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    gap: hp(2),
    flexDirection: "column",
    paddingBottom: hp(4),
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
  groceryItem: {
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepNumber: {
    backgroundColor: Colors.secondaryWhite,
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    aspectRatio: 1,
    width: hp(ComponentParams.button.height.medium),
    height: hp(ComponentParams.button.height.medium),
  },
  ingredientImage: {
    backgroundColor: "transparent",
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
  },
  ingredientItem: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    gap: wp(2),
    flex: 1,
    alignItems: "center",
    minHeight: hp(ComponentParams.button.height.large),
    width: "100%",
    paddingVertical: wp(1),
    paddingHorizontal: wp(1),
    borderWidth: 1,
    borderColor: Colors.primarySkyBlue,
    borderRadius: hp(ComponentParams.button.height.large / 2),
  },
  checkItemButton: {
    height: hp(ComponentParams.button.height.small),
    width: hp(ComponentParams.button.height.small),
    borderRadius: hp(ComponentParams.button.height.small / 2),
    backgroundColor: Colors.primarySkyBlue,
    borderColor: Colors.secondaryWhite,
    justifyContent: "center",
    alignItems: "center",
  },
});
