import React from "react";
import Agenda from "../screens/Agenda";
import { scale } from "react-native-size-matters";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator()

export function Admin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
      <Tab.Screen name='Agenda' component={Agenda} />
    </Tab.Navigator>

    // <Drawer.Navigator
    //   drawerStyle={{
    //     backgroundColor: colors.whiteColor,
    //     width: scale(180),
    //   }}
    // >
    //   <Drawer.Screen name="Agenda" component={Agenda} />
    // </Drawer.Navigator>
  );
}