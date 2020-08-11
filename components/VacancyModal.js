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
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';

import { Feather } from '@expo/vector-icons';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const roomsName = ROOM_DATA.map((room) => {
  if (room.name.includes('Sala')) {
    return room.name;
  }
  return room.name.split(' ')[0];
});

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

const VacancyModal = ({
  hours, users, isVisible, showDate, onClose,
}) => {
  const tableTitle = hours;
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

          <Text
            style={[styles.text, { color: colors.disableColor, fontSize: 26 }]}
          >
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
        <ScrollView
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
                    // heightArr={Array(14).fill(66)}
                    textStyle={styles.text}
                  />
                  <Rows
                    data={tableData}
                    widthArr={Array(9).fill(52)}
                    style={styles.rows}
                    textStyle={[styles.text, { color: colors.mainColor }]}
                  />
                </TableWrapper>
              </Table>
            </ScrollView>
          </Table>
        </ScrollView>
        {/*  */}
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
});

export default VacancyModal;
