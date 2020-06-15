import React from "react";
import Login from "@screens/Login";
import {
  WhoWeAre,
  Ambients,
  Plans,
  Partners,
  Contact,
} from "@screens/LoginDrawer/index";
import { scale } from "react-native-size-matters";
import colors from "@constants/colors";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

export function LoginDrawer() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.whiteColor,
        width: scale(180),
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