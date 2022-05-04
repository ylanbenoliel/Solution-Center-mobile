// /* eslint-disable global-require */
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { LogBox, Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@contexts/auth';

import { api } from '@services/api';

import colors from '@constants/colors';

import Route from './routes/Route';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [loaded] = useFonts({
    // eslint-disable-next-line global-require
    'Amaranth-Regular': require('./assets/fonts/Amaranth-Regular.ttf'),
  });

  useEffect(() => {
    handleInitApp();
  }, []);

  async function handleInitApp() {
    LogBox.ignoreLogs(['Animated:']);
    try {
      await SplashScreen.preventAutoHideAsync();
      prepareResources();
    } catch {
      prepareResources();
    }
  }

  async function prepareResources() {
    getToken();
    getPrivilegies();
    // savePushNotification();
    setAppReady(true);
    await SplashScreen.hideAsync();
  }

  async function getToken() {
    api.interceptors.request.use(async (config) => {
      try {
        const token = await AsyncStorage.getItem('@SC:token');
        if (token) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        return error;
      }
    });
  }

  async function getPrivilegies() {
    try {
      const response = await api.get('/validate-session');
      const { token, admin } = response.data;
      if (token.length !== 0) {
        await AsyncStorage.setItem('@SC:token', token);
        setUserRole(String(admin));
        return;
      }
    } catch (e) {
      // eslint-disable-next-line eqeqeq
      if (e.response.status == 401) {
        setUserRole('s');
        return;
      }
      const userStorage = await AsyncStorage.getItem('@SC:admin');
      if (userStorage === '1' || userStorage === '0') {
        setUserRole(userStorage);
        return;
      }
      setUserRole('s');
    }
  }

  async function savePushNotification() {
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) await api.post('/notification/register', { token: pushToken });
    } catch (e) {
      //
    }
  }

  async function registerForPushNotificationsAsync() {
    let token = null;

    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return token;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      return token;
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: `${colors.mainColor}`,
      });
    }
    return token;
  }

  if (!appReady || !loaded || !userRole) {
    return null;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Route admin={userRole} />
      </AuthProvider>
    </NavigationContainer>
  );
}
