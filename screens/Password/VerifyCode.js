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
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { useNavigation } from '@react-navigation/native';

import { GeneralStatusBar, SnackBar } from '@components';

import { api } from '@services/api';

import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

const VerifyCode = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
  }, [visibleSnack === true]);

  function handleSubmitCode() {
    Keyboard.dismiss();

    if (!code) {
      setSnackText('Digite um código.');
      setVisibleSnack(true);
      return;
    }

    setLoading(true);

    api.post('/verify-reset-code', {
      code: code.trim(),
      email,
    })
      .then(() => { navigation.navigate('NewPassword', { email }); })
      .catch((e) => {
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
        <View style={styles.inputContainer}>
          <Text style={[styles.text, { textAlign: 'center' }]}>
            Digite o código recebido no email. (Caixa principal ou spam.)
          </Text>
          <View style={{ height: 10 }} />
          <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.text, styles.textInput]}
              value={code}
              onChangeText={(text) => setCode(text)}
              placeholder="Somente números."
              placeholderTextColor={colors.placeholderColor}
              autoCapitalize="none"
              keyboardType="number-pad"
              autoCorrect={false}
              onSubmitEditing={() => handleSubmitCode()}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                handleSubmitCode();
              }}
            >
              {showLoadingSubmitCode()}
            </TouchableOpacity>
          </View>

        </View>
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

export default VerifyCode;
