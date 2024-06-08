import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  Share,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomSheetModal from "@/components/modals/CustomSheetModal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import StandardButton from "@/components/buttons/StandardButton";
import ComponentParams from "@/constants/ComponentParams";
import { Ionicons } from "@expo/vector-icons";
import RoundButton from "@/components/buttons/RoundButton";
import Fonts from "@/constants/Fonts";
import Colors from "@/constants/Colors";
import { GroceryListType } from "@/services/db/groceries.services";
import { GroceryItemCategoryType } from "@/models/GroceryItemCategoryType";
import groceryItemCategoryTypes from "@/constants/groceries/GroceryItemCategoryTypes";
import { LinearGradient } from "expo-linear-gradient";
import FullScreenLoading from "@/components/FullScreenLoading";

export type itemType = {
  name: string;
  checked: boolean;
  qty: number;
};

const AddGroceryItemModal = ({
  groceryList,
  isModalOpen = false,
  closeModal,
}: {
  groceryList: GroceryListType;
  isModalOpen?: boolean;
  closeModal?: (selectedItems: itemType[]) => void;
}) => {
  const [searchInputField, setSearchInputField] = React.useState<string>("");
  const searchInputRef = React.useRef<TextInput>(null);
  const modalRef = React.useRef<BottomSheetModal>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedItems, setSelectedItems] = React.useState<itemType[]>([]);
  const [groceryItemCategories, setGroceryItemCategories] = React.useState<
    GroceryItemCategoryType[]
  >(groceryItemCategoryTypes);

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
      setSearchInputField("");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (groceryList?.items?.length) {
      const existingItems = groceryList.items.map((item) => ({
        name: item.name,
        checked: item.checked,
        qty: item.qty || 1, // Assuming qty is part of the groceryList items
      }));
      setSelectedItems(existingItems);
    }
  }, [groceryList]);

  const handleSheetChanges = (index: number) => {
    console.log("Sheet Changes", index);
    if (index === -1) {
      closeModal ? closeModal(selectedItems) : () => {};
    }
  };

  const handleItemPress = (item: string) => {
    const itemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.name === item
    );

    if (itemIndex === -1) {
      setSelectedItems((prevItems) => [
        ...prevItems,
        { name: item, checked: false, qty: 1 },
      ]);
    } else {
      // if already selected, then add qty by 1
      const updatedItems = [...selectedItems];
      updatedItems[itemIndex].qty += 1;
      setSelectedItems(updatedItems);
    }
  };

  const addItemIfNotExists = (item: string) => {
    const itemExists = groceryItemCategories.some((category) =>
      category.items.includes(item)
    );

    if (!itemExists) {
      const updatedCategories = [...groceryItemCategories];
      const uncategorizedCategory = updatedCategories.find(
        (category) => category.name === "Uncategorized"
      );

      if (uncategorizedCategory) {
        uncategorizedCategory.items.push(item);
      } else {
        updatedCategories.push({
          name: "Uncategorized",
          items: [item],
        });
      }

      setGroceryItemCategories(updatedCategories);
      handleItemPress(item);
      setSearchInputField(""); // Clear the input field
    }
  };

  const filteredGroceryItemCategories = useMemo(() => {
    setIsLoading(true); // Set loading state to true

    let filteredCategories;

    if (searchInputField.length > 0) {
      filteredCategories = groceryItemCategories
        .map((category) => ({
          name: category.name,
          items: category.items.filter((item) =>
            item.toLowerCase().includes(searchInputField.toLowerCase())
          ),
        }))
        .filter((category) => category.items.length > 0); // Remove empty categories
    } else {
      filteredCategories = groceryItemCategories;
    }

    setIsLoading(false); // Set loading state to false

    return filteredCategories;
  }, [searchInputField, groceryItemCategories]);

  const handleSubstractItemQuantity = (item: string) => {
    const itemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.name === item
    );

    if (itemIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[itemIndex].qty -= 1;

      if (updatedItems[itemIndex].qty === 0) {
        updatedItems.splice(itemIndex, 1);
      }

      setSelectedItems(updatedItems);
    }
  };

  const amountOfItemsShown = useMemo(() => {
    return filteredGroceryItemCategories.reduce(
      (acc, category) => acc + category.items.length,
      0
    );
  }, [filteredGroceryItemCategories]);

  const isItemAlreadySelected = (item: string) => {
    return selectedItems.some((selectedItem) => selectedItem.name === item);
  };

  const getItemSelectedQty = (item: string) => {
    const selectedItem = selectedItems.find(
      (selectedItem) => selectedItem.name === item
    );
    return selectedItem ? selectedItem.qty : 0;
  };

  const CustomSheetModalHeaderChildren = () => (
    <View>
      <View style={styles.headerTextContainer}>
        <View>
          <Text style={styles.modalHeaderTitle}>Add Item</Text>
          <Text style={styles.subTitle}>{groceryList.name}</Text>
        </View>
        <View>
          <Text style={styles.countText}>{selectedItems.length} selected</Text>
        </View>
      </View>
      <View style={styles.contentItemInputContainer}>
        <Ionicons
          name="search"
          size={hp(2.7)}
          color={Colors.light.components.inputField.placeholderTextColor}
        />
        <TextInput
          autoComplete="off"
          ref={searchInputRef}
          value={searchInputField}
          onChangeText={(text) => setSearchInputField(text)}
          style={styles.contentItemInput}
          placeholder="Add new item..."
          placeholderTextColor={
            Colors.light.components.inputField.placeholderTextColor
          }
          onSubmitEditing={() => addItemIfNotExists(searchInputField)}
        />
        {searchInputField.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchInputField("")}
            style={styles.clearButton}
          >
            <Text style={styles.filteredResultsCountText}>
              {amountOfItemsShown} results
            </Text>
            <RoundButton
              handlePress={() => setSearchInputField("")}
              backgroundColor={Colors.primarySkyBlue}
              transparent={false}
              height={ComponentParams.button.height.small}
              children={
                <Ionicons name="close" size={hp(2.7)} color={Colors.darkGrey} />
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const CustomSheetModalFooterChildren = () => {
    return (
      <View>
        <StandardButton
          clickHandler={() => {
            closeModal ? closeModal(selectedItems) : () => {};
          }}
          height={ComponentParams.button.height.medium}
          textValue="Done"
          textColor={Colors.white}
          colors={Colors.light.components.button.purple.background}
          borderColor={Colors.light.components.button.purple.border}
          shadowColor={Colors.cardDropShadow}
          iconRight={
            <RoundButton
              handlePress={() => {
                closeModal ? closeModal(selectedItems) : () => {};
              }}
              height={ComponentParams.button.height.medium}
              transparent={true}
              children={
                <Ionicons
                  name="checkmark"
                  size={hp(2.7)}
                  color={Colors.white}
                />
              }
            />
          }
        />
      </View>
    );
  };

  const CustomSheetModalScrollViewChildren = () => {
    return (
      <>
        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <View style={styles.categoryItemListContainer}>
            {filteredGroceryItemCategories.map((category, index) => (
              <View style={styles.groceryCategryItemContainer} key={index}>
                <Text style={styles.itemsCategoryTitle}>{category.name}</Text>
                {category.items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.groceryItem}
                    onPress={() => {
                      handleItemPress(item);
                    }}
                  >
                    <RoundButton
                      handlePress={() => {
                        handleItemPress(item);
                      }}
                      transparent={false}
                      backgroundColor={
                        isItemAlreadySelected(item)
                          ? Colors.mediumBlue
                          : Colors.secondaryWhite
                      }
                      height={ComponentParams.button.height.medium}
                      children={
                        <Ionicons
                          name="add"
                          size={hp(2.7)}
                          color={
                            isItemAlreadySelected(item)
                              ? Colors.white
                              : Colors.darkGrey
                          }
                        />
                      }
                    />
                    <View style={styles.ingredientItem}>
                      <LinearGradient
                        style={styles.itemGradientContainer}
                        colors={[Colors.white, Colors.secondaryWhite]}
                        start={[0, 0]}
                        end={[1, 1]}
                      />
                      <View
                        style={{
                          height: hp(ComponentParams.button.height.medium),
                          flexDirection: "row",
                          gap: wp(2),
                          flex: 1,
                          paddingLeft: wp(4),
                        }}
                      >
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={[styles.text]}
                        >
                          {item}
                        </Text>
                      </View>
                      {isItemAlreadySelected(item) && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: wp(2),
                          }}
                        >
                          <Text style={[styles.qtyText]}>
                            {getItemSelectedQty(item)}
                          </Text>
                          <RoundButton
                            children={
                              <Ionicons
                                name="remove"
                                size={hp(2.7)}
                                color={"#C70000"}
                              />
                            }
                            transparent={false}
                            backgroundColor={Colors.primarySkyBlue}
                            height={ComponentParams.button.height.medium}
                            handlePress={() => {
                              handleSubstractItemQuantity(item);
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <View>
      <CustomSheetModal
        handleSheetChanges={(index: number) => handleSheetChanges(index)}
        hasBackdrop={true}
        modalRef={modalRef}
        snapPoints={[hp(100)]}
        headerChildren={CustomSheetModalHeaderChildren()}
        footerChildren={CustomSheetModalFooterChildren()}
        scrollViewChildren={CustomSheetModalScrollViewChildren()}
      />
    </View>
  );
};

export default AddGroceryItemModal;

const styles = StyleSheet.create({
  sheetModalHeaderTitle: {
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
    lineHeight: Fonts.heading_3.lineHeight,
    color: Colors.darkBlue,
  },
  contentItemInputContainer: {
    backgroundColor: Colors.secondaryWhite,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium),
    paddingRight: wp(2),
    paddingLeft: wp(4),
    paddingVertical: hp(1),
    marginTop: hp(1),
    gap: wp(2),
  },
  contentItemInput: {
    height: hp(ComponentParams.button.height.medium),
    flex: 1,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
  filteredResultsCountText: {
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_3.lineHeight,
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
  countText: {
    textAlignVertical: "center",
    lineHeight: Fonts.text_2.lineHeight,
    fontFamily: Fonts.text_2.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemsCategoryTitle: {
    textTransform: "capitalize",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    color: Colors.darkBlue,
    lineHeight: Fonts.text_1.lineHeight,
  },
  /* Grocery Item */
  groceryItem: {
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    justifyContent: "space-between",
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
  addItemButtonContainer: {
    position: "absolute",
    zIndex: 100,
    width: "100%",
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
    flex: 1,
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    backgroundColor: Colors.white,
    alignItems: "center",
    elevation: 10,
    shadowColor: Colors.cardDropShadow,
    flexDirection: "row",
    gap: wp(2),
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  itemGradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  categoryItemListContainer: {
    width: "100%",
    flexDirection: "column",
    marginBottom: hp(8),
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
    gap: hp(2),
  },
  groceryCategryItemContainer: {
    width: "100%",
    flexDirection: "column",
    gap: hp(2),
  },
  qtyText: {
    textAlignVertical: "center",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
  },
});
