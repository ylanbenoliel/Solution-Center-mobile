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
  RefreshControl,
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
  const [success, setSuccess] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [planList, setPlanList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debtEnabled, setDebtEnabled] = useState(false);
  const [debt, setDebt] = useState([]);

  useEffect(() => {
    fetchUsers();
    return () => {
      setTotalUsers(null);
      setFilteredUsers(null);
      setUserInfo(null);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [!!error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [!!success]);

  useEffect(() => {
    setFilteredUsers(null);
  }, [nameInput === '']);

  function fetchUsers(refresh = null) {
    setFilteredUsers(null);
    if (refresh) {
      setIsRefreshing(true);
    }

    const requestUsers = api.get('/users');
    const requestUsersWithDebt = api.get('/users/debt');

    axios.all([requestUsers, requestUsersWithDebt])
      .then(axios.spread((...responses) => {
        const responseUsers = responses[0].data;
        const users = responseUsers.map((user) => {
          let avatarUrl = null;
          if (user.avatar) {
            avatarUrl = user.avatar.url;
          }
          return { avatarUrl, ...user };
        });

        const { ids } = responses[1].data;
        setTotalUsers(users);
        setDebt(ids);
      }))
      .catch(() => setError('Erro ao buscar usuários.'))
      .finally(() => {
        if (refresh) {
          setIsRefreshing(false);
        }
      });
  }

  function handleRefresh() {
    fetchUsers(true);
  }

  function handleSearch() {
    Keyboard.dismiss();

    if (filteredUsers) {
      setSuccess('Todos os usuários.');
      setDebtEnabled(false);
      return setFilteredUsers(null);
    }
    const searchUsers = totalUsers
      .filter((user) => {
        if (sanitizeString(user.name).includes(sanitizeString(nameInput))) {
          return user;
        }
        return false;
      });
    return setFilteredUsers(searchUsers);
  }

  function handleSeeDebts() {
    Keyboard.dismiss();
    if (filteredUsers) {
      setSuccess('Todos os usuários.');
      setDebtEnabled(false);
      return setFilteredUsers(null);
    }
    const searchUsers = totalUsers
      .flatMap((user) => debt.flatMap((debtID) => {
        if (user.id === debtID) return user;
        return false;
      }))
      .filter((hasUser) => hasUser);
    setDebtEnabled(true);
    setSuccess('Pendentes.');
    return setFilteredUsers(searchUsers);
  }

  function handleSeeInactiveUsers() {
    Keyboard.dismiss();
    if (filteredUsers) {
      setSuccess('Todos os usuários.');
      setDebtEnabled(false);
      return setFilteredUsers(null);
    }
    const searchUsers = totalUsers.filter((user) => {
      if (Number(user.active) === 0) {
        return user;
      }
      return false;
    });
    setSuccess('Inativos.');
    return setFilteredUsers(searchUsers);
  }

  function handleOpenModal(user) {
    setLoading(true);
    setUserInfo(user);
    setPlanList(null);
    if (debtEnabled) {
      navigation.navigate('Pagamentos', { user: user.id });
    } else {
      const requestPlans = api.get(`/plans/${user.id}`);

      axios.all([requestPlans])
        .then(axios.spread((...responses) => {
          const responsePlans = responses[0];
          setPlanList(Number(responsePlans.data.plan));
          setLoading(false);
          setIsModalOpen(true);
        }))
        .catch(() => {
          setLoading(false);
          setError('Erro ao buscar informações.');
        });
    }
    setLoading(false);
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
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        )}
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

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch()}
          >
            <Text style={[styles.text, { color: colors.whiteColor }]}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: 'green' }]}
            onPress={() => handleSeeDebts()}
          >
            <Text style={[styles.text, { color: colors.whiteColor }]}>Pendentes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: 'red' }]}
            onPress={() => handleSeeInactiveUsers()}
          >
            <Text style={[styles.text, { color: colors.whiteColor }]}>Inativos</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
          <ShowInfo error={error} success={success} />
        </View>

        <RenderSearchedUsers />

        {!!userInfo && (
        <AdminUserModal
          userInfo={userInfo}
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
    marginHorizontal: scale(16),
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
    padding: scale(4),
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(5),
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
