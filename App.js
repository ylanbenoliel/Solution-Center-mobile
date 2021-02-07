// /* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  Platform, LogBox,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@contexts/auth';

import { api } from '@services/api';

import colors from '@constants/colors';

import Route from './routes/Route';

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

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('notification', {
        name: 'notification',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: `${colors.mainColor}`,
      });
    }
  }, []);

  async function handleInitApp() {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch {
      await SplashScreen.hideAsync();
    }
    prepareResources();
    LogBox.ignoreLogs(['Animated:']);
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
      const response = await api.get('/validate-session');
      const { token, admin } = response.data;
      if (token.length !== 0) {
        await AsyncStorage.setItem('@SC:token', token);
        setUserRole(String(admin));
        return;
      }
      setUserRole('s');
    } catch {
      setUserRole('s');
    }
  }

  if (!loaded || !appReady || userRole === null) {
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
