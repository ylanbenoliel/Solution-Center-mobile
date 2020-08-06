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

import { api } from '@services/api';

import colors from '@constants/colors';
// import { PLAN_DATA } from '@constants/fixedValues';

const UserDetails = ({ data, dataField }) => (
  <View style={{ marginVertical: verticalScale(2) }}>
    <Text style={styles.text}>
      {dataField}
      {': '}
      {data}
    </Text>
  </View>
);

// const Plan = ({ plan }) => {
//   function showPlanName() {
//     const planName = PLAN_DATA.filter((PLAN) => {
//       if (PLAN.plan == plan) { return PLAN.text; }
//       return false;
//     });
//     return planName;
//   }

//   return (
//     <View style={{ backgroundColor: 'red' }}>
//       <Text style={styles.text}>
//         plano:
//         {showPlanName()}
//       </Text>
//     </View>
//   );
// };

const AdminUserModal = ({
  isVisible, onClose, userInfo, userEvents, userPlans, navigation,
}) => {
  const [userDetails, setUserDetails] = useState(userInfo);
  const [eventList, setEventList] = useState(userEvents);
  const [planList, setPlanList] = useState(userPlans);

  useEffect(() => {
    setUserDetails(userInfo);
    setEventList(userEvents);
    setPlanList(userPlans);
    return () => {
      setUserDetails(null);
      setEventList(null);
      setPlanList(null);
    };
  }, [!!isVisible]);

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
          [
            {
              text: 'Ok',
            },
          ]);
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
          [
            {
              text: 'Ok',
            },
          ]);
      });
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

  return (
    <Modal isVisible={isVisible}>
      <View
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.closeModal}
          onPress={() => {
            onClose();
          }}
        >
          <Feather
            name="x"
            size={scale(32)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <Image
            source={avatarUrl}
            style={styles.avatarImage}
          />

          <View style={styles.userContainer}>
            <UserDetails data={userDetails.name} dataField="Nome" />
            <UserDetails data={userDetails.phone} dataField="Telefone" />
            <UserDetails data={userDetails.address} dataField="Endereço" />
            <UserDetails data={userDetails.cpf} dataField="CPF" />
            <UserDetails data={userDetails.rg} dataField="RG" />
            <ToggleUserPermission status={userDetails.is_admin} />
            <ToggleUserLoginSituation status={userDetails.active} />
          </View>

          <View>
            <Text style={styles.text}>Reservas</Text>
          </View>

          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: verticalScale(10),
          }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: scale(130),
                backgroundColor: colors.accentColor,
                padding: scale(10),
                borderRadius: scale(16),
                marginRight: scale(10),
              }}
            >
              <Feather
                name="plus"
                size={scale(30)}
                color={colors.whiteColor}
              />
              <Text style={[styles.text, { color: colors.whiteColor }]}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: scale(130),
                backgroundColor: colors.navigationColor,
                padding: scale(10),
                borderRadius: scale(16),
              }}
              onPress={() => {
                navigation.navigate('Eventos', { events: eventList, user: userDetails });
                onClose();
              }}
            >
              <Feather
                name="edit-2"
                size={scale(28)}
                color={colors.whiteColor}
              />
              <Text style={[styles.text, { color: colors.whiteColor }]}>Editar</Text>
            </TouchableOpacity>
          </View>

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
    flexDirection: 'column',
    alignItems: 'flex-end',
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
    height: verticalScale(240),
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },

});

export default AdminUserModal;
