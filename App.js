// /* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import {
  AsyncStorage, Platform,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from './contexts/auth';
import Route from './routes/Route';
import { api } from './services/api';

export default function App() {
  const [admin, setAdmin] = useState('');
  const [appReady, setAppReady] = useState(false);
  const [loaded] = useFonts({
    // eslint-disable-next-line global-require
    'Amaranth-Regular': require('./assets/fonts/Amaranth-Regular.ttf'),
  });

  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    handleInitApp();
  }, []);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // console.log('notification', notification);
      // setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // console.log('response', response);
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('notification', {
        name: 'notification',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        // lightColor: '#FF231F7C',
      });
    }

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function handleInitApp() {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (error) {
      await SplashScreen.hideAsync();
    }
    prepareResources();
  }

  async function prepareResources() {
    getToken();
    getPrivilegies();
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
      const isAdmin = await AsyncStorage.getItem('@SC:admin');
      setAdmin(isAdmin);
    } catch (error) {
      setAdmin(null);
    }
  }

  if (!loaded || !appReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Route admin={admin} />
      </AuthProvider>
    </NavigationContainer>
  );
}
