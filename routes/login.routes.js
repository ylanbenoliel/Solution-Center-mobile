import React from 'react';
import { scale } from 'react-native-size-matters';

import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  WhoWeAre,
  Ambients,
  Plans,
  Contact,
} from '@screens/Drawer/index';
import Login from '@screens/Login';

import colors from '@constants/colors';

const Drawer = createDrawerNavigator();

export default function LoginDrawer() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.whiteColor,
        width: scale(180),
      }}
    >
      <Drawer.Screen name="Home" component={Login} options={{ title: 'Login' }} />
      <Drawer.Screen name="Sobre nós" component={WhoWeAre} />
      <Drawer.Screen name="Ambientes" component={Ambients} />
      <Drawer.Screen name="Planos" component={Plans} />
      <Drawer.Screen name="Contato" component={Contact} />
    </Drawer.Navigator>
  );
}
