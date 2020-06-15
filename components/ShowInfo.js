/* eslint-disable react/prop-types */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';

import colors from '@constants/colors';

const ShowInfo = ({ error, success }) => {
  if (error) {
    return (
      <View style={[styles.container, styles.errorBackground]}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }
  if (success) {
    return (
      <View style={[styles.container, styles.successBackground]}>
        <Text style={styles.text}>{success}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    height: verticalScale(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(4),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    textAlign: 'center',
    color: colors.whiteColor,
  },
  errorBackground: {
    backgroundColor: colors.errorColor,
  },
  successBackground: {
    backgroundColor: colors.accentColor,
  },
});

export default ShowInfo;
