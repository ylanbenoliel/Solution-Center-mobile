/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
// import {
//   Table,
//   TableWrapper,
//   Row,
//   Rows,
//   Col,
// } from 'react-native-table-component';

import { Feather } from '@expo/vector-icons';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const roomsName = ROOM_DATA.map((room) => room.name.split(' ')[0]);

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
    <View style={[styles.rowStyle, even]}>
      {column.map((data, index) => (
        <Cell key={index} data={data} room={index + 1} />
      ))}
    </View>
  );
}

function Cell({ data, room }) {
  if (data.name === '') {
    return (
      <TouchableOpacity
        key={data.index}
        style={styles.cellStyle}
        onPress={() => {
          console.log(`Deseja adicionar um usuário na sala ${room}?`);
        }}
      />
    );
  }
  return (
    <View style={styles.cellStyle} key={data.index}>
      <Text style={[styles.text, { color: colors.mainColor }]}>{data.name}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log(
            `Alterar pagamento do usuário: ${data.name}, Sala: ${room}?`,
          );
        }}
      >
        <Text style={[styles.text, { color: colors.mainColor }]}>
          {' '}
          {data.status_payment === 1 ? 'Pago' : 'Não'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const user = {
  index: '',
  id: Math.random(),
  hour: '',
  place: '',
  name: 'Ylan',
  status_payment: 1,
};

const withoutUser = {
  index: '',
  hour: '',
  place: '',
};

const data = [
  [
    {
      index: '',
      id: Math.random(),
      hour: '',
      place: '',
      name: 'Nissim',
      status_payment: 0,
    },
    user,
    withoutUser,
    user,
    user,
    user,
    user,
    user,
    user,
  ],
  [user, user, user, user, user, user, user, user, user],
  [user, user, user, user, user, user, user, user, user],
  [user, user, user, user, user, user, user, user, user],
  [user, user, user, user, user, user, user, user, user],
  [user, user, user, user, user, user, user, user, user],
];

const VacancyModal = ({
  hours, users, isVisible, showDate, onClose,
}) => {
  const tableHours = hours;
  const tableData = users;
  const [date, setDate] = useState('');

  useEffect(() => {
    const formattedDate = showDate.split('-').reverse().join('.');
    setDate(formattedDate);
    return () => {
      setDate('');
    };
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
        {/*  */}
        {/* <ScrollView
          style={{ margin: '3%' }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <Table>
            <Row
              data={tableHead}
              widthArr={[35, 52, 52, 52, 52, 52, 52, 52, 52, 52]}
              style={styles.head}
              textStyle={styles.text}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              <Table
                borderStyle={styles.tableBorder}
              >
                <TableWrapper style={styles.wrapper}>
                  <Col
                    data={tableTitle}
                    style={styles.title}
                    flexArr={Array(13).fill(1)}
                    textStyle={styles.text}
                  />

                  <Rows
                    data={tableData}
                    widthArr={Array(9).fill(52)}
                    style={[styles.rows]}
                    textStyle={[styles.text, { color: colors.mainColor }]}
                  />
                </TableWrapper>
              </Table>
            </ScrollView>
          </Table>
        </ScrollView> */}
        {/*  */}

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
                {data.map((column, index) => (
                  <Row column={column} key={index} line={index} />
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
