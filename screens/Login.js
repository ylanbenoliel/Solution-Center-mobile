import React, { useState, useEffect, createRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ImageBackground,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  AsyncStorage,
  Dimensions,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { GeneralStatusBar, ShowErrors } from "../components";
import { scale, verticalScale } from "react-native-size-matters";
import { api } from "../services/api";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const field2 = createRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 2200);
    return () => clearTimeout(timer);
  }, [error]);

  function showLoadingLogin() {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.whiteColor} />;
    } else {
      return <Text style={[styles.text, styles.buttonText]}>Entrar</Text>;
    }
  }

  function handleLogin() {
    setLoading(true);
    Keyboard.dismiss();
    if (email === "" || password === "") {
      setError("Preencha todos os campos.");
      return setLoading(false);
    }
    api
      .post("/authenticate", {
        email: email,
        password: password,
      })
      .then((response) => {
        AsyncStorage.setItem("@SC:token", response.data.token);
        AsyncStorage.setItem("@SC:name", response.data.name);
        AsyncStorage.setItem(
          "@SC:admin",
          JSON.stringify(response.data.is_admin)
        );
        if (response.data.is_admin) {
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{ name: "AdminDrawer" }],
          //   })
          // );
          navigation.navigate("AdminDrawer");
        } else {
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{ name: "UserDrawer" }],
          //   })
          // );
          navigation.navigate("UserDrawer");
        }
      })
      .catch(() => {
        setError("Usuário não encontrado.");
      }).finally(() => {
        setLoading(false)
      })
  }

  function handleRegister() {
    Keyboard.dismiss();
    navigation.navigate("Registro");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <ImageBackground
        style={{ flex: 1 }}
        imageStyle={styles.imageBackground}
        source={require("../assets/LogoHorizontal.png")}
        resizeMode="center"
      >
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: scale(20),
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
          behavior={Platform.select({
            ios: "padding",
            android: null,
          })}
          style={{
            flex: 1,
          }}
        >
          <View style={styles.loginContainer}>
            {/*  */}
            <Text style={[styles.text, styles.headerText]}>Agenda Fácil</Text>
            <View style={{ margin: verticalScale(20) }} />

            <View style={styles.inputContainer}>
              <Text style={styles.text}>Email</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={[styles.text, styles.textInput]}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Digite seu email"
                  placeholderTextColor={colors.placeholderColor}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="go"
                  onSubmitEditing={() => field2.current.focus()}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.text}>Senha</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  ref={field2}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  style={[styles.text, styles.textInput]}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.placeholderColor}
                  autoCapitalize="none"
                  onSubmitEditing={() => handleLogin()}
                  secureTextEntry={true}
                  autoCorrect={false}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                handleLogin();
              }}
            >
              {showLoadingLogin()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                handleRegister();
              }}
            >
              <Text style={[styles.text, styles.buttonText]}>Registrar</Text>
            </TouchableOpacity>
            <ShowErrors error={error} />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: verticalScale(30),
  },
  imageBackground: {
    opacity: 0.1,
    position: "absolute",
    left: 0,
    top: 0,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
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
