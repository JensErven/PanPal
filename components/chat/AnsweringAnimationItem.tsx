import { View, StyleSheet, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

const AnsweringAnimationItem: React.FC = () => {
  const dotAnimation1 = useRef(new Animated.Value(0)).current;
  const dotAnimation2 = useRef(new Animated.Value(0)).current;
  const dotAnimation3 = useRef(new Animated.Value(0)).current;

  const bounceAnimation = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 500,
          delay: delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    bounceAnimation(dotAnimation1, 0);
    bounceAnimation(dotAnimation2, 250);
    bounceAnimation(dotAnimation3, 500);
  }, []);

  const translateY = (dotAnimation: Animated.Value) =>
    dotAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -hp(1)],
    });

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradientContainer}
        colors={[Colors.white, Colors.secondaryWhite, Colors.primarySkyBlue]}
        start={[0, 0]}
        end={[1, 1]}
      />
      <View style={styles.dotsListContainer}>
        <Animated.View
          style={[
            styles.dotContainer,
            { transform: [{ translateY: translateY(dotAnimation1) }] },
          ]}
        >
          <LinearGradient
            colors={Colors.light.components.button.purple.background}
            style={styles.dot}
            start={[0, 0]}
            end={[1, 1]}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.dotContainer,
            { transform: [{ translateY: translateY(dotAnimation2) }] },
          ]}
        >
          <LinearGradient
            colors={Colors.light.components.button.purple.background}
            style={styles.dot}
            start={[0, 0]}
            end={[1, 1]}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.dotContainer,
            { transform: [{ translateY: translateY(dotAnimation3) }] },
          ]}
        >
          <LinearGradient
            colors={Colors.light.components.button.purple.background}
            style={styles.dot}
            start={[0, 0]}
            end={[1, 1]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default AnsweringAnimationItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    elevation: 10,
    height: hp(ComponentParams.button.height.medium),
    shadowColor: Colors.cardDropShadow,
    position: "relative",
  },
  gradientContainer: {
    borderRadius: hp(ComponentParams.button.height.medium / 2),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dotContainer: {
    marginHorizontal: wp(0.5),
  },
  dot: {
    elevation: 2,
    shadowColor: Colors.darkBlue,
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
  },
  dotsListContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
