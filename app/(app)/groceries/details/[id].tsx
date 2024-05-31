import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  Share,
} from "react-native";
import React, { useEffect } from "react";
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
} from "@/services/db/groceries.services";
import CustomHeader from "@/components/navigation/CustomHeader";
import { StatusBar } from "expo-status-bar";
import FullScreenLoading from "@/components/FullScreenLoading";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import ComponentParams from "@/constants/ComponentParams";
import { GroceriesContext, useGroceries } from "@/context/GroceriesContext";

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

  useEffect(() => {
    if (!groceryList) return;
    console.log("GroceryList: ", groceryList);
    if (groceryList.uuids.includes(user.userId)) return;
    router.back();
  }, [groceryList]);

  const handleNavigateToGroceries = () => {
    router.navigate("(app)/(tabs)/groceries");
  };

  const handleDeleteGroceryList = async () => {
    if (!user && id === "") return;
    setIsLoading(true);
    await leaveGroceryList(id as string, user.userId);
    ToastAndroid.show("Grocery List Deleted", ToastAndroid.SHORT);
    handleNavigateToGroceries();
    setIsLoading(false);
  };

  const handleShareGroceryList = async () => {
    if (!user && id === "" && !groceryList) return;
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

      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
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
                <Text>{groceryList.name}</Text>
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
});
