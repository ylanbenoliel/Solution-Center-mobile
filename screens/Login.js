import React from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ImageBackground,
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
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
    );
  };

  const Button = ({ text, screen }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss(), navigation.navigate(screen);
        }}
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
      <ImageBackground
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.1 }}
        source={require("../assets/LogoHorizontal.png")}
        resizeMode="contain"
      >
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: scale(20),
              // justifyContent: "space-around",
            }}
          >
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <MaterialIcons
                name="menu"
                size={scale(32)}
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
            <Text style={[styles.text, styles.headerText]}>Agenda Fácil</Text>
            <View style={{ margin: verticalScale(32) }} />
            <Input name="Email" placeholder="Digite seu email" />
            <Input name="Senha" placeholder="Digite sua senha" />
            <Button text="Entrar" screen="Agendamento" />
            <Button text="Registrar" screen="Agenda" />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: verticalScale(30),
  },
  headerText: {
    fontSize: scale(32),
    color: colors.mainColor,
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
    width: "50%",
    height: scale(48),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainColor,
    marginVertical: verticalScale(16),
    borderRadius: scale(4),
  },
  buttonText: {
    fontSize: scale(24),
    color: colors.whiteColor,
  },
  header: {
    width: "100%",
    height: verticalScale(48),
    justifyContent: "center",
    marginTop: verticalScale(20),
  },
});
