
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Schedule from "@screens/Schedule";

import { scale } from "react-native-size-matters";
import colors from "@constants/colors";

const Drawer = createDrawerNavigator();

export function User() {
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