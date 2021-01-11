/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { GeneralStatusBar, SnackBar } from '@components';

import { sanitizeStringNumbers } from '@helpers/functions';

import { api, url } from '@services/api';

import profilePic from '@assets/icon.png';

import colors from '@constants/colors';

export default function Register({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [snackColor, setSnackColor] = useState('');

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const address = useRef(null);
  const cpf = useRef();
  const rg = useRef(null);
  const phone = useRef();

  useEffect(() => {
    getPermissionAsync();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
  }, [visibleSnack === true]);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('Precisamos do acesso à galeria para upload de foto.');
      }
    }
  };

  async function sendAvatarImage(userId) {
    const apiUrl = `${url}/users/${userId}/avatar`;
    const uriParts = image.split('.');
    const fileType = uriParts[uriParts.length - 1];
    // eslint-disable-next-line no-undef
    const uploadAvatarImage = new FormData();
    uploadAvatarImage.append('avatar', {
      name: `avatar.${fileType}`,
      type: `image/${fileType}`,
      uri:
        image,
    });

    const options = {
      method: 'POST',
      body: uploadAvatarImage,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    // eslint-disable-next-line no-undef
    const response = await fetch(apiUrl, options);
    return response;
  }

  async function handlePickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar a galeria.');
    }
  }

  async function createUser(values) {
    const rawCpf = sanitizeStringNumbers(values.cpf);
    const rawPhone = sanitizeStringNumbers(values.phone);
    const rawRg = sanitizeStringNumbers(values.rg);
    setLoading(true);
    try {
      const userResponse = await api.post('/users', {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        address: values.address.trim(),
        cpf: rawCpf,
        rg: rawRg,
        phone: rawPhone,
      });
      if (image) {
        const pictureResponse = await sendAvatarImage(userResponse.data.id);
        const pictureStatus = pictureResponse.ok;
        if (!pictureStatus) {
          setSnackColor(colors.errorColor);
          setSnackText('Não foi possível enviar a foto.');
        }
      } else {
        setSnackColor(colors.accentColor);
        setSnackText(`${userResponse.data.message}`);
      }
      setVisibleSnack(true);
      setTimeout(() => {
        navigation.push('Login');
      }, 3000);
    } catch (e) {
      setSnackColor(colors.errorColor);
      if (e.response) {
        setSnackText(`${e.response.data.message}`);
      } else if (e.request) {
        setSnackText('Erro na conexão.');
      } else {
        setSnackText('Algo deu errado.');
      }
      setVisibleSnack(true);
    }
    setLoading(false);
  }

  const FormSchema = Yup.object().shape({
    name: Yup.string()
      .required('Campo Obrigatório.')
      .min(4, 'Insira nome e sobrenome.'),
    email: Yup.string()
      .email('Precisa ser um email válido.')
      .required('Campo Obrigatório.'),
    password: Yup.string()
      .min(6, 'Mínimo 6 caracteres.')
      .required('Campo Obrigatório.'),
    address: Yup.string()
      .min(10, 'Forneça mais informações.')
      .required('Campo Obrigatório.'),
    cpf: Yup.string()
      .min(11, 'Insira todo o CPF.')
      .required('Campo Obrigatório.'),
    rg: Yup.string()
      .required('Campo Obrigatório.'),
    phone: Yup.string()
      .required('Campo Obrigatório.'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(16) }}>
        <View style={styles.registerContainer}>
          {/*  */}

          <View style={styles.avatarContainer}>
            <View style={styles.avatarImageContainer}>
              <Image
                source={image ? { uri: image } : profilePic}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.galleryButtonContainer}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={() => handlePickImage()}
              >
                <Feather
                  name="camera"
                  size={scale(24)}
                  color={colors.whiteColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Formik
            validationSchema={FormSchema}
            initialValues={{
              name: '',
              email: '',
              password: '',
              address: '',
              cpf: '',
              rg: '',
              phone: '',
            }}
            onSubmit={(values) => {
              createUser(values);
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              touched,
              setFieldTouched,
            }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Nome</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      ref={name}
                      style={[styles.text, styles.textInput]}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      placeholder="Nome completo"
                      placeholderTextColor={colors.placeholderColor}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => email.current.focus()}
                      onBlur={() => setFieldTouched('user', true)}
                      autoCorrect={false}
                    />
                  </View>
                  {errors.name
                   && touched.name
                   && <Text style={[styles.text, styles.errorFormText]}>{errors.name}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Email</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      ref={email}
                      style={[styles.text, styles.textInput]}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      placeholder="Seu melhor email"
                      placeholderTextColor={colors.placeholderColor}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="next"
                      onSubmitEditing={() => password.current.focus()}
                      autoCorrect={false}
                      blurOnSubmit={false}
                    />
                  </View>
                  {errors.email
                   && touched.email
                   && <Text style={[styles.text, styles.errorFormText]}>{errors.email}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Senha</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      ref={password}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      style={[styles.text, styles.textInput]}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={colors.placeholderColor}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => address.current.focus()}
                // secureTextEntry
                      autoCorrect={false}
                      blurOnSubmit={false}
                    />
                  </View>
                  {errors.password
                   && touched.password
                   && (
                   <Text
                     style={[styles.text, styles.errorFormText]}
                   >
                     {errors.password}
                   </Text>
                   )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Endereço</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      ref={address}
                      value={values.address}
                      onChangeText={handleChange('address')}
                      style={[styles.text, styles.textInput]}
                      placeholder="Rua, número"
                      placeholderTextColor={colors.placeholderColor}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                      autoCorrect={false}
                      blurOnSubmit={false}
                    />
                  </View>
                  {errors.address
                  && touched.address
                   && <Text style={[styles.text, styles.errorFormText]}>{errors.address}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Rg</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      ref={rg}
                      value={values.rg}
                      keyboardType="number-pad"
                      onChangeText={handleChange('rg')}
                      style={[styles.text, styles.textInput]}
                      placeholder="Somente números"
                      placeholderTextColor={colors.placeholderColor}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                      blurOnSubmit={false}
                    />
                  </View>
                  {errors.rg
                   && touched.rg
                    && <Text style={[styles.text, styles.errorFormText]}>{errors.rg}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.text}>CPF</Text>
                  <View style={styles.textInputContainer}>
                    <TextInputMask
                      ref={cpf}
                      style={[styles.text, styles.textInput]}
                      placeholder="999.999.999-99"
                      placeholderTextColor={colors.placeholderColor}
                      type="cpf"
                      value={values.cpf}
                      onChangeText={handleChange('cpf')}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                        handleSubmit();
                      }}
                      blurOnSubmit={false}
                    />
                  </View>
                  {errors.cpf
                   && touched.cpf
                    && <Text style={[styles.text, styles.errorFormText]}>{errors.cpf}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Telefone/Whatsapp</Text>
                  <View style={styles.textInputContainer}>
                    <TextInputMask
                      ref={phone}
                      style={[styles.text, styles.textInput]}
                      placeholderTextColor={colors.placeholderColor}
                      placeholder="99 99999-9999"
                      type="cel-phone"
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) ',
                      }}
                      value={values.phone}
                      onChangeText={handleChange('phone')}
                    />
                  </View>
                  {errors.phone
                   && touched.phone
                    && <Text style={[styles.text, styles.errorFormText]}>{errors.phone}</Text>}
                </View>
                {/*  */}

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={handleSubmit}
                >
                  {loading
                    ? <ActivityIndicator color={`${colors.whiteColor}`} size="large" />
                    : <Text style={[styles.text, styles.buttonText]}>Registrar</Text>}
                  {/* <Text style={[styles.text, styles.buttonText]}>Registrar</Text> */}
                </TouchableOpacity>
              </>
            )}
          </Formik>

        </View>
        <SnackBar visible={visibleSnack} text={snackText} color={snackColor} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: 'left',
  },
  errorFormText: {
    color: colors.errorColor,
    fontSize: 16,
    marginTop: -15,
  },
  header: {
    height: verticalScale(48),
    justifyContent: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatarImageContainer: {
    backgroundColor: colors.disableColor,
    width: scale(150),
    height: scale(150),
    borderRadius: scale(75),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  galleryButtonContainer: {
    zIndex: 2,
    justifyContent: 'flex-end',
    marginLeft: scale(-30),
  },
  galleryButton: {
    backgroundColor: colors.mainColor,
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(30),
  },
  inputContainer: { width: '80%', marginBottom: 10 },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: scale(1),
    height: verticalScale(40),
    borderRadius: scale(4),
    borderColor: colors.placeholderColor,
    marginBottom: scale(20),
  },
  textInput: {
    flex: 1,
    marginLeft: scale(5),
    fontSize: scale(18),
    height: verticalScale(32),
  },
  buttonContainer: {
    width: '50%',
    height: scale(48),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mainColor,
    borderRadius: scale(4),
  },
  buttonText: {
    fontSize: scale(24),
    color: colors.whiteColor,
  },
});
