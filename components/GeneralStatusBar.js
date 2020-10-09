import React from 'react';
import {
  StatusBar, View, StyleSheet,
} from 'react-native';

const STATUSBAR_HEIGHT = 20;

// eslint-disable-next-line react/prop-types
const GeneralStatusBar = ({ backgroundColor, ...props }) => (
  <View style={styles.statusBar}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default GeneralStatusBar;
