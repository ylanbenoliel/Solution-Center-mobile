/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState, memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import ListEmpty from '@components/ListEmpty';
import Separator from '@components/Separator';

import { removeDuplicates, roomById } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

const EventInfo = ({
  date, time, room, status_payment: status,
}) => {
  const roomName = roomById(room);
  return (
    <View style={styles.eventInfoContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>
          Dia:
          {' '}
          {date.split('T')[0].split('-').reverse().join('/')}
        </Text>

        <Text style={styles.text}>
          Hora:
          {' '}
          {time.split(':')[0]}
          h
        </Text>

        <Text style={styles.text}>
          Sala:
          {' '}
          {roomName}
        </Text>
      </View>

      <View style={{ flex: 1, height: '100%', alignItems: 'center' }}>
        <Text style={styles.text}>Pagamento</Text>
        {Number(status) === 0 ? (
          <TouchableOpacity onPress={() => {
            Alert.alert('', 'Pagamento em aberto',
              [{ text: 'Ok' }]);
          }}
          >
            <Feather
              name="x"
              size={scale(24)}
              color={colors.errorColor}
            />
          </TouchableOpacity>
        ) : (
          <Feather
            name="check"
            size={scale(22)}
            color={colors.accentColor}
          />
        )}
      </View>

    </View>
  );
};

const EventInfoMemo = memo(EventInfo);

const UserEventsModal = ({ isVisible, onClose }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [events, setEvents] = useState(null);

  async function fetchData(pageToLoad = 1) {
    try {
      if (totalPages && (pageToLoad > totalPages)) {
        return;
      }
      const eventsResponse = await api.get(`/events/list/user?page=${pageToLoad}`);
      const incomingEvents = (eventsResponse.data.data);
      if (pageToLoad === 1) {
        if (incomingEvents.length === 0) {
          setEvents([]);
          return;
        }
        setEvents(incomingEvents);
        return;
      }
      const combineEvents = [...events, ...incomingEvents];
      const eventsWithoutDuplicates = removeDuplicates(combineEvents, 'id');
      setTotalPages(eventsResponse.data.lastPage);
      setEvents(eventsWithoutDuplicates);
      setPage(page + 1);
    } catch (error) {
      setEvents([]);
    }
  }

  function handleOpenModal() {
    fetchData();
  }

  function handleCloseModal() {
    setEvents(null);
    setPage(1);
  }

  return (
    <Modal
      isVisible={isVisible}
      style={styles.container}
      onModalShow={() => { handleOpenModal(); }}
      onModalHide={() => { handleCloseModal(); }}
      onBackButtonPress={() => { onClose(); }}
      onBackdropPress={() => { onClose(); }}
    >
      <View style={styles.header}>
        <View style={{ height: scale(32), width: scale(32) }} />
        <Text style={[styles.text, { fontSize: scale(24) }]}>Reservas</Text>
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
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: event }) => (
            <EventInfoMemo key={event.id} {...event} />
          )}
          ItemSeparatorComponent={() => (<Separator />)}
          onEndReachedThreshold={0.6}
          onEndReached={() => fetchData(page + 1)}
          ListEmptyComponent={(
            <ListEmpty
              modal
              label={events ? 'Sem mensagens.' : 'Carregando...'}
            />
          )}
        />
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  eventInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingLeft: scale(10),
  },
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderRadius: 20,
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
    fontSize: scale(18),
    color: colors.mainColor,
  },
});

export default UserEventsModal;
