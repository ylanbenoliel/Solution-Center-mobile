/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { scale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Info from '@components/Info';

import {
  WhoWeAre,
  Ambients,
  Plans,
  Contact,
} from '@screens/Drawer/index';
import Schedule from '@screens/User/Schedule';
import UserProfile from '@screens/User/UserProfile';

import colors from '@constants/colors';

const Drawer = createDrawerNavigator();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const StackShell = createStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.mainColor,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',

  },
};

function UserInfo() {
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={screenOptions}
    >
      <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
      <Stack.Screen name="Info" component={Info} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

function User() {
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

function UserDrawer() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.whiteColor,
        width: scale(180),
      }}
    >
      <Drawer.Screen name="Home" component={User} options={{ title: 'Início' }} />
      <Drawer.Screen name="Sobre nós" component={WhoWeAre} />
      <Drawer.Screen name="Ambientes" component={Ambients} />
      <Drawer.Screen name="Planos" component={Plans} />
      <Drawer.Screen name="Contato" component={Contact} />
    </Drawer.Navigator>
  );
}

export default function Shell() {
  return (
    <StackShell.Navigator headerMode="none">
      <StackShell.Screen name="Shell" component={UserDrawer} />
    </StackShell.Navigator>
  );
}
