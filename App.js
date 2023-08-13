// App.js
import React, {useState, useEffect, useRef} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef, navigate } from './src/util/NavigationUtil';

import LoginPage from "./src/pages/LoginPage";
import HomePage from "./src/pages/HomePage";
import NotificationsPage from "./src/pages/NotificationsPage";
import QRCodePage from "./src/pages/QRCodePage";
import ScanQRCodePage from "./src/pages/ScanQRCodePage";
import PublicationsPage from "./src/pages/PublicationsPage";
import FinancialStatementsPage from "./src/pages/FinancialStatementsPage";
import AttendanceSheetPage from "./src/pages/AttendanceSheetPage";

// import * as Device from 'expo-device';
import { Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notifications, setNotifications] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => 
      {
        // console.log(token)
        AsyncStorage.setItem("expoToken", token);
        setExpoPushToken(token) });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      async (notification) => {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        // Store the notifications in AsyncStorage
        try {
          const storedNotifications = await AsyncStorage.getItem('notifications');
          const updatedNotifications = JSON.stringify([
            ...JSON.parse(storedNotifications || '[]'),
            { ...notification, date: Date.now(), seen: false },
          ]);
          await AsyncStorage.setItem('notifications', updatedNotifications);
          console.log("Successfully stored new notif")
        } catch (error) {
          console.error('Error storing notifications:', error);
        }
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Opened', response);
      navigate("Notifications");
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
          name="Notifications"
          options={{
            title: "Notifications",
            headerStyle: {
              backgroundColor: "#06478F",
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          {() => (<NotificationsPage notifs={notifications} />)}
        </Stack.Screen>
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
        <Stack.Screen
          name="Publications"
          component={PublicationsPage}
          options={{
            title: "Publications",
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
          name="FinancialStatements"
          component={FinancialStatementsPage}
          options={{
            title: "Financial Statements",
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
          name="AttendanceSheet"
          component={AttendanceSheetPage}
          options={{
            title: "Attendance Sheet",
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

async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default App;
