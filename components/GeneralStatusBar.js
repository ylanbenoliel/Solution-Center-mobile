import React from 'react';
import {
  StatusBar, Platform, View, StyleSheet,
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

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
