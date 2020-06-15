/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';

import { AuthProvider } from './contexts/auth';
import Route from './routes/Route';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState('');
  const [admin, setAdmin] = useState('');

  useEffect(() => {
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
    getToken();
    // getPrivilegies();
  }, []);
  const [fontsLoaded] = useFonts({
    'Amaranth-Regular': require('./assets/fonts/Amaranth-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer>
      <AuthProvider>
        <Route admin={admin} />
      </AuthProvider>
    </NavigationContainer>
  );
}
