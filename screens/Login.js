import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { GeneralStatusBar } from "../components";
import { scale, verticalScale } from "react-native-size-matters";

export default function Login({ navigation }) {
  const Input = ({ name, placeholder }) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.text}>{name}</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder={placeholder}
            style={[styles.text, styles.textInput]}
          />
        </View>
      </View>
    );
  };

  const Button = ({ text, screen }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(screen)}
        style={styles.buttonContainer}
      >
        <Text style={[styles.text, styles.buttonText]}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <View
          style={{
            paddingLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialIcons
              name="menu"
              size={32}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior="height"
        style={{
          flex: 1,
        }}
      >
        <View style={styles.loginContainer}>
          <Image
            style={{ width: 128, height: 128 }}
            source={require("../assets/LogoLogin.png")}
          />
          <Input name="Email" placeholder="Digite seu email" />
          <Input name="Senha" placeholder="Digite sua senha" />
          <Button text="Entrar" screen="Agendamento" />
          <Button text="Registrar" screen="Agenda" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Amaranth-Regular",
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: "left",
  },
  inputContainer: { width: "80%" },
  textInputContainer: {
    borderRadius: scale(4),
    borderWidth: scale(2),
    borderColor: colors.mainColor,
    marginBottom: scale(20),
  },
  textInput: {
    marginLeft: scale(5),
    fontSize: scale(18),
    height: verticalScale(32),
  },
  buttonContainer: {
    width: "80%",
    height: scale(48),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainColor,
    marginVertical: verticalScale(16),
    borderRadius: scale(4),
  },
  buttonLinearGradient: {},
  buttonText: {
    fontSize: scale(24),
    color: colors.whiteColor,
  },
  header: { width: "100%", height: scale(48), justifyContent: "center" },
});
