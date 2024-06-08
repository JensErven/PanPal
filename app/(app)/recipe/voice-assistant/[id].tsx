import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Voice from "@react-native-voice/voice";

const VoiceAssistantScreen = () => {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    startListening();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start("en-US");
      setStarted(true);
    } catch (error) {
      console.error("Error starting Voice: ", error);
    }
  };

  const onSpeechStartHandler = (e: any) => {
    console.log("Speech started: ", e);
  };

  const onSpeechEndHandler = (e: any) => {
    console.log("Speech ended: ", e);
    startListening(); // Restart listening to ensure continuous listening
  };

  const onSpeechResultsHandler = (e: any) => {
    const spokenWords = e.value;
    setResults(spokenWords);
    console.log("Speech results: ", spokenWords);

    // Check for specific keywords
    if (spokenWords.includes("previous")) {
      console.log("Successful recognition: 'previous'");
    } else if (spokenWords.includes("next")) {
      console.log("Successful recognition: 'next'");
    } else if (spokenWords.includes("stop")) {
      console.log("Successful recognition: 'stop'");
    }
  };

  const onSpeechErrorHandler = (e: any) => {
    console.error("Speech error: ", e);
    startListening(); // Restart listening in case of an error
  };

  return (
    <View>
      <Text>{id}</Text>
      {results.map((result, index) => (
        <Text key={index}>{result}</Text>
      ))}
    </View>
  );
};

export default VoiceAssistantScreen;
