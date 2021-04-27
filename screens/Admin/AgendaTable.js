/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { scale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar } from '@components';

import { roomById } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_NAME, ROOM_IDS } from '@constants/fixedValues';

const REFRESH_TIMER = 1 * 60 * 1000;
const INITIAL_MINUTE_COUNTDOWN = 15;

const roomsName = ROOM_NAME;

const tableHead = [
  '',
  roomsName[0],
  roomsName[1],
  roomsName[2],
  roomsName[3],
  roomsName[4],
  roomsName[5],
  roomsName[6],
  roomsName[7],
  roomsName[8],
];

const TableHeader = ({ rooms }) => (
  <View style={styles.header}>
    {rooms.map((room, i) => {
      if (i === 0) {
        return <View key={room} style={[styles.cellStyle, styles.headerCell, { width: 35 }]} />;
      }
      return (
        <View key={room} style={[styles.cellStyle, styles.headerCell]}>
          <Text style={[styles.text, { fontSize: 12 }]}>{room}</Text>
        </View>
      );
    })}
  </View>
);

const HoursColumn = ({ hours }) => (
  <View>
    {hours.map((hour) => (
      <View key={hour} style={[styles.cellStyle, styles.colDateStyle]}>
        <Text style={[styles.text, { color: 'white' }]}>
          {hour}
          h
        </Text>
      </View>
    ))}
  </View>
);

const AgendaTable = ({ route, navigation }) => {
  const { showDate, hours, events } = route.params;

  const [refreshFlatList, setRefreshFlatList] = useState(false);
  const [countdownToRefresh, setCountdownToRefresh] = useState(INITIAL_MINUTE_COUNTDOWN);

  const [date, setDate] = useState('');
  const [eventTable, setEventTable] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const formattedDate = showDate;
    setDate(formattedDate);
    return () => {
      setDate('');
    };
  }, []);

  useEffect(() => {
    setEventTable(events);
  }, []);

  useEffect(() => {
    const eventsWithUser = eventTable.filter((evt) => evt.id);
    setTotalEvents(eventsWithUser.length);
  }, [eventTable]);

  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      const currentTimer = countdownToRefresh - 1;
      if (currentTimer > 0) {
        setCountdownToRefresh(currentTimer);
        return;
      }
      handleRefreshTable();
    }, REFRESH_TIMER);
    return () => {
      clearTimeout(refreshTimer);
    };
  }, [countdownToRefresh]);

  function handleRefreshTable() {
    api.post('/admin/events/agenda', {
      date,
    }).then((response) => {
      const { events: rawEvents } = response.data;
      setEventTable(rawEvents);
      setRefreshFlatList(!refreshFlatList);
    }).catch(() => {
      Alert.alert('Aviso!', 'Não foi possível recarregar a agenda.');
    }).finally(() => { setCountdownToRefresh(INITIAL_MINUTE_COUNTDOWN); });
  }

  function alterEventPayment(eventIndex) {
    const eventFilter = eventTable.find((event) => {
      if (event.index === eventIndex) {
        return event;
      }
      return null;
    });
    api.patch('admin/events/payment', {
      id: eventFilter.id,
      status_payment: Number(!eventFilter.status_payment),
    }).then((res) => {
      const { event } = res.data;

      const hasEvent = {
        ...event,
        index: eventIndex,
        name: eventFilter.name,
        date: event.date.split('T')[0],
      };
      const filterEvents = eventTable.filter((evt) => evt.index !== eventIndex);
      const rawEvents = filterEvents.concat(hasEvent);
      const orderEvents = rawEvents.sort((evt1, evt2) => evt1.index - evt2.index);
      setEventTable(orderEvents);
      setRefreshFlatList(!refreshFlatList);
    }).catch(() => {
      Alert.alert('Aviso!', 'Não foi possível alterar o pagamento.');
    });
  }

  function deleteEvent(eventIndex) {
    const eventFilter = eventTable.find((event) => {
      if (event.index === eventIndex) {
        return event;
      }
      return null;
    });
    api.delete(`admin/events/${eventFilter.id}`)
      .then(() => {
        const hasNoEvent = {
          index: eventIndex,
          date: eventFilter.date,
          time: eventFilter.time,
          room: eventFilter.room,
          name: '',
        };

        const filterEvents = eventTable.filter((evt) => evt.index !== eventIndex);
        const rawEvents = filterEvents.concat(hasNoEvent);
        const orderEvents = rawEvents.sort((evt1, evt2) => evt1.index - evt2.index);
        setEventTable(orderEvents);
        setRefreshFlatList(!refreshFlatList);
      }).catch(() => {
        Alert.alert('Aviso!', 'Não foi possível apagar reserva.');
      });
  }

  const Cell = ({
    name, listname, time, status_payment, room, index, date: cellDate,
  }) => {
    const backgroundColor = Number(time.split(':')[0]) % 2 === 0 ? { backgroundColor: '#ccc' } : { backgroundColor: '#aaa' };
    if (name.length === 0) {
      return (
        <TouchableOpacity
          style={[styles.cellStyle, backgroundColor]}
          onPress={() => {
            Alert.alert('Deseja Adicionar',
              `Usuário na sala ${roomById(room)}, hora: ${time.split(':')[0]}h?`, [{
                text: 'Cancelar',
                style: 'cancel',
              }, {
                text: 'Ok',
                onPress: () => { navigation.navigate('AddUser', { room, time, date: cellDate }); },
              }]);
          }}
        />
      );
    }
    return (
      <View style={[styles.cellStyle, backgroundColor]}>
        <TouchableOpacity
          style={{
            flex: 2, width: '100%', justifyContent: 'center',
          }}
          onPress={() => (
            Alert.alert('Deseja excluir',
              `Reserva de ${listname}, hora: ${time.split(':')[0]}h, sala: ${roomById(room)}?`,
              [{
                text: 'Cancelar',
                style: 'cancel',
              }, {
                text: 'Ok',
                onPress: () => { deleteEvent(index); },
              }]))}
        >
          <Text
            style={[styles.text, { color: colors.mainColor, lineHeight: 14 }]}
          >
            {name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1, width: '90%', alignItems: 'center', justifyContent: 'center',
          }}
          onPress={() => {
            Alert.alert('Deseja alterar',
              `Pagamento do usuário: ${listname}, hora: ${time.split(':')[0]}h, `
              + `sala: ${roomById(room)}?`,
              [{
                text: 'Cancelar',
                style: 'cancel',
              }, {
                text: 'Ok',
                onPress: () => { alterEventPayment(index); },
              }]);
          }}
        >
          <Feather
            name="dollar-sign"
            size={scale(14)}
            color={Number(status_payment) === 1
              ? colors.accentColor
              : colors.errorColor}
          />

        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <View style={{ marginLeft: 16 }}>
        <Text
          style={[styles.text, { color: colors.mainColor }]}
        >
          {`Atualiza em: ${countdownToRefresh} minutos`}
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={[styles.text, { color: colors.mainColor }]}>
          Salas Ocupadas:
          {' '}
          {totalEvents}
        </Text>
        <Text style={[styles.text, { color: colors.disableColor, fontSize: 26 }]}>
          {date.split('-').reverse().join('.')}
        </Text>
        <TouchableOpacity
          onPress={() => { handleRefreshTable(); }}
        >
          <Feather
            name="refresh-cw"
            color={colors.navigationColor}
            size={28}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: '3%', marginBottom: 90 }}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
          >
            <TableHeader rooms={tableHead} />

            <View style={{ flexDirection: 'row' }}>
              <HoursColumn hours={hours} />

              <View style={styles.gridContainer}>
                <FlatList
                  data={eventTable}
                  extraData={refreshFlatList}
                  numColumns={ROOM_IDS.length}
                  keyExtractor={(item) => item.index.toString()}
                  renderItem={({ item }) => (
                    <Cell
                      {...item}
                      key={item.index.toString()}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tableBorder: {
    borderWidth: 2,
    borderColor: colors.disableColor,
  },
  wrapper: { flexDirection: 'row' },
  title: {
    flex: 1,
    backgroundColor: colors.mainColor,
  },
  rows: {
    height: 66,
    backgroundColor: colors.whiteColor,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Amaranth-Regular',
    fontSize: 14,
    color: colors.whiteColor,
  },
  gridContainer: {
    flex: 1,
  },
  headerCell: {
    height: 40,
    width: 55,
    justifyContent: 'center',
    backgroundColor: colors.mainColor,
  },
  colDateStyle: {
    width: 35,
    justifyContent: 'center',
    backgroundColor: colors.mainColor,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellStyle: {
    width: 55,
    height: 66,
    backgroundColor: colors.whiteColor,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default AgendaTable;
