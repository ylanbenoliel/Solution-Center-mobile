/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { api } from '@services/api';

import colors from '@constants/colors';

import { formatPlainCPF, formatPlainPhone, convertDateTimeToDate } from '../helpers/functions';

const UserDetails = ({ data, dataField }) => (
  <View style={{ marginVertical: verticalScale(2) }}>
    <Text style={styles.text}>
      {dataField}
      {': '}
      {data}
    </Text>
  </View>
);

const AdminUserModal = ({
  isVisible, onClose, userInfo, userPlanNumber, userPlanDate,
}) => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState(userInfo);
  const [planNumber, setPlanNumber] = useState(1);
  const [planUpdated, setPlanUpdated] = useState(userPlanDate);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setUserDetails(userInfo);
    setPlanNumber(userPlanNumber);
    setPlanUpdated(userPlanDate);
    setReload(false);
    return () => {
      setUserDetails(null);
      setPlanNumber(null);
      setPlanUpdated(null);
    };
  }, [!!isVisible]);

  useEffect(() => {
    setReload(true);
  }, [userDetails, planNumber]);

  const avatarUrl = !!userInfo && userInfo.avatarUrl !== null
    ? { uri: `${userInfo.avatarUrl}` }
    : require('@assets/icon.png');

  function toggleLoginAccess() {
    api.patch(`/users/${userDetails.id}`, {
      active: !userDetails.active,
    }).then(() => {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        active: !userDetails.active,
      }));
    })
      .catch(() => {
        Alert.alert('Aviso', 'Erro ao atualizar login do cliente.',
          [{ text: 'Ok' }]);
      });
  }

  function toggleAdminAccess() {
    api.patch(`/users/${userDetails.id}`, {
      is_admin: !userDetails.is_admin,
    }).then(() => {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        is_admin: !userDetails.is_admin,
      }));
    })
      .catch(() => {
        Alert.alert('Aviso', 'Erro ao atualizar permissões do cliente.',
          [{ text: 'Ok' }]);
      });
  }

  async function handlePlanChange(value) {
    try {
      await api.post(`/plans/${userDetails.id}`, {
        plan: value,
      });
      setPlanNumber(value);
    } catch (e) {
      Alert.alert('', e.response?.data?.message || 'Erro de conexão.');
    }
  }

  function handleSeeDebts() {
    onClose({ message: '', reload: false });
    navigation.navigate('Pagamentos', { user: userDetails.id });
  }

  function showFormattedDate(dateTimeString) {
    const time = convertDateTimeToDate(dateTimeString);
    return time;
  }

  async function handleDeleteUser() {
    Alert.alert('Aviso!', 'Deseja apagar o usuário?', [{
      text:
      'Cancelar',
      style: 'cancel',
    }, {
      text: 'Apagar',
      onPress: () => { deleteUser(userDetails.id); },
    }]);
  }

  async function deleteUser(id) {
    try {
      const { data } = await api.delete(`/users/${id}`);
      onClose({ message: `${data.message}`, reload });
    } catch (e) {
      if (e.response?.data?.message) {
        Alert.alert(`${e.response?.data?.message}`);
        return;
      }
      Alert.alert('Erro de conexão.');
    }
  }

  const ToggleUserPermission = ({ status }) => (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.text}>
        Admin:
        {' '}
      </Text>
      <TouchableOpacity onPress={() => {
        Alert.alert('Aviso', 'Deseja alterar as permissões do usuário?',
          [{
            text:
            'Cancelar',
            style: 'cancel',
          }, {
            text: 'Ok',
            onPress: () => { toggleAdminAccess(); },
          }]);
      }}
      >
        <Text style={[styles.text, { color: 'orange' }]}>
          {status == 1 ? 'Sim' : 'Não'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ToggleUserLoginSituation = ({ status }) => (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.text}>
        Status:
        {' '}
      </Text>
      <TouchableOpacity onPress={() => {
        Alert.alert('Aviso', 'Deseja alterar o acesso desse usuário?',
          [{
            text:
            'Cancelar',
            style: 'cancel',
          }, {
            text: 'Ok',
            onPress: () => { toggleLoginAccess(); },
          }]);
      }}
      >
        <Text style={[styles.text, { color: 'orange' }]}>
          {status == 1 ? 'Ativo' : 'Inativo'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const PlanOption = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.planOptionDefaultButton,
        { backgroundColor: planNumber === value ? colors.mainColor : colors.whiteColor }]}
      onLongPress={() => { handlePlanChange(value); }}
    >
      <Text
        style={[styles.text,
          { color: planNumber === value ? colors.whiteColor : styles.text.color }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>

        <View style={styles.closeModal}>

          <TouchableOpacity onPress={() => { handleDeleteUser(); }}>
            <Feather
              name="trash"
              size={scale(32)}
              color={colors.accentColor}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { onClose({ reload }); }}>
            <Feather
              name="x"
              size={scale(32)}
              color={colors.navigationColor}
            />
          </TouchableOpacity>

        </View>

        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}>
          <Image
            defaultSource={require('@assets/icon.png')}
            source={avatarUrl}
            style={styles.avatarImage}
          />

          <View style={styles.userContainer}>
            <UserDetails data={userDetails.name} dataField="Nome" />
            <UserDetails data={formatPlainPhone(userDetails.phone)} dataField="Telefone" />
            <UserDetails data={userDetails.email} dataField="Email" />
            <UserDetails data={userDetails.address} dataField="Endereço" />
            <UserDetails data={formatPlainCPF(userDetails.cpf)} dataField="CPF" />
            <UserDetails data={userDetails.rg} dataField="RG" />
            <ToggleUserPermission status={userDetails.is_admin} />
            <ToggleUserLoginSituation status={userDetails.active} />
          </View>

          <View>
            <Text style={styles.text}>Opções</Text>
          </View>

          <View
            style={{
              flex: 1,
              width: scale(300),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: verticalScale(10),
            }}
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.accentColor }]}
              onPress={() => {
                navigation.navigate('Adicionar', { user: userDetails });
                onClose({ message: '', reload: false });
              }}
            >
              <Feather
                name="plus"
                size={scale(30)}
                color={colors.whiteColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#804d00' }]}
              onPress={() => {
                navigation.navigate('Eventos', {
                  user: userDetails.id,
                });
                onClose({ message: '', reload: false });
              }}
            >
              <Feather
                name="edit-2"
                size={scale(28)}
                color={colors.whiteColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, {
                backgroundColor: 'green',
              }]}
              onPress={() => {
                handleSeeDebts();
              }}
            >
              <Feather
                name="dollar-sign"
                size={scale(28)}
                color={colors.whiteColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.secondaryColor }]}
              onPress={() => {
                navigation.push('Mensagens', { user: userDetails.id });
                onClose({ message: '', reload: false });
              }}
            >
              <Feather
                name="bell"
                size={scale(28)}
                color={colors.whiteColor}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: verticalScale(20) }}>
            <Text style={styles.text}>Plano</Text>
          </View>

          {planUpdated && (
          <Text style={[styles.text, { fontSize: 12 }]}>
            Atualizado em:
            {'\t'}
            {showFormattedDate(planUpdated)}
          </Text>
          )}

          <View style={{ marginBottom: verticalScale(10) }} />

          <View style={styles.planOptionContainer}>
            <PlanOption label="Hora Avulsa" value={1} />
            <PlanOption label="Mensal" value={2} />
            <PlanOption label="Fidelidade" value={3} />
          </View>

          <View style={{ marginBottom: verticalScale(10) }} />

        </ScrollView>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeModal: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(8),
  },
  avatarImage: {
    width: scale(150),
    height: scale(150),
    borderRadius: scale(5),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: 'justify',
  },
  userContainer: {
    height: verticalScale(280),
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: scale(60),
    padding: scale(10),
    borderRadius: scale(16),
  },
  planOptionContainer: {
    width: '96%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planOptionDefaultButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(6),
    borderRadius: scale(16),
    borderColor: colors.mainColor,
    borderWidth: 2,
  },
});

export default AdminUserModal;
