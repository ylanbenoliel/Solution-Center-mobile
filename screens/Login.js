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

import { GeneralStatusBar, ShowInfo } from '@components';

import AuthContext from '@contexts/auth';

import { api } from '@services/api';

import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

export default function Login() {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const field2 = createRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 2200);
    return () => clearTimeout(timer);
  }, [error]);

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
      setError('Preencha todos os campos.');
      return setLoading(false);
    }

    api
      .post('/authenticate', {
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
        return null;
      })
      .catch((e) => {
        setLoading(false);
        if (e.response) {
          return setError(`${e.response.data.message}`);
        }
        if (e.request) {
          return setError('Erro na conexão.');
        }
        return setError('Algo deu errado.');
      });
    return null;
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
                  Esqueci minha senha
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
            style={[styles.buttonContainer, { backgroundColor: colors.whiteColor }]}
            onPress={() => {
              handleRegister();
            }}
          >
            <Text style={styles.text}>
              Registre-se
            </Text>
          </TouchableOpacity>
          <ShowInfo error={error} />
        </View>
      </KeyboardAvoidingView>
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
