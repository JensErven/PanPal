import { View, StyleSheet, Text } from "react-native";
import React from "react";
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

const PanPalChatScreen = () => {
  const messages: Message[] = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Who won the world series in 2020?" },
    {
      role: "assistant",
      content: "The Los Angeles Dodgers won the World Series in 2020.",
    },
    { role: "user", content: "Where was it played?" },
    {
      role: "assistant",
      content: "The World Series was played at Globe Life Field in Texas.",
    },
    { role: "user", content: "Who was the MVP?" },
    {
      role: "assistant",
      content:
        "Corey Seager was named the MVP of the 2020 World Series. He batted .400 with 2 home runs and 5 RBIs.",
    },
    { role: "user", content: "Who won the World Series in 2021?" },
    {
      role: "assistant",
      content: "The Atlanta Braves won the World Series in 2021.",
    },
    { role: "user", content: "Who was the MVP?" },
    {
      role: "assistant",
      content:
        "Jorge Soler was named the MVP of the 2021 World Series. He hit 3 home runs and had 6 RBIs.",
    },
  ];

  const handleSendMessage = (message: Message) => {
    console.log(message);
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
            {messages.map((message, index) => (
              <View key={index}>
                {message.role === "system" ? (
                  <Text style={{ textAlign: "center" }}>{message.content}</Text>
                ) : message.role === "user" ? (
                  <View
                    style={{
                      backgroundColor:
                        Colors.light.components.button.purple.background[0],
                      padding: wp(3),
                      borderRadius: hp(5),
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text style={[{ color: Colors.white }, styles.messageText]}>
                      {message.content}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor:
                        Colors.light.components.button.white.background[1],
                      padding: wp(3),
                      borderRadius: hp(5),
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text style={{ color: Colors.darkBlue }}>
                      {message.content}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </CustomKeyBoardView>
      </LinearGradient>
      <ChatInputBar sendMessage={handleSendMessage} />
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
});
