import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "../screens/Login";
import Schedule from "../screens/Schedule";
import Agenda from "../screens/Agenda";

import {
  WhoWeAre,
  Ambients,
  Plans,
  Partners,
  Contact,
} from "../screens/LoginDrawer/index";

import colors from "../constants/colors";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function LoginDrawer() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.whiteColor,
        width: 240,
      }}
    >
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Sobre nós" component={WhoWeAre} />
      <Drawer.Screen name="Ambientes" component={Ambients} />
      <Drawer.Screen name="Planos" component={Plans} />
      <Drawer.Screen name="Parceiros" component={Partners} />
      <Drawer.Screen name="Contato" component={Contact} />
    </Drawer.Navigator>
  );
}

export default function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="LoginDrawer" component={LoginDrawer} />
        <Stack.Screen name="Agendamento" component={Schedule} />
        <Stack.Screen name="Agenda" component={Agenda} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
