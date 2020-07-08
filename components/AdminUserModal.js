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
  FlatList,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { api } from '@services/api';

import colors from '@constants/colors';

const UserDetails = ({ data, dataField }) => (
  <View style={{ marginVertical: verticalScale(2) }}>
    <Text style={styles.text}>
      {dataField}
      {': '}
      {data}
    </Text>
  </View>
);

const Plan = ({ plan }) => {
  const [text, setText] = useState('');
  if (plan == 1) {
    return setText('Hora avulsa');
  }

  return (
    <View style={{ backgroundColor: 'green' }}>
      <Text style={styles.text}>
        plano:
        {text}
      </Text>
    </View>
  );
};

const AdminUserModal = ({
  isVisible, onClose, userInfo, userEvents, userPlans,
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

  function confirmEventPayment(eventId) {
    api.patch('/admin/events/update', {
      id: eventId,
      status_payment: 1,
    })
      .then(() => {
        setEventList(eventList.filter((evt) => {
          if (evt.id !== eventId) { return evt; } return false;
        }));
      })
      .catch(() => {
        Alert.alert('Aviso', 'Erro ao salvar informação de pagamento.',
          [
            {
              text: 'Ok',
            },
          ]);
      });
  }

  const ShowNotPaidEvent = ({ singleEvent }) => {
    if (singleEvent.status_payment === 0) {
      const onlyDate = singleEvent.date.split('T')[0];
      const dateWithBars = onlyDate.split('-').reverse().join('/');
      return (
        <View
          key={singleEvent.id}
          style={styles.eventsNotPaidContainer}
        >
          <Text style={styles.text}>
            Data:
            {' '}
            {dateWithBars}
          </Text>
          <Text style={styles.text}>
            Hora:
            {' '}
            {singleEvent.time}
          </Text>
          <Text style={styles.text}>
            Sala:
            {' '}
            {singleEvent.room}
          </Text>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.accentColor,
                width: scale(80),
                height: verticalScale(40),
                borderRadius: scale(8),
              }}
              onLongPress={() => {
                Alert.alert('Aviso',
                  `O usuário pagou a reserva Hora: ${singleEvent.time.split(':')[0]}h Dia: ${dateWithBars}?`,
                  [{
                    text:
                    'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Ok',
                    onPress: () => { confirmEventPayment(singleEvent.id); },
                  }]);
              }}
            >
              <Text style={[styles.text, { color: 'white' }]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const ToogleUserPermission = ({ status }) => (

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
  const ToogleUserLoginSituation = ({ status }) => (

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
            <ToogleUserPermission status={userDetails.is_admin} />
            <ToogleUserLoginSituation status={userDetails.active} />
          </View>

          {/* <Text style={styles.text}>Planos</Text> */}

          {/* {!!planList && planList.map((p) => {
            const { plan, id } = p;
            return (
              <Plan key={id} plan={plan} />
            );
          })} */}

          {/* <FlatList
            data={planList}
            contentContainerStyle={{ flex: 1 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Plan key={item.id} plan={item.plan} />
            )}
          /> */}

          <Text style={styles.text}>Horários não pagos</Text>
          <FlatList
            horizontal
            data={eventList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ShowNotPaidEvent
                singleEvent={item}
              />
            )}
          />
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
    alignItems: 'flex-start',
    paddingVertical: verticalScale(10),
  },
  eventsNotPaidContainer: {
    marginVertical: verticalScale(5),
    marginHorizontal: scale(5),
  },
});

export default AdminUserModal;
