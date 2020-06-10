import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Register from "../screens/Register";

import { LoginDrawer } from './login.routes'
import { User } from './user.routes'
import { Admin } from './admin.routes'

const Stack = createStackNavigator();

export default function Route({ admin }) {
  if (admin == "0") return <User />;
  if (admin == "1") return <Admin />;

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="LoginDrawer" component={LoginDrawer} />
      <Stack.Screen name="Registro" component={Register} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Admin" component={Admin} />
    </Stack.Navigator>
  );
}
