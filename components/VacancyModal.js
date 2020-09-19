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
} from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { roomById, chunkArray } from '@helpers/functions';

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

function Row({ column, line }) {
  const even = line % 2 === 0 ? { colorBackground: 'white' } : { colorBackground: '#bbb' };
  return (
    <View key={line} style={[styles.rowStyle, even]}>
      {column.map((data, index) => (
        <Cell data={data} room={index + 1} />
      ))}
    </View>
  );
}

function Cell({ data, room }) {
  if (data.name.length === 0) {
    return (
      <TouchableOpacity
        key={data.index}
        style={styles.cellStyle}
        onPress={() => {
          Alert.alert('Deseja Adicionar',
            `Usuário na sala ${roomById(room)}, hora: ${data.time.split(':')[0]}h?`);
        }}
      />
    );
  }
  return (
    <View style={styles.cellStyle} key={data.index}>
      <TouchableOpacity onPress={() => (
        Alert.alert('Deseja excluir',
          `Reserva de ${data.name}, hora: ${data.time.split(':')[0]}h, sala: ${roomById(room)}`))}
      >
        <Text style={[styles.text, { color: colors.mainColor }]}>{data.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Alert.alert('Deseja alterar',
            `Pagamento do usuário: ${data.name}, hora: ${data.time.split(':')[0]}h, sala: ${roomById(room)}?`);
        }}
      >
        <Feather
          name="dollar-sign"
          size={scale(14)}
          color={Number(data.status_payment) === 1 ? colors.accentColor : colors.errorColor}
        />

      </TouchableOpacity>
    </View>
  );
}

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
    const chunkEvents = chunkArray(events, ROOM_IDS.length);
    setEventTable(chunkEvents);
  }, [isVisible === true]);

  return (
    <Modal isVisible={isVisible}>
      <View
        style={styles.container}
      >
        {/*  */}
        <View
          style={styles.modalHeader}
        >
          <View style={{ width: 32 }} />

          <Text style={[styles.text, { color: colors.disableColor, fontSize: 26 }]}>
            {date}
          </Text>

          <TouchableOpacity
            style={{ justifyContent: 'flex-end' }}
            onPress={() => {
              onClose();
            }}
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
                  <View style={[styles.cellStyle, styles.colDateStyle]}>
                    <Text style={[styles.text, { color: 'white' }]}>
                      {col}
                      h
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.gridContainer}>
                {eventTable.map((column, index) => (
                  <Row key={index} column={column} line={index} />
                ))}
              </View>
            </View>
          </ScrollView>
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
