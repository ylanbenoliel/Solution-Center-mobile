/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Info from '@components/Info';

import Schedule from '@screens/Schedule';
import UserProfile from '@screens/UserProfile';

import colors from '@constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function UserInfo() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Info" component={Info} />
    </Stack.Navigator>
  );
}

export default function User() {
  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={({ route }) => ({
      // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Salas') {
            iconName = 'calendar';
          }
          if (route.name === 'Perfil') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.navigationColor,
        inactiveTintColor: colors.disableColor,
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Salas" component={Schedule} />
      <Tab.Screen name="Perfil" component={UserInfo} />
    </Tab.Navigator>
  );
}
