import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { LoginDrawer } from './login.routes'
import { User } from './user.routes'
import { Admin } from './admin.routes'

import Register from "@screens/Register";

const Stack = createStackNavigator();
const LoggedStack = createStackNavigator()

const NonLoggedStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="LoginDrawer" component={LoginDrawer} />
    <Stack.Screen name="Registro" component={Register} />
    <Stack.Screen name="User" component={User} />
    <Stack.Screen name="Admin" component={Admin} />
  </Stack.Navigator>
)

export default function Route({ admin }) {
  if (admin == "0") return (
    <LoggedStack.Navigator headerMode='none'>
      <LoggedStack.Screen name='User' component={User} />
      <LoggedStack.Screen name="LoginDrawer" component={LoginDrawer} />
      <LoggedStack.Screen name="Registro" component={Register} />
      <LoggedStack.Screen name="Admin" component={Admin} />
    </LoggedStack.Navigator>
  );
  if (admin == "1") return (
    <LoggedStack.Navigator headerMode='none'>
      <LoggedStack.Screen name='Admin' component={Admin} />
      <LoggedStack.Screen name="LoginDrawer" component={LoginDrawer} />
      <LoggedStack.Screen name="Registro" component={Register} />  
      <LoggedStack.Screen name='User' component={User} />
    </LoggedStack.Navigator>
  )

  return (
    <NonLoggedStack />
  );
}
