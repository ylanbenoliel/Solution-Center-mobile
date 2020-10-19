// /* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  AsyncStorage, Vibration,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import { Notifications } from 'expo';
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
  useEffect(() => {
    handleInitApp();
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
    Notifications.addListener(handleNotification);
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

  async function handleNotification() {
    Vibration.vibrate();
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
