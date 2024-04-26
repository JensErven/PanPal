import { View, Text, KeyboardAvoidingView, StyleSheet } from "react-native";
import React, { useState } from "react";
import BottomInputfield from "@/components/generateScreen/BottomInputfield";
import Messages from "@/components/generateScreen/Messages";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  NAVIGATION_BOTTOM_TABS_HEIGHT,
} from "@/constants/ScreenParams";
import { message } from "@/models/message";

const GenerateScreen = () => {
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const handleSentMessageData = async (message: message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    const panPalMessage = await fetchPanPalResponse(message.message);
    setMessages((prevMessages) => [...prevMessages, panPalMessage]);
  };

  const fetchPanPalResponse = async (message: string): Promise<message> => {
    setIsInputDisabled(true);
    setIsLoading(true);
    const newResponse = new Promise<message>((resolve) => {
      setTimeout(() => {
        const response = {
          message: "I am PanPal, I will get back to you shortly",
          role: "panpal",
        } as message;
        setIsLoading(false);
        setIsInputDisabled(false);
        resolve(response);
      }, 1500);
    });

    return newResponse;
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.contentContainer}>
        {messages.length > 0 ? (
          <>
            <Messages messages={messages} isLoading={isLoading}></Messages>
          </>
        ) : (
          <View style={styles.PanPalWelcomeContainer}>
            <View style={styles.panPalAvaterContainer}>
              <Text className="font-extrabold text-lg">PP</Text>
            </View>
            <Text className="text-2xl font-bold">Hi, there!</Text>
            <Text className="text-lg text-slate-500">How can I help you?</Text>
          </View>
        )}
      </View>

      <BottomInputfield
        sentMessageData={handleSentMessageData}
        isInputDisabled={isInputDisabled}
      />
    </KeyboardAvoidingView>
  );
};

export default GenerateScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  PanPalWelcomeContainer: {
    width: SCREEN_WIDTH / 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  contentContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAVIGATION_BOTTOM_TABS_HEIGHT,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  panPalAvaterContainer: {
    backgroundColor: "#dde1e7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 58,
    height: 58,
    borderRadius: 29,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ECF0F3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
});
