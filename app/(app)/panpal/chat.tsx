import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeader from "@/components/navigation/CustomHeader";
import Colors from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import ComponentParams from "@/constants/ComponentParams";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "@/constants/Fonts";
import { Message } from "@/models/Message";
import ChatInputBar from "@/components/ChatInputBar";
import { openaiServices } from "@/services/api/openai.services";
import MessageCard from "@/components/MessageCard";
import * as Haptics from "expo-haptics";
import panPalIcon from "@/assets/images/panpal-icon-medium.png";
import IntroMessageCard from "@/components/cards/IntroMessageCard";
import { cuisineTypes } from "@/constants/tastePreferences/CuisineTypes";
import { mealTypes } from "@/constants/tastePreferences/MealTypes";
import PopUp from "@/components/modals/PopUp";
import { AuthContext, UserCreditsType } from "@/context/authContext";

const PanPalChatScreen = () => {
  const {
    user,
    credits,
    substractCredits,
  }: {
    user: any;
    credits: UserCreditsType;
    substractCredits: (amount: number) => void;
  } = React.useContext<any>(AuthContext);

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [shouldShowCreditAlert, setShouldShowCreditAlert] =
    React.useState<boolean>(false);
  const [shouldShowCreditsInfoPopUp, setShouldShowCreditsInfoPopUp] =
    React.useState<boolean>(false);
  const [randomIntro, setRandomIntro] = React.useState<{
    greeting: string;
    introText: string;
    cuisineType: string;
    mealType: string;
  }>({ greeting: "", introText: "", cuisineType: "", mealType: "" });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = async (message: Message) => {
    if (credits.credits === 0) {
      setShouldShowCreditAlert(true);
      return;
    }

    setIsLoading(true);
    setMessages((prevMessages) => [...prevMessages, message]); // Using callback form of setMessages

    try {
      const response = await openaiServices.createCompletion([
        ...messages,
        message,
      ]);

      const chatCompletionMessage: Message = {
        role: response.role,
        content: response.content || "", // Ensure content is always a string
      };

      setMessages((prevMessages) => [...prevMessages, chatCompletionMessage]);

      // Deduct 1 credit from the user
      substractCredits(1);
    } catch (error) {
      console.error("Error in getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomIntro = () => {
    const greetings = [
      `Hi there${user.username ? " " + user.username : ""}! I'm PanPal 🍳`,
      `Hello${user.username ? " " + user.username : ""}! I'm PanPal 🍳"`,
      `Hey${user.username ? " " + user.username : ""}! I'm PanPal 🍳"`,
      `Hi${user.username ? " " + user.username : ""}! I'm PanPal 🍳"`,
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
    // if new message a assistant message then notify user
    if (messages[messages.length - 1]?.role !== "assistant") return;
    // notify user that a new message has been received
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // scroll to the end of the chat
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleCreditAlertClose = () => {
    // Handle closing the credit alert
    setShouldShowCreditAlert(false);
  };

  const handleCreditsInfoPopUpClose = () => {
    // Handle closing the info pop up
    setShouldShowCreditsInfoPopUp(false);
  };

  return (
    <>
      {shouldShowCreditAlert && (
        <PopUp
          icon={
            <Ionicons name="alert" size={hp(2.7)} color={Colors.darkBlue} />
          }
          title="Out of PanPal Credits"
          text="You're out of PanPal credits. Every day, your PanPal credits are reset to 50. You can wait for the next day to receive additional credits."
          close={handleCreditAlertClose}
        />
      )}
      {shouldShowCreditsInfoPopUp && (
        <PopUp
          icon={<Ionicons name="help" size={hp(2.7)} color={Colors.darkBlue} />}
          title="PanPal Credits Info"
          text="PanPal credits are used to interact with PanPal features. Such as getting recipe suggestions, cooking tips, enhancing recipes, generating recipe images,
          and more. Every day, your PanPal credits are reset to 50. In case your credits are fully used up, you can wait for the next day to receive additional credits."
          close={handleCreditsInfoPopUpClose}
        />
      )}

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
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => setShouldShowCreditsInfoPopUp(true)}
              >
                <Ionicons name="help" size={hp(2.7)} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.panpalCreditsText}>{credits.credits}</Text>
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
          <ScrollView
            contentContainerStyle={styles.content}
            ref={scrollViewRef}
          >
            <IntroMessageCard
              disableSelectOption={isLoading}
              image={panPalIcon}
              title={randomIntro.greeting}
              text={randomIntro.introText}
              options={[
                "Get some suggestions",
                "Get a random cooking tip",
                `Try a "${randomIntro.cuisineType}" recipe`,
                `Give me a "${randomIntro.mealType}" suggestion`,
              ]}
              key={1000}
              index={1000}
              selectOption={handleSendMessage}
            />
            {messages.map((message, index) => (
              <MessageCard
                disableSelectOption={isLoading}
                key={index}
                message={message}
                index={index}
                selectRecipeOption={handleSendMessage}
              />
            ))}
            {isLoading && (
              <ActivityIndicator size={hp(5.4)} color={Colors.primarySkyBlue} />
            )}
          </ScrollView>
        </LinearGradient>
        <ChatInputBar
          sendMessage={handleSendMessage}
          isLoading={isLoading}
          isDisabled={credits.credits === 0 || isLoading}
        />
      </LinearGradient>
    </>
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
    paddingBottom: hp(10),
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
