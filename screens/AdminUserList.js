/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import axios from 'axios';

import {
  UserItem, ShowInfo, AdminUserModal, Loading, GeneralStatusBar,
} from '@components';

import { sanitizeString } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

const AdminUserList = ({ navigation }) => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [error, setError] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [eventList, setEventList] = useState(null);
  const [planList, setPlanList] = useState(null);
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
        }).sort((a, b) => a.name.localeCompare(b.name));

        setTotalUsers(users);
      })
      .catch(() => setError('Erro ao buscar usuários.'));
  }

  function handleSearch() {
    Keyboard.dismiss();
    const searchUsers = totalUsers
      .filter((user) => {
        if (sanitizeString(user.name).includes(sanitizeString(nameInput))) {
          return user;
        }
        return false;
      });
    setFilteredUsers(searchUsers.sort((a, b) => a.name.localeCompare(b.name)));
  }

  function handleOpenModal(user) {
    setLoading(true);
    setUserInfo(user);
    setEventList(null);

    const requestEvents = api.post('/admin/events/list/user', {
      user: user.id,
    });

    const requestPlans = api.get(`/plans/${user.id}`);

    axios.all([requestEvents, requestPlans])
      .then(axios.spread((...responses) => {
        const responseEvents = responses[0];
        const responsePlans = responses[1];
        const { events } = responseEvents.data;

        setPlanList(responsePlans.data);
        setEventList(events);
      }))
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

  const RenderSearchedUsers = () => {
    const hasFilteredUsers = filteredUsers !== null
      ? filteredUsers
      : totalUsers;
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(130) }}
        data={hasFilteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: user }) => (
          <UserItem
            {...user}
            onClick={() => handleOpenModal(user)}
          />
        )}
      />
    );
  };

  const RenderLoading = () => {
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
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
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
            <Feather
              name="x"
              size={scale(32)}
              color={colors.placeholderColor}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch()}
        >
          <Text style={[styles.text, { color: colors.whiteColor }]}>Buscar</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <ShowInfo error={error} />
        </View>

        <RenderSearchedUsers />

        {!!userInfo && (
        <AdminUserModal
          userInfo={userInfo}
          userEvents={eventList}
          userPlans={planList}
          isVisible={isModalOpen}
          onClose={() => handleCloseModal()}
          navigation={navigation}
        />
        )}

      </View>
      <RenderLoading />
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
    height: verticalScale(42),
  },
  searchButton: {
    backgroundColor: colors.mainColor,
    paddingVertical: verticalScale(10),
    borderRadius: scale(4),
    marginBottom: verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
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

export default AdminUserList;
