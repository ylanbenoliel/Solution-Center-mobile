import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Schedule from "./screens/Schedule";
import colors from "./constants/colors";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ModalTester from "./components/ModalTester";
const Stack = createStackNavigator();

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Schedule />
    //   {/* <Text>Open up App.js to start working on your app!</Text> */}
    // </View>
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Schedule" component={Schedule} />
        {/* <Stack.Screen name="Teste" component={ModalTester} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainColor,
    alignItems: "center",
    justifyContent: "center"
  }
});
