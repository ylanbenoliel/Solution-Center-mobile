/* eslint-disable global-require */
import React from 'react';
import {
  SafeAreaView, View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { GeneralStatusBar, HeaderDrawer } from '@components';

import { url } from '@services/api';

import colors from '@constants/colors';

// eslint-disable-next-line react/prop-types
const About = ({ navigation }) => (
  <>
    <GeneralStatusBar
      backgroundColor={colors.whiteColor}
      barStyle="dark-content"
    />
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.whiteColor,
    }}
    >

      <HeaderDrawer navigation={navigation} gotToScreen="Login" title="Sobre o app" />

      <View style={{ width: '100%', paddingHorizontal: 16 }} />

      <WebView
        source={{ uri: `${url}/privacy` }}
      />

    </SafeAreaView>
  </>
);
export default About;
