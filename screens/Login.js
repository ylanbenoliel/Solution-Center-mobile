import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { GeneralStatusBar } from "../components";

export default function Login({ navigation }) {
  const Input = ({ name, placeholder }) => {
    return (
      <View style={{ width: "80%", justifyContent: "flex-end" }}>
        <Text style={{ color: colors.mainColor }}>{name}</Text>
        <View
          style={{
            borderRadius: 1,
            borderWidth: 2,
            borderColor: colors.mainColor,
            marginBottom: 20,
          }}
        >
          <TextInput
            placeholder={placeholder}
            style={{ marginLeft: 5, fontSize: 18, height: 32 }}
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
          height: 48,
          backgroundColor: colors.mainColor,
          marginVertical: 16,
          borderRadius: 4,
        }}
      >
        <LinearGradient
          colors={[colors.mainColor, colors.secondaryColor]}
          style={{
            flex: 1,
            width: "100%",
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <Text style={{ fontSize: 24, color: colors.whiteColor }}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <View style={{ width: "100%", height: 48, justifyContent: "center" }}>
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
        behavior="padding"
        style={{
          flex: 1,
          justifyContent: "center",
          marginBottom: 100,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              height: 600,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: 128, height: 128 }}
              source={require("../assets/LogoLogin.png")}
            />
            <Input name="Email" placeholder="Digite seu email" />
            <Input name="Senha" placeholder="Digite sua senha" />
            <Button text="Entrar" screen="Agendamento" />
            <Button text="Registrar" screen="Agenda" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
