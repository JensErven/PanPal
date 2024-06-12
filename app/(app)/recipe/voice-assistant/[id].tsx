import { View, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { openaiServices } from "@/services/api/openai.services";
import * as FileSystem from "expo-file-system";
const VoiceAssistantScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [savedRecordings, setSavedRecordings] = useState<string[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const { transcribeAudio } = openaiServices;
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function playSound(uri: string) {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    try {
      await sound.playAsync();
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  }

  async function stopRecording() {
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();

    if (uri) {
      // Move file to a new URI with a .mp3 extension
      const newUri = uri.replace(/(\.[\w\d_-]+)$/i, ".mp3");
      await FileSystem.moveAsync({ from: uri, to: newUri });
      setSavedRecordings([...savedRecordings, newUri]);

      // Transcribe audio
      const transcription = await transcribeAudio(newUri);
      setTranscriptions([...transcriptions, transcription]);
    }
    setRecording(undefined);
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {savedRecordings.map((uri, index) => (
        <Button
          key={index}
          title={`Play Recording ${index + 1}`}
          onPress={() => playSound(uri)}
        />
      ))}
    </View>
  );
};
export default VoiceAssistantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startRecognizingButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },
});
