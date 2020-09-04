/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import colors from '@constants/colors';

// import { Container } from './styles';

const HeaderDrawer = ({ title, navigation }) => (
  <View style={styles.header}>
    <View style={{ width: scale(32) }} />
    <Text style={[styles.text, styles.headerName]}>{title}</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Feather
        name="x"
        size={scale(32)}
        color={colors.navigationColor}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: verticalScale(56),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: scale(32),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
  },
});

export default HeaderDrawer;
