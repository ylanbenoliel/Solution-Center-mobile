import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Text,
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

import colors from "../constants/colors";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const Input = ({ name, placeholder }) => {
    return (
      <View style={{ width: "80%", justifyContent: "flex-end" }}>
        <Text style={{ color: colors.mainColor }}>{name}</Text>
        <View
          style={{
            borderRadius: 4,
            borderWidth: 2,
            borderColor: colors.mainColor,
            marginBottom: 20
          }}
        >
          <TextInput
            placeholder={placeholder}
            style={{ marginLeft: 5, fontSize: 18 }}
          />
        </View>
      </View>
    );
  };

  const Button = ({ text, screen }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(screen)}
        style={{
          width: "80%",
          height: 40,
          backgroundColor: colors.mainColor,
          marginVertical: 16,
          borderRadius: 4
        }}
      >
        <LinearGradient
          colors={[colors.mainColor, colors.secondaryColor]}
          style={{
            flex: 1,
            width: "100%",
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4
          }}
        >
          <Text style={{ fontSize: 24, color: colors.whiteColor }}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            paddingLeft: 20,
            marginTop: "15%",
            position: "absolute"
          }}
        >
          <TouchableOpacity>
            <MaterialIcons
              name="menu"
              size={32}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            marginTop: "20%",
            color: colors.whiteColor
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              style={{ width: 128, height: 128 }}
              source={require("../assets/LogoLogin.png")}
            />
            <Input name="Email" placeholder="Digite seu email" />
            <Input name="Senha" placeholder="Digite sua senha" />
            <Button text="Entrar" screen="Schedule" />
            <Button text="Registrar" screen="Agenda" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
