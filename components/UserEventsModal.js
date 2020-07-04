/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import colors from '@constants/colors';

const EventInfo = ({
  date, time, room, status_payment: status,
}) => (
  <View style={styles.eventInfoContainer}>
    <Text style={styles.text}>
      Hora:
      {' '}
      {time.split(':')[0]}
      H
    </Text>
    <Text style={styles.text}>
      Dia:
      {' '}
      {date.split('T')[0].split('-').reverse().join('-')}
    </Text>
    <Text style={styles.text}>
      Sala:
      {' '}
      {room}
    </Text>
    <Text style={styles.text}>
      Status da reserva:
      {' '}
      {Number(status) === 1 ? 'Pago' : 'Não pago'}
    </Text>
  </View>
);

const UserEventsModal = ({ isVisible, onClose, events }) => (

  <Modal isVisible={isVisible} style={styles.container}>
    <View style={styles.header}>
      <View style={{ height: scale(32), width: scale(32) }} />
      <Text style={[styles.text, { fontSize: scale(24) }]}>Eventos</Text>
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
    </View>

    <View style={{ flex: 9, width: '90%' }}>

      {events !== null ? (
        <FlatList
          data={events}
          contentContainerStyle={{
            borderTopWidth: 2,
            borderColor: '#ccc',
          }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: event }) => (
            <EventInfo key={event.id} {...event} />
          )}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.text, { fontSize: scale(24) }]}>
            Não há horários marcados
          </Text>
        </View>
      )}
    </View>

  </Modal>
);

const styles = StyleSheet.create({
  eventInfoContainer: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    paddingVertical: verticalScale(4),
    paddingLeft: scale(10),
  },
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderRadius: 4,
    alignItems: 'center',
  },
  header: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeModal: {
    marginRight: scale(4),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(20),
    color: colors.mainColor,
  },
});

export default UserEventsModal;
