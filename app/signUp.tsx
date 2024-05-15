import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { AuthContext } from "@/context/authContext";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import { LinearGradient } from "expo-linear-gradient";
import Fonts from "@/constants/Fonts";
import StandardButton from "@/components/buttons/StandardButton";

const SignUp = () => {
  const { register } = useContext<any>(AuthContext);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showpassword, setShowPassword] = React.useState<boolean>(false);

  const handleSignUp = async () => {
    if (!email || !password || !repeatPassword) {
      Alert.alert("Sign up", "Please fill all the fields");
      return;
    } else if (password.trim() !== repeatPassword.trim()) {
      Alert.alert("Sign up", "Passwords do not match");
      return;
    }
    setLoading(true);
    let response = await register(email.trim().toLowerCase(), password.trim());

    setLoading(false);
    if (!response.success) {
      Alert.alert("Sign up", response.msg);
    } else {
      router.replace("/signIn");
    }
  };
  return (
    <LinearGradient
      style={styles.container}
      colors={[
        Colors.light.navHeader[2],
        Colors.light.navHeader[1],
        Colors.light.navHeader[0],
      ]}
      start={[0, 0]}
      end={[1, 1]}
    >
      <CustomKeyBoardView>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={[{ color: Colors.darkBlue }, styles.logoTitle]}>
              PanPal
            </Text>
            <Image
              resizeMode="contain"
              style={styles.logo}
              source={require("@/assets/images/panpal-icon-medium.png")}
            />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={hp(2.7)} color="#A0B7D6" />
              <TextInput
                editable={!loading}
                onChangeText={(text) => setEmail(text)}
                value={email}
                style={styles.input}
                placeholderTextColor="#A0B7D6"
                placeholder="Email"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={hp(2.7)} color="#A0B7D6" />
              <TextInput
                editable={!loading}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={showpassword ? false : true}
                style={styles.input}
                placeholderTextColor="#A0B7D6"
                placeholder="Password"
              />
              <Pressable onPress={() => setShowPassword(!showpassword)}>
                <Ionicons
                  name={showpassword ? "eye-off" : "eye"}
                  size={hp(2.7)}
                  color="#A0B7D6"
                />
              </Pressable>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={hp(2.7)} color="#A0B7D6" />
              <TextInput
                editable={!loading}
                onChangeText={(text) => setRepeatPassword(text)}
                value={repeatPassword}
                secureTextEntry={showpassword ? false : true}
                style={styles.input}
                placeholderTextColor="#A0B7D6"
                placeholder="Repeat Password"
              />
              <Pressable onPress={() => setShowPassword(!showpassword)}>
                <Ionicons
                  name={showpassword ? "eye-off" : "eye"}
                  size={hp(2.7)}
                  color="#A0B7D6"
                />
              </Pressable>
            </View>
            <StandardButton
              height={ComponentParams.button.height.large}
              colors={Colors.light.components.button.pink.background}
              textColor={Colors.dark.text}
              borderColor={Colors.light.components.button.pink.border}
              textValue="Sign up"
              shadowColor={Colors.light.components.button.pink.dropShadow}
              isDisabled={loading}
              clickHandler={handleSignUp}
              loading={loading}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={[styles.textParagraph, { color: Colors.dark.text }]}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.replace("/signIn");
                }}
              >
                <Text style={[styles.textSpan, { marginLeft: wp(1) }]}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: hp(10),
    paddingHorizontal: wp(5),
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    gap: hp(0.5),
    alignItems: "center",
  },
  logoTitle: {
    opacity: 0.25,
    fontSize: Fonts.heading_3.fontSize,
    fontFamily: Fonts.heading_3.fontFamily,
  },
  logo: {
    height: hp(10),
  },
  formContainer: {
    marginTop: hp(7),
    paddingHorizontal: wp(4),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(2),
  },
  title: {
    fontSize: Fonts.heading_1.fontSize,
    textAlign: "center",
    fontFamily: Fonts.heading_1.fontFamily,
    color: Colors.dark.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.components.inputField.background,
    borderRadius: hp(ComponentParams.button.height.large),
    paddingHorizontal: wp(3),
    height: hp(ComponentParams.button.height.large),
    borderColor: Colors.light.components.inputField.innerShadow,
    borderWidth: 1,
  },
  input: {
    color: Colors.light.text,
    height: hp(ComponentParams.button.height.large),
    fontFamily: Fonts.text_2.fontFamily,
    flex: 1,
    fontSize: Fonts.text_2.fontSize,
    marginLeft: wp(2), // Adjust this value as needed
  },
  textParagraph: {
    textAlign: "right",
    fontFamily: Fonts.text_3.fontFamily,
    fontSize: Fonts.text_3.fontSize,
  },
  textSpan: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: Colors.white,
    fontFamily: "QuickSandSemiBold",
    fontSize: Fonts.text_3.fontSize,
    color: Colors.white,
  },
});
