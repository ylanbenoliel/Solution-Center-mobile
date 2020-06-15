/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Keyboard,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { UserItem } from '@components';

import colors from '@constants/colors';

import { sanitazeString } from '../helpers/functions';
import { api } from '../services/api';

const UsersList = () => {
  const [totalUsers, setTotalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [error, setError] = useState('');
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(null);
  }, [nameInput === '']);

  function fetchUsers() {
    api.get('/users')
      .then((res) => {
        const responseUsers = res.data;
        const users = responseUsers.map((user) => {
          let avatarUrl = null;
          if (user.avatar) {
            avatarUrl = user.avatar.url;
          }
          return { avatarUrl, ...user };
        });
        setTotalUsers(users);
      })
      .catch(() => setError('Erro ao buscar usuários.'))
      .finally(() => {
      });
  }

  function handleSearch() {
    Keyboard.dismiss();
    const searchUsers = totalUsers
      .filter((user) => {
        if (sanitazeString(user.name).includes(sanitazeString(nameInput))) {
          return user;
        }
        return false;
      });
    setFilteredUsers(searchUsers);
  }

  function renderSearchedUsers() {
    if (filteredUsers) {
      return (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UserItem avatar={item.avatarUrl} name={item.name} />
          )}
        />
      );
    }

    return (
      <FlatList
        data={totalUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserItem avatar={item.avatarUrl} name={item.name} />
        )}
      />
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, marginTop: verticalScale(35) }}>
      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <TextInput
            value={nameInput}
            style={[styles.text, styles.textInput]}
            onChangeText={(text) => {
              setNameInput(text);
            }}
            onSubmitEditing={() => handleSearch()}
            placeholder="Buscar usuário"
            autoCapitalize="words"
            autoCorrect={false}
            placeholderTextColor={colors.placeholderColor}
          />
          <TouchableOpacity onPress={() => setNameInput('')}>

            <MaterialCommunityIcons
              name="close"
              size={scale(32)}
              color={colors.placeholderColor}
            />
          </TouchableOpacity>

        </View>
        <Button
          title="Buscar"
          color={colors.mainColor}
          onPress={() => handleSearch()}
        />
        {renderSearchedUsers()}
      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: scale(10) },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
    borderRadius: scale(4),
    borderWidth: scale(2),
    borderColor: colors.mainColor,
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: 'left',
  },
  textInput: {
    marginLeft: scale(5),
    fontSize: scale(18),
    height: verticalScale(42),
  },
});

export default UsersList;
