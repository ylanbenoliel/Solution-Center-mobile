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
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { api } from '@services/api';

import colors from '@constants/colors';

const AdminUserModal = ({
  isVisible, onClose, userInfo, userEvents,
}) => {
  const [eventList, setEventList] = useState(userEvents);
  const [userDetails, setUserDetails] = useState(userInfo);

  useEffect(() => {
    setUserDetails(userInfo);
    setEventList(userEvents);
    return () => {
      setUserDetails(null);
      setEventList(null);
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

  const UserDetails = ({ data, dataField }) => (
    <View style={{ marginVertical: verticalScale(2) }}>
      <Text style={styles.text}>
        {dataField}
        {': '}
        {data}
      </Text>
    </View>
  );

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
                Alert.alert('Aviso', `O usuário pagou a reserva Hora:${singleEvent.time.split(':')[0]}h Sala: ${singleEvent.room}?`,
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
          <MaterialCommunityIcons
            name="close"
            size={scale(32)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>

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

          <ToogleUserLoginSituation status={userDetails.active} />
        </View>

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
