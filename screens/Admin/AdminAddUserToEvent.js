/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { GeneralStatusBar } from '@components';

import { roomById } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

const AdminAddUserToEvent = ({ route, navigation }) => {
  const { date, time, room } = route.params;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    return () => {
      setUsers([]);
    };
  }, []);

  function fetchUsers() {
    api.get('/users')
      .then((res) => {
        const responseUsers = res.data;
        const totalUsers = responseUsers.map((user) => {
          let avatarUrl = null;
          if (user.avatar) {
            avatarUrl = user.avatar.url;
          }
          return { avatarUrl, ...user };
        });
        setUsers(totalUsers);
      })
      .catch(() => {});
  }

  function reserveRoom(user) {
    api.post('/admin/events/new', {
      user: user.id,
      date,
      time,
      room,
    }).then(() => {
      Alert.alert('', 'Reserva salva', [{
        text: 'Ok',
        onPress: () => { navigation.pop(); },
      }]);
    })
      .catch((e) => {
        if (e.response) {
          return Alert.alert('', `${e.response.data.message}`, [{
            text: 'Ok',
          }]);
        } else if (e.request) {
          return Alert.alert('', 'Erro de conexão', [{
            text: 'Ok',
          }]);
        } else {
          return Alert.alert('', 'Erro ao salvar', [{
            text: 'Ok',
          }]);
        }
      });
  }

  function confirmEvent(user) {
    Alert.alert('', `Confirmar ${user.name} para o horário escolhido?`, [{
      text:
      'Não',
      style: 'cancel',
    },
    {
      text: 'Sim',
      onPress: () => {
        reserveRoom(user);
      },
    }]);
  }

  const User = ({ user }) => {
    const avatarImageUrl = user.avatarUrl
      ? { uri: `${user.avatarUrl}` }
      // eslint-disable-next-line global-require
      : require('@assets/icon.png');

    return (
      <TouchableOpacity
        style={styles.selectedUserContainer}
        onPress={() => { confirmEvent(user); }}
      >

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
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <View style={styles.roomInfo}>
        <Text style={styles.text}>
          Sala
          {' '}
          {roomById(room)}
        </Text>
        <Text style={styles.text}>
          Dia
          {' '}
          {date.split('-').reverse().join('/')}
        </Text>
        <Text style={styles.text}>
          Hora
          {' '}
          {time.split(':')[0]}
          h
        </Text>
      </View>
      <FlatList
        data={users}
        contentContainerStyle={{
          paddingBottom: verticalScale(40),
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <User user={item} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    marginHorizontal: scale(16),
  },
  roomInfo: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  selectedUserContainer: {
    backgroundColor: colors.whiteColor,
    marginVertical: verticalScale(2),
    paddingVertical: verticalScale(6),
    borderBottomWidth: 2,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
    textAlign: 'left',
  },
});

export default AdminAddUserToEvent;
