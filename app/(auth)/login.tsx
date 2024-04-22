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
const login = () => {
  const { signIn, session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (session !== null) {
      router.push("/(app)/(tabs)/(home)");
    }
  }, [session]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.pageTitle}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
      </View>
      {error ? <Message state="error" message={error} /> : null}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              try {
                setLoading(true);
                await signIn(email, password);
                setLoading(false);
              } catch (error: any) {
                setLoading(false);
                setError(error.message);
              }
            }}
          >
            <Text style={{ color: "white" }}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
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
    gap: 10,
    // Add light red background color
  },
  inputContainer: {
    display: "flex",
    gap: 10,
    width: "80%",
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "grey", // Add bright red border color
    padding: 10,
  },
  buttonContainer: {
    width: "80%",
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
});
