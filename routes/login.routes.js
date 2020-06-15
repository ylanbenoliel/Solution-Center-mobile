import React from 'react';
import { scale } from 'react-native-size-matters';

import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from '@screens/Login';
import {
  WhoWeAre,
  Ambients,
  Plans,
  Partners,
  Contact,
} from '@screens/LoginDrawer/index';

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
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Sobre nós" component={WhoWeAre} />
      <Drawer.Screen name="Ambientes" component={Ambients} />
      <Drawer.Screen name="Planos" component={Plans} />
      <Drawer.Screen name="Parceiros" component={Partners} />
      <Drawer.Screen name="Contato" component={Contact} />
    </Drawer.Navigator>
  );
}
