import {
  View,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Animated,
} from "react-native";
import React from "react";
import FullScreenLoading from "@/components/FullScreenLoading";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import CustomHeader from "@/components/navigation/CustomHeader";
import RoundButton from "@/components/buttons/RoundButton";
import { Ionicons } from "@expo/vector-icons";
import {
  GroceryListType,
  createGroceryList,
} from "@/services/db/groceries.services";
import { Timestamp } from "firebase/firestore";
import { AuthContext } from "@/context/authContext";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ComponentParams from "@/constants/ComponentParams";
import StandardButton from "@/components/buttons/StandardButton";
import Fonts from "@/constants/Fonts";
import OptionTagButton from "@/components/buttons/OptionTagButton";

const GroceryListAddScreen = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [groceryListName, setGroceryListName] = React.useState<string>("");
  const { user } = React.useContext<any>(AuthContext);
  const nameSuggestions = [
    "Weekly Groceries",
    "Monthly Groceries",
    "Shopping List",
    "Grocery List",
    "Market List",
    "Supermarket List",
  ];

  // const handleNavigateToGroceryList = async (groceryListId: string) => {
  //   router.push({
  //     pathname: `/groceries/details/[id]`,
  //     params: { id: groceryListId },
  //   });
  // };

  const handleAddGroceryList = async (groceryListName: string) => {
    if (!user) return;
    if (groceryListName === "") {
      ToastAndroid.show(
        "Please enter a name for the grocery list",
        ToastAndroid.SHORT
      );
      return;
    }
    setIsLoading(true);
    const newGroceryList: GroceryListType = {
      id: "",
      name: groceryListName,
      uuids: [user.userId],
      items: [],
      createdAt: Timestamp.now(),
    };
    await createGroceryList(newGroceryList).then((res) => {
      ToastAndroid.show("Grocery List Created", ToastAndroid.SHORT);

      if (!res.groceryListData) return;

      setIsLoading(false);
      // handleNavigateToGroceryList(res.groceryListData.id);
      router.back();
    });
  };

  const headerChildren = () => {
    return (
      <RoundButton
        handlePress={() => handleAddGroceryList(groceryListName.trim())}
      >
        <Ionicons name="checkmark" size={hp(2.7)} color={Colors.white} />
      </RoundButton>
    );
  };

  return (
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
        headerTitle={"Create Grocery List"}
        children={headerChildren()}
      />
      <View
        style={{
          position: "absolute",
          bottom: hp(2),
          right: wp(4),
          zIndex: 1000,
        }}
      ></View>
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <CustomKeyBoardView>
            <View style={styles.content}>
              <View style={{ flexDirection: "column", gap: hp(2) }}>
                <View style={styles.contentItem}>
                  <View style={styles.contentItemInputContainer}>
                    <Ionicons
                      name="pencil"
                      size={hp(2.7)}
                      color={Colors.primarySkyBlue}
                    />
                    <TextInput
                      value={groceryListName}
                      onChangeText={setGroceryListName}
                      style={styles.contentItemInput}
                      placeholder="Grocery list name"
                      placeholderTextColor={Colors.primarySkyBlue}
                    />
                    {groceryListName.length > 0 && (
                      <RoundButton
                        transparent={false}
                        backgroundColor={Colors.primarySkyBlue}
                        handlePress={() => setGroceryListName("")}
                      >
                        <Ionicons
                          name="close"
                          size={hp(2.7)}
                          color={Colors.darkGrey}
                        />
                      </RoundButton>
                    )}
                  </View>
                </View>
                <View style={styles.contentItem}>
                  <Text style={styles.inputLabel}>Suggestions</Text>
                  <View style={styles.suggestionsListContainer}>
                    {nameSuggestions.map((suggestion, index) => (
                      <OptionTagButton
                        key={index}
                        option={suggestion}
                        selectOption={setGroceryListName}
                        selected={suggestion === groceryListName}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <StandardButton
                iconRight={
                  <Ionicons
                    name="checkmark"
                    size={hp(2.7)}
                    color={Colors.white}
                    style={{ marginRight: wp(4) }}
                  />
                }
                textValue="Save"
                clickHandler={() =>
                  handleAddGroceryList(groceryListName.trim())
                }
                colors={Colors.light.components.button.purple.background}
                textColor={Colors.white}
                height={ComponentParams.button.height.medium}
              />
            </View>
          </CustomKeyBoardView>
        )}
      </LinearGradient>
    </LinearGradient>
  );
};

export default GroceryListAddScreen;

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
    flexDirection: "column",
    justifyContent: "space-between",
    borderTopLeftRadius: hp(ComponentParams.button.height.medium),
    flex: 1,
    padding: wp(4),
    gap: hp(2),
    paddingBottom: hp(2),
  },
  contentItemInput: {
    height: hp(ComponentParams.button.height.large),
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  contentItemInputContainer: {
    backgroundColor: Colors.secondaryWhite,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: hp(ComponentParams.button.height.large),
    borderRadius: hp(ComponentParams.button.height.large),
    paddingRight: wp(1),
    paddingLeft: wp(4),
    gap: wp(2),
  },
  clearButton: {
    height: hp(ComponentParams.button.height.small),
    flexDirection: "row",
    textAlignVertical: "center",
    gap: wp(1),
    borderRadius: hp(ComponentParams.button.height.small / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  contentItem: {
    gap: hp(1),
    borderRadius: hp(2),
  },
  inputLabel: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  suggestionsListContainer: {
    flexWrap: "wrap",
    flex: 1,
    gap: hp(1),
    flexDirection: "row",
  },
});
