import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Register from '@screens/Register';

import Admin from './admin.routes';
import Login from './login.routes';
import User from './user.routes';

const Stack = createStackNavigator();
const LoggedStack = createStackNavigator();

const NonLoggedStack = () => (
  <Stack.Navigator headerMode="float">
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    <Stack.Screen name="Registro" component={Register} />
    <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
    <Stack.Screen name="Admin" component={Admin} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// eslint-disable-next-line react/prop-types
export default function Route({ admin }) {
  if (admin === '0') {
    return (
      <LoggedStack.Navigator headerMode="float">
        <LoggedStack.Screen name="User" component={User} options={{ headerShown: false }} />
        <LoggedStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <LoggedStack.Screen name="Registro" component={Register} />
        <LoggedStack.Screen name="Admin" component={Admin} options={{ headerShown: false }} />
      </LoggedStack.Navigator>
    );
  }
  if (admin === '1') {
    return (
      <LoggedStack.Navigator headerMode="float">
        <LoggedStack.Screen name="Admin" component={Admin} options={{ headerShown: false }} />
        <LoggedStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <LoggedStack.Screen name="Registro" component={Register} />
        <LoggedStack.Screen name="User" component={User} options={{ headerShown: false }} />
      </LoggedStack.Navigator>
    );
  }

  return (
    <NonLoggedStack />
  );
}
