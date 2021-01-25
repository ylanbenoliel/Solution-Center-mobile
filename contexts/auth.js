import React, { useState, createContext } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
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
    registerForPushNotificationsAsync()
      .then((token) => api.post('/notification/register',
        { email: res.data.user.email, token }))

      .catch(() => {
        // console.log('token nao enviado');
      });
  }

  function signOut() {
    AsyncStorage.multiRemove(['@SC:token', '@SC:name', '@SC:email', '@SC:admin']);
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log(token);
    } else {
      // alert('Must use physical device for Push Notifications');
    }

    return token;
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
