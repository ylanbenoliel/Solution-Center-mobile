import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AdminProfile from '@screens/AdminProfile';
import AdminUserList from '@screens/AdminUserList';
import Agenda from '@screens/Agenda';
import Notifications from '@screens/Notifications';

import colors from '@constants/colors';

const Tab = createBottomTabNavigator();

export default function Admin() {
  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Agenda') {
            iconName = 'calendar-alt';
          }
          if (route.name === 'Usuários') {
            iconName = 'user-friends';
          }
          if (route.name === 'Notificações') {
            iconName = 'bell';
          }
          if (route.name === 'Perfil') {
            iconName = 'user';
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
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Usuários" component={AdminUserList} />
      <Tab.Screen name="Notificações" component={Notifications} />
      <Tab.Screen name="Perfil" component={AdminProfile} />
    </Tab.Navigator>
  );
}
