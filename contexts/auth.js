import React, { useState, createContext } from 'react'
import { AsyncStorage } from 'react-native'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function signIn(res) {
    setName(res.data.user['name'])
    setEmail(res.data.user['email'])
    AsyncStorage.setItem("@SC:token", res.data.token);
    AsyncStorage.setItem("@SC:name", res.data.user['name']);
    AsyncStorage.setItem("@SC:email", res.data.user['email']);
    AsyncStorage.setItem("@SC:admin", JSON.stringify(res.data.is_admin)
    );

  }

  function signOut() {
    AsyncStorage.multiRemove(["@SC:token", "@SC:name", "@SC:email", "@SC:admin"])
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, name, email }}>
      {children}
    </AuthContext.Provider>
  )
}


export default AuthContext