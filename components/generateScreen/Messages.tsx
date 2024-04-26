import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef } from "react";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  NAVIGATION_BOTTOM_TABS_HEIGHT,
} from "@/constants/ScreenParams";
import { message } from "@/models/message";

const Messages = ({
  messages,
  isLoading,
}: {
  messages: message[];
  isLoading: boolean;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesListContainer}
        // Ensure smooth scrolling on Android
        nestedScrollEnabled={Platform.OS === "android"}
      >
        {messages.map((message, index) => (
          <>
            <View
              style={[
                styles.messageContainer,
                {
                  alignSelf:
                    message.role === "panpal" ? "flex-start" : "flex-end",
                  backgroundColor:
                    message.role === "panpal" ? "#ECF0F3" : "#11263C",
                  marginTop: index === 0 ? 10 : 0,
                  marginBottom: index === messages.length - 1 ? 10 : 0,
                },
              ]}
              key={index}
            >
              <Text
                style={[
                  {
                    color: message.role === "panpal" ? "#11263C" : "#ECF0F3",
                  },
                ]}
              >
                {message.role === "user" ? "(You)" : "PanPal"}
              </Text>
              <Text
                style={[
                  {
                    color: message.role === "panpal" ? "#11263C" : "#ECF0F3",
                  },
                ]}
              >
                {message.message}
              </Text>
            </View>
          </>
        ))}
        {isLoading === true && (
          <ActivityIndicator
            size="large"
            color="#11263C"
            style={styles.loadingMessageContainer}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAVIGATION_BOTTOM_TABS_HEIGHT,
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    alignSelf: "flex-end",
    maxHeight: NAVIGATION_BOTTOM_TABS_HEIGHT,
    minHeight: "auto",
    maxWidth: (SCREEN_WIDTH * 3) / 4,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#11263C",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 1,
  },
  messagesListContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    rowGap: 25,
    alignItems: "flex-end",
  },
  loadingMessageContainer: {
    alignSelf: "center",
    marginVertical: 15,
  },
});
