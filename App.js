import React from "react";
import Route from "./routes/Route";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";

export default function App() {
  let [fontsLoaded] = useFonts({
    "Amaranth-Regular": require("./assets/fonts/Amaranth-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <Route />;
  }
}
