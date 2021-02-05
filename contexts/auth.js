import React, { createContext } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import { api } from '@services/api';

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  async function signIn(res) {
    AsyncStorage.setItem('@SC:token', res.data.token);
    AsyncStorage.setItem('@SC:email', res.data.user.email);
  }

  function signOut() {
    AsyncStorage.multiRemove(['@SC:token', '@SC:name', '@SC:email', '@SC:admin']);
  }

  async function savePushNotification() {
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) await api.post('/notification/register', { token: pushToken });
    } catch {
      //
    }
  }
  async function registerForPushNotificationsAsync() {
    let token = '';
    try {
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
      }
    } catch {
      return;
    }
    return token;
  }

  return (
    <AuthContext.Provider value={{
      signIn, signOut, savePushNotification,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
