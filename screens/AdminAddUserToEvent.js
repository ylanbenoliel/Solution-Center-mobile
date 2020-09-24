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
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { GeneralStatusBar } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

const AdminAddUserToEvent = ({ route }) => {
  // const { date, time, room } = route.params;
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

  const User = ({ user }) => {
    const avatarImageUrl = user.avatarUrl
      ? { uri: `${user.avatarUrl}` }
      // eslint-disable-next-line global-require
      : require('@assets/icon.png');

    return (
      <TouchableOpacity
        style={styles.selectedUserContainer}
        key={user.id}
        onPress={() => {}}
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
