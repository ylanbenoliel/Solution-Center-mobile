import React from 'react';
import {
  StatusBar,
} from 'react-native';

// const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

// eslint-disable-next-line react/prop-types
const GeneralStatusBar = ({ backgroundColor, ...props }) => (
  <StatusBar backgroundColor={backgroundColor} {...props} />
);

// const styles = StyleSheet.create({
//   statusBar: {
//     height: STATUSBAR_HEIGHT,
//   },
// });

export default GeneralStatusBar;
