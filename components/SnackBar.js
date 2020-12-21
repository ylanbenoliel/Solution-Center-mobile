/* eslint-disable react/prop-types */
import React from 'react';
import SnackBar from 'react-native-snackbar-component';

const Snack = ({ text, color, visible }) => (
  <SnackBar
    visible={visible}
    textMessage={text}
    backgroundColor={color}
  />
);

export default Snack;
