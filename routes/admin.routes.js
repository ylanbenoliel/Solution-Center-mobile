import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Agenda from '@screens/Agenda';

import colors from '@constants/colors';

const Tab = createBottomTabNavigator();

export default function Admin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Agenda') {
            iconName = 'ios-calendar';
          }
          // else if (route.name === 'Settings') {
          //   iconName = focused ? 'ios-list-box' : 'ios-list';
          // }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.navigationColor,
        inactiveTintColor: colors.disableColor,
      }}
    >
      <Tab.Screen name="Agenda" component={Agenda} />
    </Tab.Navigator>
  );
}
