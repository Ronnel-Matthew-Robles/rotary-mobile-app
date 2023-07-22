// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginPage from "./src/pages/LoginPage";
import HomePage from "./src/pages/HomePage";
import QRCodePage from "./src/pages/QRCodePage";
import ScanQRCodePage from "./src/pages/ScanQRCodePage";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{
            title: "Login",
            headerStyle: {
              backgroundColor: "#06478F",
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            title: "Home",
            headerStyle: {
              backgroundColor: "#06478F",
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="QRCode"
          component={QRCodePage}
          options={{
            title: "My QR Code",
            headerStyle: {
              backgroundColor: "#06478F",
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="ScanQRCode"
          component={ScanQRCodePage}
          options={{
            title: "Scan QR Code",
            headerStyle: {
              backgroundColor: "#06478F",
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
