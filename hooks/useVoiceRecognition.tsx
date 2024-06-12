import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";

import React, { useCallback, useEffect } from "react";

interface IState {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isRecording: boolean;
}

export const useVoiceRecognition = () => {
  const [state, setState] = React.useState<IState>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  });

  const resetState = useCallback(() => {
    setState({
      recognized: "",
      pitch: "",
      error: "",
      end: "",
      started: "",
      results: [],
      partialResults: [],
      isRecording: false,
    });
  }, [setState]);

  const startRecognizing = useCallback(async () => {
    resetState();
    try {
      await Voice.start("en-US");
      setState((prev) => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error("Error starting Voice recognition: ", error);
    }
  }, [resetState]);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
      setState((prev) => ({ ...prev, isRecording: false }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const cancelRecognizing = useCallback(async () => {
    try {
      await Voice.cancel();
      setState((prev) => ({ ...prev, isRecording: false }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const destroyRecognizer = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (error) {
      console.log(error);
    }
    resetState();
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart = (e: any) => {
      setState((prev) => ({ ...prev, started: "√", isRecording: true }));
    };
    Voice.onSpeechRecognized = (e: any) => {
      setState((prev) => ({ ...prev, recognized: "√" }));
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setState((prev) => ({ ...prev, error: JSON.stringify(e.error) }));
    };
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prev) => ({ ...prev, results: e.value! }));
      }
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prev) => ({ ...prev, partialResults: e.value! }));
      }
    };
    Voice.onSpeechVolumeChanged = (e: any) => {
      setState((prev) => ({ ...prev, pitch: e.value }));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    state,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizer,
  };
};
