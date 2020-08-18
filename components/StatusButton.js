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
        <Text style={styles.text}>Sua reserva</Text>
      </TouchableOpacity>
    );
  }
  if (code === '3') {
    return (
      <TouchableOpacity
        onPress={() => Alert.alert('Erro', 'Não é possível cancelar esse horário', [
          { text: 'Ok' },
        ])}
        style={[styles.defaultButton, styles.disabledButton]}
      >
        <Text style={styles.text}>Sua reserva</Text>
      </TouchableOpacity>
    );
  }
  if (code === '4') {
    return (
      <TouchableOpacity
        style={[styles.defaultButton, styles.unavailableButton]}
        disabled
      >
        <Text style={styles.text}>Horário indisponível</Text>
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
  availableButton: {
    backgroundColor: colors.accentColor,
  },
  reservedButton: {
    backgroundColor: colors.mainColor,
  },
  disabledButton: {
    backgroundColor: colors.disableColor,
  },
  unavailableButton: {
    backgroundColor: colors.errorColor,
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    textAlign: 'center',
    color: colors.whiteColor,
  },
});

export default StatusButton;
