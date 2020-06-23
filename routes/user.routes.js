/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Schedule from '@screens/Schedule';
import UserProfile from '@screens/UserProfile';

import colors from '@constants/colors';

const Tab = createBottomTabNavigator();

export default function User() {
  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={({ route }) => ({
      // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Salas') {
            iconName = 'calendar-week';
          }
          if (route.name === 'Perfil') {
            iconName = 'user-alt';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.navigationColor,
        inactiveTintColor: colors.disableColor,
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Salas" component={Schedule} />
      <Tab.Screen name="Perfil" component={UserProfile} />
    </Tab.Navigator>
  );
}
