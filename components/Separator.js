import React from "react";
import { View } from "react-native";
import colors from "@constants/colors";

const Separator = ({ vertical }) => {
  return (
    <View
      style={{
        width: vertical === true ? 2 : "100%",
        height: vertical === true ? "100%" : 2,
        backgroundColor: colors.disableColor
      }}
    />
  );
};

export default Separator;
