import React, { createContext } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  async function signIn(res) {
    await AsyncStorage.setItem('@SC:token', res.data?.token);
    await AsyncStorage.setItem('@SC:admin', String(res.data.is_admin));
  }

  async function signOut() {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  }

  return (
    <AuthContext.Provider value={{
      signIn, signOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
