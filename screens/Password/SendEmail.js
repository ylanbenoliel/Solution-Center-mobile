import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { useNavigation } from '@react-navigation/native';

import { GeneralStatusBar, SnackBar } from '@components';

import { api } from '@services/api';

import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

const SendEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
  }, [visibleSnack === true]);

  function handleSubmitEmail() {
    Keyboard.dismiss();

    if (!email) {
      setSnackText('Insira um email.');
      setVisibleSnack(true);
      return;
    }

    setLoading(true);
    api.get(`/forgot-password/${email}`)
      .then(() => { navigation.navigate('VerifyCode', { email }); })
      .catch((e) => {
        setVisibleSnack(true);
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

  function showLoadingSubmitEmail() {
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
            Digite seu email para receber
            o código de verificação.
          </Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.text, styles.textInput]}
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              placeholder="Digite seu email"
              placeholderTextColor={colors.placeholderColor}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              onSubmitEditing={() => handleSubmitEmail()}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => { handleSubmitEmail(); }}
            >
              {showLoadingSubmitEmail()}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      <SnackBar
        text={snackText}
        visible={visibleSnack}
        color={`${colors.errorColor}`}
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

export default SendEmail;
