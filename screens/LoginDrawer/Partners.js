import React from "react";
import { View, Text } from "react-native";
import { GeneralStatusBar } from "@components";
import colors from "@constants/colors";

// import { Container } from './styles';

export default function Partners() {
  return (
    <View style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <Text>Partners</Text>
    </View>
  );
}
