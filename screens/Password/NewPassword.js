/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { useNavigation, CommonActions } from '@react-navigation/native';

import { GeneralStatusBar, SnackBar } from '@components';

import { api } from '@services/api';

import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

const NewPassword = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [snackColor, setSnackColor] = useState(colors.errorColor);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
  }, [visibleSnack === true]);

  function handleSubmitPassword() {
    Keyboard.dismiss();

    if (!password) {
      setSnackText('Insira uma senha.');
      setSnackColor(colors.errorColor);
      setVisibleSnack(true);
      return;
    }

    setLoading(true);

    api.patch('/password', {
      email,
      password: password.trim(),
    })
      .then((res) => {
        setSnackText(res.data.message);
        setSnackColor(colors.accentColor);
        setVisibleSnack(true);

        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
          );
        }, 2000);
      })
      .catch((e) => {
        setSnackColor(`${colors.errorColor}`);
        if (String(e.response.status).includes('5')) {
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
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function showLoadingSubmitCode() {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.whiteColor} />;
    }
    return <Text style={[styles.text, { color: colors.whiteColor }]}>Enviar</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteColor }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={styles.container}>
        <Logo width={scale(220)} height={(80)} />
        <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
          <Text style={[styles.text, { textAlign: 'center' }]}>
            Digite uma nova senha para seu usuário.
          </Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.text, styles.textInput]}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder=""
              placeholderTextColor={colors.placeholderColor}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onSubmitEditing={() => handleSubmitPassword()}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => { handleSubmitPassword(); }}
            >
              {showLoadingSubmitCode()}
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </View>

      <SnackBar
        text={snackText}
        visible={visibleSnack}
        color={snackColor}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
  },
  inputContainer: { width: '80%', marginVertical: scale(20) },
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
});

export default NewPassword;
