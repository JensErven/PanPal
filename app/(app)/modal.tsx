import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSession } from "@/context/auth";

const modal = () => {
  const { signOut } = useSession();
  return (
    <View>
      <Text>modal</Text>
      <TouchableOpacity>
        <Text onPress={signOut}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default modal;
