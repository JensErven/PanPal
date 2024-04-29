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
import { isLoading } from "expo-font";
import InputField from "@/components/shared/InputField";
import ButtonStandard from "@/components/shared/ButtonStandard";
import Colors from "@/constants/Colors";
import Divider from "@/components/shared/Divider";
import { Ionicons } from "@expo/vector-icons";
import {
  BUTTON_HEIGHT_LARGE,
  BUTTON_HEIGHT_MEDIUM,
  ICON_SIZE_MEDIUM,
  ICON_SIZE_SMALL,
} from "@/constants/ScreenParams";
const register = () => {
  const { signUp, session } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (session !== null) {
      router.push("/(app)/(tabs)/(home)");
    }
  }, [session]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.pageTitle}>Register</Text>
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
        <InputField
          placeholder="Repeat Password"
          inputValue={repeatedPassword}
          setInputField={setRepeatedPassword}
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
            title="Register"
            backgroundColor={Colors.coral}
            clicked={async () => {
              try {
                setLoading(true);
                if (password !== repeatedPassword)
                  return setError("Passwords do not match");
                await signUp(email, password);
                setLoading(false);
              } catch (error: any) {
                setError(error.message);
              } finally {
                setLoading(false);
              }
            }}
          />
          <ButtonStandard
            title="Login"
            backgroundColor={Colors.midnight}
            clicked={() => router.push("/login")}
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

export default register;

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
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: "#ccc",
  },

  pageTitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonOutline: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    borderStyle: "solid",
    borderColor: "blue",
    borderWidth: 1,
    alignItems: "center",
    marginTop: 10,
  },
  buttonOutlineText: {
    color: "blue",
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
