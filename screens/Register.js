import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { GeneralStatusBar, ShowInfo } from "@components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { scale, verticalScale } from "react-native-size-matters";
import colors from "@constants/colors";
import { api, url } from "@services/api";

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({});
  const [error, setError] = useState("");

  const field2 = useRef();
  const field3 = useRef();
  const field4 = useRef();
  const field5 = useRef();
  const field6 = useRef();
  const field7 = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 2200);
    return () => clearTimeout(timer);
  }, [error]);

  async function sendAvatarImage(userId) {
    const apiUrl = `${url}/users/${userId}/avatar`
    const uriParts = image.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const uploadAvatarImage = new FormData();
    uploadAvatarImage.append("avatar", {
      name: `avatar.${fileType}`,
      type: `image/${fileType}`,
      uri:
        image.uri
    });

    const options = {
      method: 'POST',
      body: uploadAvatarImage,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    return await fetch(apiUrl, options)
  }

  function handleRegister() {
    Keyboard.dismiss();
    setLoading(true);
    if (
      name == "" ||
      email == "" ||
      password == "" ||
      address == "" ||
      cpf == "" ||
      rg == "" ||
      phone == ""
    ) {
      setError("Preencha todos os campos.");
      setLoading(false);
      return null;
    }

    api.post("/users", {
      name: name,
      email: email,
      password: password,
      address: address,
      cpf: cpf,
      rg: rg,
      phone: phone,
    })
      .then((response) => {
        sendAvatarImage(response.data.id).then(res => {
          navigation.push("LoginDrawer");
        })
      })
      .catch((e) => {
        setError(`Erro ao salvar usuário`);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  showLoadingRegister = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.whiteColor} />;
    } else {
      return <Text style={[styles.text, styles.buttonText]}>Registrar</Text>;
    }
  };

  async function handlePickImage() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a galeria.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: scale(20),
          }}
          onPress={() => navigation.push("LoginDrawer")}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={scale(32)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.registerContainer}>
          {/*  */}

          <View style={styles.avatarContainer}>
            <View style={styles.avatarImageContainer}>
              {image && (
                <Image source={{ uri: image.uri }} style={styles.avatarImage} />
              )}
            </View>
            <View style={styles.galleryButtonContainer}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={() => handlePickImage()}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={scale(16)}
                  color={colors.whiteColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Nome</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={[styles.text, styles.textInput]}
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Nome completo"
                placeholderTextColor={colors.placeholderColor}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => field2.current.focus()}
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Email</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={field2}
                style={[styles.text, styles.textInput]}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Seu melhor email"
                placeholderTextColor={colors.placeholderColor}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => field3.current.focus()}
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Senha</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={field3}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={[styles.text, styles.textInput]}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={colors.placeholderColor}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => field4.current.focus()}
                secureTextEntry={true}
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Endereço</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={field4}
                value={address}
                onChangeText={(text) => setAddress(text)}
                style={[styles.text, styles.textInput]}
                placeholder="Rua, número"
                placeholderTextColor={colors.placeholderColor}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => field5.current.focus()}
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>CPF</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={field5}
                value={cpf}
                keyboardType="number-pad"
                onChangeText={(text) => setCpf(text)}
                style={[styles.text, styles.textInput]}
                placeholder="999.999.999-99"
                placeholderTextColor={colors.placeholderColor}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => field6.current.focus()}
                blurOnSubmit={false}
              />
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.select({
              ios: "padding",
              android: null,
            })}
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
            }}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Rg</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  ref={field6}
                  value={rg}
                  keyboardType="number-pad"
                  onChangeText={(text) => setRg(text)}
                  style={[styles.text, styles.textInput]}
                  placeholder="Somente números"
                  placeholderTextColor={colors.placeholderColor}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => field7.current.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.text}>Telefone</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  ref={field7}
                  value={phone}
                  keyboardType="number-pad"
                  onChangeText={(text) => setPhone(text)}
                  style={[styles.text, styles.textInput]}
                  placeholder="91 99999-9999"
                  placeholderTextColor={colors.placeholderColor}
                  autoCapitalize="none"
                  onSubmitEditing={() => handleRegister()}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            {/*  */}
            <ShowInfo error={error} />
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                handleRegister();
              }}
            >
              {showLoadingRegister()}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  text: {
    fontFamily: "Amaranth-Regular",
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: "left",
  },
  header: {
    height: verticalScale(48),
    justifyContent: "center",
    marginTop: verticalScale(20),
  },
  avatarContainer: {
    width: "32%",
    flexDirection: "row",
  },
  avatarImageContainer: {
    backgroundColor: colors.disableColor,
    width: scale(100),
    height: verticalScale(115),
    borderRadius: scale(60),
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  galleryButtonContainer: {
    zIndex: 2,
    justifyContent: "flex-end",
    left: scale(-20),
  },
  galleryButton: {
    backgroundColor: colors.mainColor,
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
  },
  registerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: verticalScale(30),
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
});
