import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
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

const PanPalChatScreen = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSendMessage = (message: Message) => {
    console.log(message);
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
      />
      <LinearGradient
        style={styles.container}
        colors={[Colors.white, "#DDEBF3"]}
        start={[0.5, 0]}
        end={[0.5, 1]}
      >
        <CustomKeyBoardView>
          <View style={styles.content}>
            {messages.length === 0 && (
              <View style={styles.panPalGreeting}>
                <Image
                  style={styles.panpalImage}
                  source={panPalIcon}
                  placeholder={blurhash}
                  contentFit="cover"
                />
                <Text style={styles.title}>
                  Hi! I'm PanPal, your personal cooking assistant. I can help
                  you with recipes, tips, and more. What would you like to know?
                </Text>
              </View>
            )}
            {messages.map((message, index) => (
              <MessageCard message={message} index={index} />
            ))}
            {isLoading && (
              <ActivityIndicator size="large" color={Colors.darkBlue} />
            )}
          </View>
        </CustomKeyBoardView>
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
    flex: 1,
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
});
