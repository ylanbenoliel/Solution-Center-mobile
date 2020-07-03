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
import { isPast, parseISO } from 'date-fns';

import {
  UserItem, ShowInfo, AdminUserModal, Loading,
} from '@components';

import { sanitazeString } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

const UsersList = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [error, setError] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [eventList, setEventList] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    return () => {
      setTotalUsers(null);
      setFilteredUsers(null);
      setUserInfo(null);
      setEventList(null);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [!!error]);

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
      .catch(() => setError('Erro ao buscar usuários.'));
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

  function handleOpenModal(user) {
    setUserInfo(user);
    setLoading(true);
    api.post('/admin/events/list/user', {
      user: user.id,
    })
      .then((res) => {
        const { events } = res.data;
        const pastEvents = events.filter((evt) => {
          if (isPast(parseISO(evt.date.split('T')[0]))) {
            return evt;
          }
          return false;
        });
        setEventList(pastEvents);
      })
      .catch(() => {
      })
      .finally(() => {
        setLoading(false);
        setIsModalOpen(true);
      });
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    fetchUsers();
  }

  function renderSearchedUsers() {
    const hasFilteredUsers = filteredUsers !== null ? filteredUsers : totalUsers;
    return (
      <FlatList
        data={hasFilteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserItem
            {...item}
            onClick={() => handleOpenModal(item)}
          />
        )}
      />
    );
  }

  const renderLoading = () => {
    if (loading) {
      return (
        <View style={styles.conditionalLoading}>
          <Loading loading={loading} />
        </View>
      );
    }
    return null;
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
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

        <View style={{ alignItems: 'center' }}>
          <ShowInfo error={error} />
        </View>

        {renderSearchedUsers()}

        {!!userInfo && (
        <AdminUserModal
          userInfo={userInfo}
          userEvents={eventList}
          isVisible={isModalOpen}
          onClose={() => handleCloseModal()}
        />
        )}

      </View>
      {renderLoading()}
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(10),
    marginTop: verticalScale(40),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: scale(15),
    fontSize: scale(18),
    height: verticalScale(42),
  },
  conditionalLoading: {
    zIndex: 10,
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default UsersList;
