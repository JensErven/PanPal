import { View, Text, TextInput, Image, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import CustomKeyBoardView from "@/components/CustomKeyBoardView";
import { useAuth } from "@/context/authContext";
import Colors from "@/constants/Colors";
import ComponentParams from "@/constants/ComponentParams";
import Fonts from "@/constants/Fonts";
import CustomHeader from "@/components/navigation/CustomHeader";
import StandardButton from "@/components/buttons/StandardButton";

const ForgotPassword = () => {
  const { handleSendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleForgotPassword = async () => {
    if (!email.includes("@")) {
      Alert.alert("Unvalid Email", "Please give up a valid email address");
      return;
    }
    if (!email) {
      Alert.alert("Forgot Email", "Please give up your email address");
      return;
    }
    setLoading(true);
    // forgotPassword
    let response = await handleSendPasswordResetEmail(email.trim());
    setLoading(false);
    if (!response.success) {
      Alert.alert("Error", response.msg);
    } else {
      Alert.alert("Success", response.msg);
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
        <CustomHeader hasGoBack={true} headerTitle="" isTransparent={true} />
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
          <View style={styles.textContainer}>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.paragraph}>
              Enter your email address below and we will send you a link to
              reset your password.
            </Text>
          </View>
          <View style={styles.formContainer}>
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
            <StandardButton
              textValue="Send mail"
              height={ComponentParams.button.height.large}
              colors={[
                Colors.light.components.button.pink.background[0],
                Colors.light.components.button.pink.background[1],
              ]}
              borderColor={Colors.light.components.button.pink.border}
              textColor={Colors.dark.text}
              shadowColor={Colors.light.components.button.pink.dropShadow}
              isDisabled={loading}
              clickHandler={handleForgotPassword}
              loading={loading}
            />
          </View>
        </View>
      </CustomKeyBoardView>
    </LinearGradient>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: wp(9),
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
  textContainer: {
    marginTop: hp(5),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: hp(2),
  },
  paragraph: {
    fontSize: Fonts.text_2.fontSize,
    fontFamily: Fonts.text_2.fontFamily,
    color: Colors.dark.text,
    textAlign: "left",
    lineHeight: Fonts.text_2.lineHeight,
  },
  formContainer: {
    marginTop: hp(5),
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: hp(ComponentParams.button.height.large),
    paddingHorizontal: wp(3),
    height: hp(ComponentParams.button.height.large),
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
  },
  input: {
    color: Colors.white,
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
    fontFamily: "QuickSandSemiBold",
    fontSize: Fonts.text_3.fontSize,
  },
});
