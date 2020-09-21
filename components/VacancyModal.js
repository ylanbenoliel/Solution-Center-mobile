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
} from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { roomById } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_NAME, ROOM_IDS } from '@constants/fixedValues';

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

const TableHeader = () => (
  <View style={styles.header}>
    {tableHead.map((r, i) => {
      if (i === 0) {
        return <View key={r} style={[styles.cellStyle, styles.headerCell, { width: 35 }]} />;
      }
      return (
        <View key={r} style={[styles.cellStyle, styles.headerCell]}>
          <Text style={[styles.text, { fontSize: 12 }]}>{r}</Text>
        </View>
      );
    })}
  </View>

);

const VacancyModal = ({
  hours, events, isVisible, showDate, onClose,
}) => {
  const tableHours = hours;
  const tableData = events;
  const [date, setDate] = useState('');
  const [eventTable, setEventTable] = useState([]);

  useEffect(() => {
    const formattedDate = showDate.split('-').reverse().join('.');
    setDate(formattedDate);
    return () => {
      setDate('');
    };
  }, [isVisible === true]);

  useEffect(() => {
    setEventTable(tableData);
  }, [isVisible === true]);

  function alterEventPayment(eventIndex) {
    const eventFilter = eventTable.find((event) => {
      if (event.index === eventIndex) {
        return event;
      }
    });
    api.patch('admin/events/payment', {
      id: eventFilter.id,
      status_payment: Number(!eventFilter.status_payment),
    }).then((res) => {
      const { event } = res.data;
      const hasEvent = { index: eventIndex, ...event };
      const filterEvents = eventTable.filter((evt) => evt.index !== eventIndex);
      const rawEvents = filterEvents.push(hasEvent);
      const orderEvents = rawEvents.sort((evt1, evt2) => evt1.index - evt2.index);
      setEventTable(orderEvents);
    }).catch(() => {});
  }
  function deleteEvent(eventIndex) {
    const eventFilter = eventTable.find((event) => {
      if (event.index === eventIndex) {
        return event;
      }
    });
    api.delete(`admin/events/${eventFilter.id}`).then((res) => {
      // const { event } = res.data;
      // const hasEvent = { index: eventIndex, ...event };
      // const filterEvents = eventTable.filter((evt) => evt.index !== eventIndex);
      // const rawEvents = filterEvents.push(hasEvent);
      // const orderEvents = rawEvents.sort((evt1, evt2) => evt1.index - evt2.index);
      // setEventTable(orderEvents);
    }).catch(() => {});
  }

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>

        <View style={styles.modalHeader}>
          <View style={{ width: 32 }} />
          <Text style={[styles.text, { color: colors.disableColor, fontSize: 26 }]}>
            {date}
          </Text>
          <TouchableOpacity
            style={{ justifyContent: 'flex-end' }}
            onPress={() => { onClose(); }}
          >
            <Feather
              name="x"
              color={colors.navigationColor}
              size={32}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ margin: '3%' }}
          showsVerticalScrollIndicator={false}
        >

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'column' }}
          >
            <TableHeader />

            <View style={styles.cols}>
              <View>
                {tableHours.map((col) => (
                  <View key={col} style={[styles.cellStyle, styles.colDateStyle]}>
                    <Text style={[styles.text, { color: 'white' }]}>
                      {col}
                      h
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.gridContainer}>
                <FlatList
                  data={eventTable}
                  numColumns={ROOM_IDS.length}
                  keyExtractor={(item) => item.index.toString()}
                  renderItem={({ item }) => (<Cell key={item.index.toString()} {...item} />)}
                />
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </Modal>
  );

  function Cell({
    name, time, status_payment, room, index,
  }) {
    if (name.length === 0) {
      return (
        <TouchableOpacity
          style={styles.cellStyle}
          onPress={() => {
            Alert.alert('Deseja Adicionar',
              `Usuário na sala ${roomById(room)}, hora: ${time.split(':')[0]}h?`, [{
                text: 'Cancelar',
                style: 'cancel',
              }, {
                text: 'Ok',
                onPress: () => { },
              }]);
          }}
        />
      );
    }
    return (
      <View style={styles.cellStyle}>
        <TouchableOpacity onPress={() => (
          Alert.alert('Deseja excluir',
            `Reserva de ${name}, hora: ${time.split(':')[0]}h, sala: ${roomById(room)}?`,
            [{
              text: 'Cancelar',
              style: 'cancel',
            }, {
              text: 'Ok',
              onPress: () => { deleteEvent(index); },
            }]))}
        >
          <Text style={[styles.text, { color: colors.mainColor }]}>{name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Deseja alterar',
              `Pagamento do usuário: ${name}, hora: ${time.split(':')[0]}h, `
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
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderRadius: 4,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  head: {
    height: 40,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
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
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  headerCell: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.mainColor,
  },
  cols: {
    flexDirection: 'row',
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default VacancyModal;
