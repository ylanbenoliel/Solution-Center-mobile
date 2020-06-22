import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Schedule from '@screens/Schedule';

import colors from '@constants/colors';

const Tab = createBottomTabNavigator();

export default function User() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
      // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Salas') {
            iconName = 'ios-bookmarks';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.navigationColor,
        inactiveTintColor: colors.disableColor,
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Salas" component={Schedule} />
    </Tab.Navigator>
  );
}
