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

  useEffect(() => {
    setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
  }, [visibleSnack === true]);

  function handleSubmitCode() {
    Keyboard.dismiss();
    api.post('/verify-reset-code', {
      code,
      email,
    })
      .then(() => { navigation.navigate('NewPassword', { email }); })
      .catch((e) => {
        setVisibleSnack(true);
        if (e.response) {
          return setSnackText(`${e.response.data.message}`);
        }
        if (e.request) {
          return setSnackText('Erro na conexão.');
        }
        return setSnackText('Algo deu errado.');
      });
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
            Digite o código recebido no email.
          </Text>
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
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                handleSubmitCode();
              }}
            >
              <Text style={[styles.text, { color: colors.whiteColor }]}>
                Enviar
              </Text>
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
