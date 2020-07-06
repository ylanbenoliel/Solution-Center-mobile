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
  Dimensions,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { GeneralStatusBar, ShowInfo } from '@components';

import AuthContext from '@contexts/auth';

import { api } from '@services/api';

import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

export default function Login({ navigation }) {
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
        if (response.data.active === 0) {
          return setError('Usuário pendente de liberação.');
        }
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
          return setError('Usuário não encontrado');
        }
        if (e.request) {
          setLoading(false);
          return setError('Erro na conexão.');
        }
        return null;
      });
    return null;
  }

  function handleRegister() {
    Keyboard.dismiss();
    navigation.navigate('Registro');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor="rgba(255,255,255,0.1)"
        barStyle="dark-content"
      />
      {/* <ImageBackground
        style={{ flex: 1 }}
        imageStyle={styles.imageBackground}
        source={require('../assets/LogoHorizontal.png')}
        resizeMode="center"
      > */}
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
          <Logo width={200} height={70} />

          <View style={{
            flexDirection: 'row',
            width: '55%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <Text style={[styles.text, styles.headerText]}>
              Entre com sua
              conta Solution
            </Text>
          </View>

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
                secureTextEntry
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
            <Text style={[styles.text, styles.buttonText]}>Registre-se</Text>
          </TouchableOpacity>
          <ShowInfo error={error} />
        </View>
      </KeyboardAvoidingView>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    opacity: 0.1,
    position: 'absolute',
    left: 0,
    top: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
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
    borderRadius: scale(4),
    borderWidth: scale(2),
    height: verticalScale(40),
    borderColor: colors.mainColor,
    marginBottom: scale(20),
    justifyContent: 'center',
  },
  textInput: {
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
    marginTop: verticalScale(20),
  },
});
