/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import colors from '@constants/colors';

const HeaderDrawer = ({ title, screen }) => {
  const navigation = useNavigation();
  const goToScreen = screen || 'Home';
  return (
    <View style={styles.header}>
      <View style={{ width: scale(32) }} />
      <Text style={[styles.text, styles.headerName]}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(goToScreen)}>
        <Feather
          name="x"
          size={scale(32)}
          color={colors.navigationColor}
        />
      </TouchableOpacity>
    </View>
  );
};

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
