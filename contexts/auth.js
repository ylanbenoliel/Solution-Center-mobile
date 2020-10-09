import React, { useState, createContext } from 'react';
import { AsyncStorage, Alert, Platform } from 'react-native';

import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { api } from '@services/api';

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function signIn(res) {
    setName(res.data.user.name);
    setEmail(res.data.user.email);
    AsyncStorage.setItem('@SC:token', res.data.token);
    AsyncStorage.setItem('@SC:name', res.data.user.name);
    AsyncStorage.setItem('@SC:email', res.data.user.email);
    AsyncStorage.setItem('@SC:admin', JSON.stringify(res.data.is_admin));
    registerForPushNotificationsAsync(res.data.user.email);
  }

  function signOut() {
    AsyncStorage.multiRemove(['@SC:token', '@SC:name', '@SC:email', '@SC:admin']);
  }

  async function registerForPushNotificationsAsync(eMail) {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Não será possível receber notificações.');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();

      if (token) {
        api.post('/notification/register', { email: eMail, token }).then(() => {}).catch(() => {});
      }
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  }

  return (
    <AuthContext.Provider value={{
      signIn, signOut, name, email,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
