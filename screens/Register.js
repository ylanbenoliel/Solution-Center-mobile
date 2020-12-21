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

import { GeneralStatusBar, ShowInfo } from '@components';

import { api, url } from '@services/api';

import colors from '@constants/colors';

export default function Register({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const address = useRef(null);
  const cpf = useRef();
  const rg = useRef(null);
  const phone = useRef();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    getPermissionAsync();
  }, []);

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
    const uriParts = image.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    // eslint-disable-next-line no-undef
    const uploadAvatarImage = new FormData();
    uploadAvatarImage.append('avatar', {
      name: `avatar.${fileType}`,
      type: `image/${fileType}`,
      uri:
        image.uri,
    });

    const options = {
      method: 'POST',
      body: uploadAvatarImage,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    // eslint-disable-next-line no-return-await
    // eslint-disable-next-line no-undef
    await fetch(apiUrl, options);
  }

  // function handleRegister() {
  //   Keyboard.dismiss();
  //   setLoading(true);
  //   if (
  //     name === ''
  //     || email === ''
  //     || password === ''
  //     || address === ''
  //     || cpf === ''
  //     || rg === ''
  //     || phone === ''
  //     || image === {}
  //   ) {
  //     setError('Preencha todos os campos.');
  //     setLoading(false);
  //     return null;
  //   }
  //   api.post('/users', {
  //     name: name.trim(),
  //     email: email.trim(),
  //     password: password.trim(),
  //     address: address.trim(),
  //     cpf: cpf.trim(),
  //     rg: rg.trim(),
  //     phone: phone.trim(),
  //   })
  //     .then((response) => {
  //       sendAvatarImage(response.data.id)
  //         .then(() => {
  //           setSuccess(response.data.message);
  //           setTimeout(() => {
  //             navigation.pop();
  //           }, 2500);
  //         })
  //         .catch(() => {
  //           setError('Erro ao enviar imagem.');
  //         });
  //     })
  //     .catch(() => {
  //       setError('Erro ao salvar usuário.');
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }

  // const showLoadingRegister = () => {
  //   if (loading) {
  //     return <ActivityIndicator size="large" color={colors.whiteColor} />;
  //   }
  //   return <Text style={[styles.text, styles.buttonText]}>Registrar</Text>;
  // };

  async function handlePickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar a galeria.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

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
                <Feather
                  name="camera"
                  size={scale(24)}
                  color={colors.whiteColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Formik
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
              console.log(values);
            }}
            validationSchema={FormSchema}
          >
            {({
              values, handleChange, handleSubmit, errors, touched, setFieldTouched,
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
                  <Text style={[styles.text, styles.buttonText]}>Registrar</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

        </View>
        {/* <ShowInfo error={error} success={success} /> */}
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
    marginVertical: verticalScale(16),
    borderRadius: scale(4),
  },
  buttonText: {
    fontSize: scale(24),
    color: colors.whiteColor,
  },
});
