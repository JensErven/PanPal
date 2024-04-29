import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSession } from "@/context/auth";
import { router } from "expo-router";
import Message from "@/components/shared/message";
import InputField from "@/components/shared/InputField";
import ButtonStandard from "@/components/shared/ButtonStandard";
import Colors from "@/constants/Colors";
import Divider from "@/components/shared/Divider";
import { Ionicons } from "@expo/vector-icons";
import {
  BUTTON_HEIGHT_LARGE,
  ICON_SIZE_MEDIUM,
} from "@/constants/ScreenParams";

const login = () => {
  const { signIn, session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

  useEffect(() => {
    if (session !== null) {
      router.push("/(app)/(tabs)/(home)");
    }
  }, [session]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.pageTitle}>Login</Text>
      <View style={styles.inputContainer}>
        <InputField
          placeholder="Email"
          inputValue={email}
          setInputField={setEmail}
        />
        <InputField
          placeholder="Password"
          inputValue={password}
          setInputField={setPassword}
          secureTextEntry={secureTextEntry}
          setSecureTextEntry={setSecureTextEntry}
        />
      </View>

      {error ? <Message state="error" message={error} /> : null}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.buttonsContainer}>
          <ButtonStandard
            title="Login"
            backgroundColor={Colors.coral}
            clicked={async () => {
              try {
                setLoading(true);
                await signIn(email, password);
                setLoading(false);
              } catch (error: any) {
                setLoading(false);
                setError(error.message);
              }
            }}
          />
          <ButtonStandard
            title="Register"
            backgroundColor={Colors.midnight}
            clicked={() => router.push("/register")}
          />
        </View>
      )}
      <Divider />
      <View style={styles.otherLoginMethodsContainer}>
        <TouchableOpacity style={styles.otherLoginMethodButton}>
          <Ionicons
            name="logo-google"
            size={ICON_SIZE_MEDIUM}
            color={Colors.slate}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.otherLoginMethodButton}>
          <Ionicons
            name="logo-facebook"
            size={ICON_SIZE_MEDIUM}
            color={Colors.slate}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    gap: 32,
    paddingHorizontal: 32,
  },
  inputContainer: {
    display: "flex",
    gap: 8,
    width: "100%",
  },

  buttonsContainer: {
    display: "flex",
    gap: 8,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  otherLoginMethodsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  otherLoginMethodButton: {
    backgroundColor: Colors.porcelain,
    height: BUTTON_HEIGHT_LARGE,
    width: BUTTON_HEIGHT_LARGE,
    borderRadius: BUTTON_HEIGHT_LARGE / 2,
    shadowColor: Colors.midnight,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
