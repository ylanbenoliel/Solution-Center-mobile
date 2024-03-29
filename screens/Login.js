/* eslint-disable global-require */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, {
  useState, useEffect, createRef, useContext,
} from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { GeneralStatusBar, SnackBar } from '@components';

import AuthContext from '@contexts/auth';

import { api } from '@services/api';

import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

export default function Login() {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('.');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [snackColor, setSnackColor] = useState('');

  const field2 = createRef();

  useEffect(() => {
    const timerSnack = setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
    return () => clearTimeout(timerSnack);
  }, [visibleSnack === true]);

  useEffect(() => {
    const timerEmail = setTimeout(() => {
      setEmail('');
    }, 1);
    return () => clearTimeout(timerEmail);
  }, []);

  function showLoadingLogin() {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.whiteColor} />;
    }
    return <Text style={[styles.text, styles.buttonText]}>Entrar</Text>;
  }

  function handleLogin() {
    setLoading(true);
    Keyboard.dismiss();
    if (email === '' || password === '') {
      setSnackColor(colors.errorColor);
      setSnackText('Preencha todos os campos.');
      setVisibleSnack(true);
      setLoading(false);
      return;
    }

    api.post('/authenticate', {
      email,
      password,
    })
      .then((response) => {
        setLoading(false);
        signIn(response);
        if (response.data.is_admin) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Admin' }],
            }),
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'User' }],
            }),
          );
        }
      })
      .catch((e) => {
        setSnackColor(colors.errorColor);
        setLoading(false);
        if (e.response.status === 500) {
          setSnackText('Erro, tente novamente em alguns minutos.');
          setVisibleSnack(true);
          return;
        }
        if (e.response.data) {
          setSnackText(`${e.response.data.message}`);
          setVisibleSnack(true);
          return;
        }
        if (e.request) {
          setSnackText('Erro na conexão.');
          setVisibleSnack(true);
          return;
        }
        setSnackText('Algo deu errado.');
        setVisibleSnack(true);
      });
  }

  function handleRegister() {
    Keyboard.dismiss();
    navigation.navigate('Registro');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteColor }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: scale(20),
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather
              name="menu"
              size={scale(32)}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.select({
          ios: 'padding',
          android: null,
        })}
        style={{
          flex: 1,
        }}
        removeClippedSubviews={false}
      >

        <View style={styles.loginContainer}>
          <Logo width={scale(220)} height={(80)} />

          <View style={{ margin: verticalScale(20) }} />

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Email</Text>

            <View style={styles.textInputContainer}>
              <Feather
                name="user"
                size={scale(26)}
                color={colors.placeholderColor}
              />
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
              <Feather
                name="key"
                size={scale(26)}
                color={colors.placeholderColor}
              />
              <TextInput
                ref={field2}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={[styles.text, styles.textInput]}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.placeholderColor}
                autoCapitalize="none"
                onSubmitEditing={() => handleLogin()}
                // secureTextEntry
                autoCorrect={false}
              />
            </View>

            <View
              style={{
                width: '100%',
                alignItems: 'flex-end',
                paddingHorizontal: scale(16),
                marginBottom: verticalScale(12),
              }}
            >
              <TouchableOpacity
                style={{ justifyContent: 'center', height: 40 }}
                onPress={() => { navigation.navigate('Password'); }}
              >
                <Text
                  style={[styles.text, { fontSize: scale(14) }]}
                >
                  Esqueci minha senha.
                </Text>
              </TouchableOpacity>
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
            style={[styles.buttonContainer,
              {
                backgroundColor: colors.whiteColor,
                borderWidth: 2,
                borderColor: colors.secondaryColor,
              }]}
            onPress={() => {
              handleRegister();
            }}
          >
            <Text style={[styles.text, { color: colors.secondaryColor }]}>
              Registre-se
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <SnackBar visible={visibleSnack} text={snackText} color={snackColor} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: scale(28),
    color: colors.mainColor,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: 'left',
  },
  inputContainer: { width: '80%' },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: scale(4),
    borderWidth: scale(1),
    height: verticalScale(40),
    borderRadius: scale(4),
    borderColor: colors.placeholderColor,
    marginBottom: scale(20),
  },
  textInput: {
    width: '100%',
    marginLeft: scale(5),
    fontSize: scale(18),
    height: verticalScale(32),
  },
  buttonContainer: {
    width: '50%',
    height: scale(48),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryColor,
    marginVertical: verticalScale(16),
    borderRadius: scale(24),
  },
  buttonText: {
    fontSize: scale(24),
    color: colors.whiteColor,
  },
  header: {
    width: '100%',
    height: verticalScale(48),
    justifyContent: 'center',
    // marginTop: verticalScale(20),
  },
});
