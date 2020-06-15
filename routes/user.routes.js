import React from 'react';
import { scale } from 'react-native-size-matters';

import { createDrawerNavigator } from '@react-navigation/drawer';

import Schedule from '@screens/Schedule';

import colors from '@constants/colors';

const Drawer = createDrawerNavigator();

export default function User() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.whiteColor,
        width: scale(180),
      }}
    >
      <Drawer.Screen name="Agendamento" component={Schedule} />
    </Drawer.Navigator>
  );
}
