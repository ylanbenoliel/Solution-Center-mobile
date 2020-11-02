import React from 'react';
import {
  Text, SafeAreaView,
} from 'react-native';

import { GeneralStatusBar, HeaderDrawer } from '@components';

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

      <Text>Política de privacidade</Text>

      <Text>Proprietário e Controlador de Dados</Text>

    </SafeAreaView>
  </>
);

export default About;
