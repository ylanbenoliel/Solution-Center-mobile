/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ImageBackground,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import colors from '@constants/colors.js';

const RoomButton = ({ name, onClick }) => (
  <TouchableOpacity
    style={styles.roomButton}
    onPress={() => {
      onClick();
    }}
  >
    <ImageBackground
      source={require('@assets/room-1.png')}
      imageStyle={{ borderRadius: scale(16) }}
      style={styles.background}
    >
      <Text style={[styles.text, styles.roomText]}>{name}</Text>
    </ImageBackground>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  roomButton: {
    width: '95%',
    height: verticalScale(100),
    borderRadius: scale(16),
    margin: scale(10),
  },
  roomText: {
    margin: scale(10),
    fontSize: scale(22),
    color: colors.whiteColor,
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
  },
});
export default RoomButton;
