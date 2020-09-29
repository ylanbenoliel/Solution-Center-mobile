/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import ListEmpty from '@components/ListEmpty';
import Separator from '@components/Separator';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const EventInfo = ({
  date, time, room, status_payment: status,
}) => {
  const roomName = ROOM_DATA.map((data) => {
    if (data.room === Number(room)) { return data.name.split(' ')[0]; }
    return false;
  });

  return (
    <View style={styles.eventInfoContainer}>
      <View style={{
        flex: 1,
      }}
      >

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

      <View style={{
        flex: 1, height: '100%', alignItems: 'center',
      }}
      >
        <Text style={styles.text}>Pagamento</Text>
        {Number(status) === 0 ? (
          <TouchableOpacity onPress={() => {
            Alert.alert('', 'Pagamento em aberto',
              [
                {
                  text: 'Ok',
                },
              ]);
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

const UserEventsModal = ({ isVisible, onClose }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [label, setLabel] = useState('Carregando...');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 2000);
  }, []);

  useEffect(() => {
    getData();
  }, [page]);

  function getData() {
    if (totalPages && (page > totalPages)) {
      return null;
    }
    api.get(`/events/list/user?page=${page}`)
      .then((res) => {
        const incomingEvents = (res.data.data);
        if (page === 1) {
          if (incomingEvents.length === 0) {
            return setEvents('Sem reservas');
          }
          return setEvents(incomingEvents);
        }
        const combineEvents = [...events, ...incomingEvents];
        setTotalPages(res.data.lastPage);
        return setEvents(combineEvents);
      })
      .catch(() => setLabel('Erro ao pesquisar reservas.'));
    return null;
  }

  function handleLoadMore() {
    setPage(page + 1);
  }

  return (

    <Modal isVisible={isVisible} style={styles.container}>
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
            <EventInfo key={event.id} {...event} />
          )}
          ItemSeparatorComponent={() => (<Separator />)}
          onEndReachedThreshold={0.5}
          onEndReached={() => handleLoadMore()}
          ListEmptyComponent={<ListEmpty label={label} />}
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
