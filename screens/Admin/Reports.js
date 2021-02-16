/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';

import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import { GeneralStatusBar } from '@components';

// import { api } from '@services/api';

import colors from '@constants/colors';

const HOUR_FILTER = 1;
const ROOM_FILTER = 2;
const JOB_FILTER = 3;

const CURRENT_DATE = format(new Date(), 'yyyy-MM-dd');

const DateRangeModal = ({ onClose, visible, dateString }) => {
  const [daySelected, setDaySelected] = useState(dateString || CURRENT_DATE);

  function handleDayPress(dateStr) {
    setDaySelected(dateStr);
  }
  return (
    <Modal
      isVisible={visible}
      style={styles.modalContainer}
    >
      <View style={styles.modalHeader}>
        <View style={{ height: 32, width: 38 }} />
        <Text style={[styles.text, { fontSize: 24 }]}>Período</Text>
        <TouchableOpacity
          style={{ marginRight: 4 }}
          onPress={() => { onClose(); }}
        >
          <Feather
            name="x"
            size={38}
            color={colors.navigationColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.modalContent}>
        <Calendar
          markingType="custom"
          monthFormat="MMMM yyyy"
          LocaleConfig
          current={daySelected}
          onDayPress={(date) => handleDayPress(date.dateString)}
          hideExtraDays
          markedDates={{
            [daySelected]: {
              disabled: false,
              disableTouchEvent: false,
              customStyles: {
                container: {
                  backgroundColor: colors.accentColor,
                },
                text: {
                  color: colors.whiteColor,
                  fontWeight: 'bold',
                },
              },
            },
          }}

        />
        <TouchableOpacity onPress={() => { onClose(daySelected); }}>
          <View style={styles.actionButton}>
            <Text style={[styles.text, styles.selectedText]}>Selecionar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const Reports = () => {
  const [filter, setFilter] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState({ start: CURRENT_DATE, end: CURRENT_DATE });

  const SelectedButton = ({ label, option }) => {
    const buttonStyle = option === filter
      ? [styles.button, styles.selectedButton]
      : [styles.button];
    const buttonText = option === filter
      ? [styles.text, styles.selectedText]
      : [styles.text];
    return (
      <TouchableOpacity onPress={() => { setFilter(option); }}>
        <View style={buttonStyle}>
          <Text style={buttonText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <View style={styles.resultContainer} />

      <View style={styles.optionController}>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => { setModalVisible(true); }}>
            <View style={styles.dateButton}>
              <Text style={[styles.text, styles.selectedText]}>Período</Text>
            </View>
          </TouchableOpacity>
          <SelectedButton label="Hora:" option={HOUR_FILTER} />
          <SelectedButton label="Sala:" option={ROOM_FILTER} />
          <SelectedButton label="Profissão:" option={JOB_FILTER} />
        </View>
        <View>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.actionButton}>
              <Text style={[styles.text, styles.selectedText]}>Buscar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <DateRangeModal
        onClose={(dayModal) => {
          setModalVisible(false);
          console.log(!!dayModal);
        }}
        visible={modalVisible}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    marginHorizontal: 16,
  },
  resultContainer: {
    flex: 3,
    backgroundColor: 'green',
  },
  optionController: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: 16,
    color: colors.mainColor,
  },
  selectedText: {
    color: colors.whiteColor,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    maxHeight: 50,
    maxWidth: 100,
    backgroundColor: colors.whiteColor,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.mainColor,
  },
  selectedButton: {
    backgroundColor: colors.accentColor,
    borderColor: colors.whiteColor,
  },
  filterContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  dateButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.navigationColor,
    padding: 10,
    maxHeight: 50,
    maxWidth: 100,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.navigationColor,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 50,
    borderRadius: 4,
    backgroundColor: colors.mainColor,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContent: {
    flex: 9,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Reports;
