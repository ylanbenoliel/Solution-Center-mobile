/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ImageBackground,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import colors from '@constants/colors.js';

const RoomButton = ({ name, photo, onClick }) => (
  <TouchableOpacity
    style={styles.roomButton}
    onPress={() => {
      onClick();
    }}
  >
    <ImageBackground
      source={photo}
      imageStyle={{ borderRadius: scale(16) }}
      style={styles.background}
    >
      <Text style={[styles.text, styles.roomText]}>{name}</Text>
    </ImageBackground>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  roomButton: {
    width: '95%',
    height: verticalScale(100),
    borderRadius: scale(16),
    margin: scale(10),
  },
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
  },
  roomText: {
    margin: scale(10),
    fontSize: scale(20),
    color: colors.whiteColor,
  },
});
export default RoomButton;
