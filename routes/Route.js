import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Admin } from './admin.routes'
import { LoginDrawer } from './login.routes'

import Schedule from "../screens/Schedule";
import Register from "../screens/Register";

import { scale } from "react-native-size-matters";
import colors from "../constants/colors";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



export function UserDrawer() {
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



export default function Route({ admin }) {
  if (admin == "0") return <UserDrawer />;
  if (admin == "1") return <Admin />;

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="LoginDrawer" component={LoginDrawer} />
      <Stack.Screen name="Registro" component={Register} />
      <Stack.Screen name="UserDrawer" component={UserDrawer} />
      <Stack.Screen name="Admin" component={Admin} />
    </Stack.Navigator>
  );
}
