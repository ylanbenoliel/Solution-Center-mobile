import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { verticalScale, scale } from "react-native-size-matters";
import colors from '../constants/colors'

const ShowErrors = ({ error }) => {
  if (!!error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }
  else{
    return null
  }
};

const styles = StyleSheet.create({
  container: {
    width: "70%",
    height: verticalScale(36),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(4),
    backgroundColor: colors.errorColor,
  },
  text: {
    fontFamily: "Amaranth-Regular",
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: "center",
    color: colors.whiteColor,
  },
});

export default ShowErrors;
