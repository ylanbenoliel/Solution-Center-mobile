/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, memo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import {
  UserItem, ShowInfo, AdminUserModal, Loading, GeneralStatusBar, ListEmpty,
} from '@components';

import { sanitizeString } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

const UserItemMemo = memo(UserItem);

const AdminUserList = () => {
  const navigation = useNavigation();

  const [totalUsers, setTotalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [nameInput, setNameInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [planNumber, setPlanNumber] = useState(1);
  const [planUpdated, setPlanUpdated] = useState(null);

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
        if (sanitizeString(user.listname)
          .includes(sanitizeString(nameInput))) {
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

  async function fetchPlanData(id) {
    setPlanNumber(1);
    setPlanUpdated(null);
    try {
      const planResponse = await api.get(`/plans/${id}`);
      setPlanNumber(Number(planResponse.data.plan));
      if (planResponse.data.updated) {
        setPlanUpdated(planResponse.data.updated);
      }
    } catch (e) {
      //
    }
    setIsModalOpen(true);
  }

  function handleOpenModal(user) {
    if (debtEnabled) {
      navigation.navigate('Pagamentos', { user: user.id });
    }
    setLoading(true);
    setUserInfo(user);
    fetchPlanData(user.id);
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
          <UserItemMemo
            {...user}
            onClick={() => handleOpenModal(user)}
          />
        )}
        ListEmptyComponent={(
          <ListEmpty
            label={totalUsers ? 'Carregando...' : 'Sem usuários'}
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
          isVisible={isModalOpen}
          onClose={() => handleCloseModal()}

          userInfo={userInfo}
          userPlanNumber={planNumber}
          userPlanDate={planUpdated}
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
