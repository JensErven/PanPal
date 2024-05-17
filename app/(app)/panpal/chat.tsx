import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import CustomHeader from "@/components/navigation/CustomHeader";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import ComponentParams from "@/constants/ComponentParams";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import { Message } from "@/models/Message";
import ChatInputBar from "@/components/ChatInputBar";
import { openaiServices } from "@/services/api/openai.services";
import MessageCard from "@/components/MessageCard";
import { blurhash } from "@/utils/common";
import { Image } from "expo-image";
import panPalIcon from "@/assets/images/panpal-icon-medium.png";
import IntroMessageCard from "@/components/cards/IntroMessageCard";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { mealTypes } from "@/constants/tastePreferences/MealTypes";

const PanPalChatScreen = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [randomIntro, setRandomIntro] = React.useState<{
    greeting: string;
    introText: string;
    cuisineType: string;
    mealType: string;
  }>({ greeting: "", introText: "", cuisineType: "", mealType: "" });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = (message: Message) => {
    setIsLoading(true);
    setMessages((prevMessages) => [...prevMessages, message]); // Using callback form of setMessages
    openaiServices.createCompletion([...messages, message]).then((response) => {
      const chatCompletionMessage: Message = {
        role: response.role,
        content: response.content || "", // Ensure content is always a string
      };
      setMessages((prevMessages) => [...prevMessages, chatCompletionMessage]);
      setIsLoading(false);
    });
  };

  const generateRandomIntro = () => {
    const greetings = [
      "Hi there! I'm PanPal 🍳",
      "Hello! I'm PanPal 🍳",
      "Hey! I'm PanPal 🍳",
      "Hi! I'm PanPal 🍳",
    ];
    const introTexts = [
      "I'm here to help you with recipes and cooking tips. What would you like to do?",
      "I'm here to help you with recipes and cooking tips. What can I do for you?",
      "I'm here to help you with recipes and cooking tips. What can I help you with?",
    ];
    const cuisineType =
      cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)].name;
    const mealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];

    const randomIntro = {
      greeting: greetings[Math.floor(Math.random() * greetings.length)],
      introText: introTexts[Math.floor(Math.random() * introTexts.length)],
      cuisineType: cuisineType,
      mealType: mealType,
    };

    setRandomIntro(randomIntro);
  };

  useEffect(() => {
    generateRandomIntro();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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
        headerTitle={"PanPal Chat"}
        hasGoBack={true}
        children={
          <View style={styles.panpalCreditsContainer}>
            <View style={styles.helpButton}>
              <Ionicons name="help" size={hp(2.7)} color={Colors.white} />
            </View>
            <Text style={styles.panpalCreditsText}>15</Text>
            <LinearGradient
              style={styles.panpalCreditsButtonContainer}
              colors={[
                Colors.light.components.button.gold.background[0],
                Colors.light.components.button.gold.background[1],
              ]}
              start={[0.5, 0]}
              end={[0.5, 1]}
            >
              <Text style={styles.panpalCreditsButtonText}>pp</Text>
            </LinearGradient>
          </View>
        }
      />
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <ScrollView contentContainerStyle={styles.content} ref={scrollViewRef}>
          <IntroMessageCard
            image={panPalIcon}
            title={randomIntro.greeting}
            text={randomIntro.introText}
            options={[
              "Get some suggestions",
              "Get a random cooking tip",
              `Try a "${randomIntro.cuisineType}" recipe`,
              `Give me a "${randomIntro.mealType}" suggestion`,
            ]}
            index={0}
            selectOption={handleSendMessage}
          />
          {messages.map((message, index) => (
            <MessageCard
              message={message}
              index={index}
              selectRecipeOption={handleSendMessage}
            />
          ))}
          {isLoading && (
            <ActivityIndicator size="large" color={Colors.darkBlue} />
          )}
        </ScrollView>
      </LinearGradient>
      <ChatInputBar sendMessage={handleSendMessage} isLoading={isLoading} />
    </LinearGradient>
  );
};

export default PanPalChatScreen;

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
    padding: wp(4),
    gap: hp(4),
  },
  messageText: {
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    lineHeight: Fonts.text_2.lineHeight,
  },
  panpalImage: {
    width: wp(30),
    height: wp(30),
    alignSelf: "center",
  },
  title: {
    width: wp(80),
    fontSize: Fonts.text_1.fontSize,
    fontFamily: Fonts.text_1.fontFamily,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.darkBlue,
    textAlign: "center",
  },
  panPalGreeting: {
    justifyContent: "center",
    alignItems: "center",
    gap: hp(1),
    marginTop: hp(4),
  },
  panpalCreditsButtonContainer: {
    backgroundColor: Colors.light.components.button.gold.background[0], // Set the background color to represent a coin
    borderRadius: hp(ComponentParams.button.height.small / 2), // Rounded border
    width: hp(ComponentParams.button.height.small),
    height: hp(ComponentParams.button.height.small),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // Border width
    borderColor: Colors.light.components.button.gold.border, // Border color
  },
  panpalCreditsText: {
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_1.fontSize,
    lineHeight: Fonts.text_1.lineHeight,
    color: Colors.white,
  },
  panpalCreditsButtonText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: Fonts.text_1.fontFamily,
    fontSize: Fonts.text_3.fontSize,
    lineHeight: Fonts.text_3.lineHeight,
    color: Colors.darkGold,
  },
  panpalCreditsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(1),
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: hp(ComponentParams.button.height.medium),
    paddingHorizontal: wp(2),
    borderRadius: hp(ComponentParams.button.height.medium / 2),
  },
  helpButton: {
    height: hp(ComponentParams.button.height.small),
    width: hp(ComponentParams.button.height.small),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(ComponentParams.button.height.small / 2),
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
