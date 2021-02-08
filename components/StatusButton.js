/* eslint-disable react/prop-types */
import React from 'react';
import {
  TouchableOpacity, Text, Alert, StyleSheet,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import colors from '@constants/colors';

const StatusButton = ({ code, onCheckIn, onDismiss }) => {
  if (code === '1') {
    return (
      <>
        <TouchableOpacity
          onPress={() => onCheckIn()}
          style={[styles.defaultButton, styles.availableButton]}
        >
          <Text style={styles.text}>Clique para reservar</Text>
        </TouchableOpacity>
      </>
    );
  }
  if (code === '2') {
    return (
      <TouchableOpacity
        onPress={() => onDismiss()}
        style={[styles.defaultButton, styles.reservedButton]}
      >
        <Text style={[styles.text, styles.reservedText]}>Sua reserva</Text>
      </TouchableOpacity>
    );
  }
  if (code === '3') {
    return (
      <TouchableOpacity
        onPress={() => Alert.alert('Erro!', 'Não é possível cancelar esse horário.', [
          { text: 'Ok' },
        ])}
        style={[styles.defaultButton, styles.disabledButton]}
      >
        <Text style={[styles.text, styles.disabledText]}>Sua reserva</Text>
      </TouchableOpacity>
    );
  }
  if (code === '4') {
    return (
      <TouchableOpacity
        style={[styles.defaultButton, styles.unavailableButton]}
        disabled
      >
        <Text style={[styles.text, styles.unavailableText]}>Horário indisponível</Text>
      </TouchableOpacity>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  defaultButton: {
    width: '95%',
    height: '80%',
    borderRadius: verticalScale(8),
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    textAlign: 'center',
    color: colors.whiteColor,
  },
  availableButton: {
    backgroundColor: colors.accentColor,
  },
  reservedButton: {
    borderWidth: 2,
    backgroundColor: colors.whiteColor,
    borderColor: colors.mainColor,
  },
  reservedText: {
    color: colors.mainColor,
  },
  disabledButton: {
    backgroundColor: colors.whiteColor,
  },
  disabledText: {
    color: colors.disableColor,
  },
  unavailableButton: {
    backgroundColor: colors.whiteColor,
  },
  unavailableText: {
    color: colors.errorColor,
  },
});

export default StatusButton;
