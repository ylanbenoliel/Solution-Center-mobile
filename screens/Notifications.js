/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar, ShowInfo } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

const Notifications = () => {
  const [textToSend, setTextToSend] = useState('');
  const [totalUsers, setTotalUsers] = useState(null);
  const [allSelected, setAllSelected] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [success]);

  function handleSelection(userInfo) {
    const selectedUser = totalUsers.map((user) => {
      if (user.id === userInfo.id) {
        return { ...user, selected: !user.selected };
      }
      return user;
    });
    setTotalUsers(selectedUser);
  }

  function handleSelectAll(list) {
    const selectAllUsers = list.map((user) => ({ ...user, selected: true }));
    setTotalUsers(selectAllUsers);
    setAllSelected(true);
  }

  function handleDeselectAll(list) {
    const selectAllUsers = list.map((user) => ({ ...user, selected: false }));
    setTotalUsers(selectAllUsers);
    setAllSelected(false);
  }

  function handleSendMessage() {
    const selectedUsers = totalUsers.filter((user) => {
      if (user.selected) {
        return user;
      }
      return false;
    }).map((user) => user.id);
    if (selectedUsers === [] || textToSend === '') {
      return setError('Nada para enviar.');
    }
    api.post('/messages', {
      user: selectedUsers,
      message: textToSend,
    })
      .then((res) => { setSuccess(res.data.message); })
      .catch((err) => { setError(err.data.message); });
    return null;
  }

  function fetchUsers() {
    api.get('/users')
      .then((res) => {
        const responseUsers = res.data;
        const users = responseUsers.map((user) => {
          let avatarUrl = null;
          const selected = false;
          if (user.avatar) {
            avatarUrl = user.avatar.url;
          }
          return { avatarUrl, selected, ...user };
        }).sort((a, b) => a.name.localeCompare(b.name));
        setTotalUsers(users);
      })
      .catch(() => {});
  }

  const SelectedUser = ({ user }) => {
    const avatarImageUrl = user.avatarUrl
      ? { uri: `${user.avatarUrl}` }
      // eslint-disable-next-line global-require
      : require('@assets/icon.png');

    return (
      <TouchableOpacity
        style={styles.selectedUserContainer}
        key={user.id}
        onPress={() => handleSelection(user)}
      >

        {user.selected === false
          ? (<Feather name="x" color="red" size={scale(20)} />)
          : (<Feather name="check" color={colors.accentColor} size={scale(20)} />)}

        <View style={{ marginHorizontal: scale(5) }}>
          <Image source={avatarImageUrl} style={styles.avatarImage} />
        </View>
        <Text style={[styles.text, { fontSize: scale(16) }]}>
          {' '}
          {user.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <TextInput
            value={textToSend}
            style={[styles.text, styles.textInput]}
            onChangeText={(text) => {
              setTextToSend(text);
            }}
            multiline
            onSubmitEditing={() => { handleSendMessage(); }}
            placeholder="Mensagem"
            autoCorrect={false}
            placeholderTextColor={colors.placeholderColor}
          />
          <TouchableOpacity onPress={() => setTextToSend('')}>
            <Feather
              name="x"
              size={scale(32)}
              color={colors.placeholderColor}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

          {allSelected === false ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => { handleSelectAll(totalUsers); }}
            >
              <Text style={[styles.text, { color: colors.whiteColor }]}>
                Marcar todos
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => { handleDeselectAll(totalUsers); }}
            >
              <Text style={[styles.text, { color: colors.whiteColor }]}>
                Desmarcar todos
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accentColor }]}
            onPress={() => { handleSendMessage(); }}
          >
            <Text
              style={[styles.text, { color: colors.whiteColor }]}
            >
              Enviar Mensagem
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{
          width: '100%',
          alignItems: 'center',
          marginBottom: verticalScale(4),
        }}
        >
          <ShowInfo error={error} success={success} />
        </View>

        <FlatList
          data={totalUsers}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            borderTopWidth: 2,
            borderColor: '#ccc',
            paddingBottom: verticalScale(160),
          }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SelectedUser user={item} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(10),
    marginTop: verticalScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
    borderRadius: scale(14),
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
    flex: 1,
    marginLeft: scale(15),
    fontSize: scale(18),
    height: verticalScale(52),
  },
  button: {
    width: '46%',
    backgroundColor: colors.mainColor,
    paddingVertical: verticalScale(10),
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(5),
  },
  selectedUserContainer: {
    marginVertical: verticalScale(2),
    paddingVertical: verticalScale(6),
    borderBottomWidth: 2,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
  },
});

export default Notifications;
