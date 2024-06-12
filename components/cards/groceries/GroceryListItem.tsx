import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { itemType } from "./AddGroceryItemModal";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  clamp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import RoundButton from "@/components/buttons/RoundButton";
import { LinearGradient } from "expo-linear-gradient";

interface GroceryListItemProps {
  item: itemType;
  index: number;
  itemPressed: (index: number) => void;
  itemEditPressed?: (index: number) => void;
  dismissItem: (index: number) => void;
}

const TRANSLATE_X_TRHESHOLD = -wp(30);

const GroceryListItem: React.FC<GroceryListItemProps> = ({
  index,
  item,
  itemPressed,
  itemEditPressed,
  dismissItem,
}) => {
  const translationX = useSharedValue(0);
  const isPanning = useSharedValue<boolean>(false);

  const prevTranslationX = useSharedValue(0);
  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = withTiming(translationX.value, { duration: 0 });
      isPanning.value = true;
    })
    .onUpdate((event) => {
      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -wp(100),
        0
      );
    })
    .onEnd((event) => {
      isPanning.value = false;
      if (event.translationX < TRANSLATE_X_TRHESHOLD) {
        dismissItem(index);
        translationX.value = withTiming(-wp(100));
      } else {
        translationX.value = withTiming(0);
      }
    })
    .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  const containerAnimatedStyles = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      isPanning.value ? Colors.secondaryWhite : "rgba(0,0,0,0)"
    );
    return {
      backgroundColor,
    };
  });

  const trashIconContainerAnimatedStyles = useAnimatedStyle(() => {
    const opacity = withTiming(
      translationX.value < TRANSLATE_X_TRHESHOLD ? 1 : 0
    );
    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyles]}>
      <Animated.View
        style={[styles.trashIconContainer, trashIconContainerAnimatedStyles]}
      >
        <RoundButton
          backgroundColor={Colors.primarySkyBlue}
          transparent={false}
          children={<Ionicons name="trash" size={hp(2.7)} color={"#C70000"} />}
          handlePress={() => dismissItem(index)}
        />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View key={index} style={[styles.groceryItem, animatedStyles]}>
          <TouchableOpacity
            onPress={() => {
              itemPressed(index);
            }}
            style={[
              styles.checkItemButton,
              item.checked
                ? { backgroundColor: Colors.mediumPurple }
                : {
                    backgroundColor: Colors.secondaryWhite,
                  },
            ]}
          >
            {item.checked ? (
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
              style={styles.gradientContainer}
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
                {item.name}
              </Text>
            </View>
            {item.qty > 1 && (
              <View
                style={{
                  paddingRight: wp(4),
                  flexDirection: "row",
                  gap: wp(2),
                }}
              >
                <Text style={[styles.qtyText]}>{item.qty}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default GroceryListItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
    paddingLeft: wp(4),
    width: "100%",
    alignItems: "center",
  },
  trashIconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  groceryItem: {
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyText: {
    textAlignVertical: "center",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_2.fontSize,
    color: Colors.darkGrey,
    lineHeight: Fonts.text_2.lineHeight,
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
  ingredientItem: {
    marginHorizontal: wp(4),
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.white,
    backgroundColor: Colors.white,
    alignItems: "center",
    elevation: 10,
    flex: 1,
    shadowColor: Colors.cardDropShadow,
    flexDirection: "row",
    gap: wp(2),
    height: hp(ComponentParams.button.height.medium),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
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
