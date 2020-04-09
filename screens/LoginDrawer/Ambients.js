import React from "react";
import { View, Text } from "react-native";
import { GeneralStatusBar } from "../../components";
import colors from "../../constants/colors";

export default function Ambients() {
  return (
    <View style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <Text>Ambients</Text>
    </View>
  );
}
