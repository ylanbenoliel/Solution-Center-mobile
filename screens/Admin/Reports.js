/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';

import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import { GeneralStatusBar } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const HOUR_FILTER = 1;
const ROOM_FILTER = 2;
const JOB_FILTER = 3;

const CURRENT_DATE = format(new Date(), 'yyyy-MM-dd');

const DateRangeModal = ({ onClose, visible }) => {
  const [daySelected, setDaySelected] = useState(CURRENT_DATE);

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
        <Text style={[styles.text, { fontSize: 24 }]}>Dia</Text>
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

const SelectedButton = ({
  label, option, current, onClick,
}) => {
  const buttonStyle = option === current
    ? [styles.button, styles.selectedButton]
    : [styles.button];
  const buttonText = option === current
    ? [styles.text, styles.selectedText]
    : [styles.text];
  return (
    <TouchableOpacity onPress={() => { onClick(option); }}>
      <View style={buttonStyle}>
        <Text style={buttonText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Reports = () => {
  const [filter, setFilter] = useState(HOUR_FILTER);

  const [modalStartVisible, setModalStartVisible] = useState(false);
  const [changeStartDateRange, setChangeStartDateRange] = useState(true);

  const [dateRange, setDateRange] = useState({ start: CURRENT_DATE, end: CURRENT_DATE });

  const [roomCount, setRoomCount] = useState([]);
  const [hourCount, setHourCount] = useState([]);
  const [jobCount, setJobCount] = useState([]);

  const [roomTotal, setRoomTotal] = useState(0);

  function handleChangeFilter(selectedFilter) {
    setFilter(selectedFilter);
  }

  function checkIfDateRangeIsValid() {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const isValid = start <= end;
    return isValid;
  }

  async function handleSearchReports(filterOption) {
    const validDateRange = checkIfDateRangeIsValid();
    if (!validDateRange) {
      Alert.alert('Intervalo de tempo inválido.');
      return;
    }
    if (filterOption === HOUR_FILTER) {
      try {
        const { data } = await api.post('/business/hours',
          { start: dateRange.start, end: dateRange.end });
        const result = Object.entries(data.hours);
        const hourWithCount = result.map((info) => {
          const dataSplit = info[0].split(':');
          const hourFormatted = `${dataSplit[0]}`;
          const countString = String(info[1]).padStart(2, 0);
          return {
            hour: hourFormatted,
            count: countString,
          };
        });
        setHourCount(hourWithCount);
        setRoomTotal(data.total);
      } catch {
        Alert.alert('Erro ao pegar informações sobre os horários.');
      }
      return;
    }
    if (filterOption === ROOM_FILTER) {
      try {
        const { data } = await api.post('/business/rooms',
          { start: dateRange.start, end: dateRange.end });
        const result = Object.entries(data.rooms);
        const roomWithName = ROOM_DATA.map((info) => {
          const matchResponse = result.find((room) => Number(room[0]) === info.room);
          return {
            room: info.room,
            name: info.name,
            count: matchResponse[1],
          };
        });
        setRoomCount(roomWithName);
        setRoomTotal(data.total);
      } catch {
        Alert.alert('Erro ao pegar informações sobre as salas.');
      }
      return;
    }
    if (filterOption === JOB_FILTER) {
      try {
        const { data } = await api.post('/business/jobs',
          { start: dateRange.start, end: dateRange.end });
        setJobCount(data.jobs);
        setRoomTotal(data.total);
      } catch {
        Alert.alert('Erro ao pegar informações sobre as profissões.');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <View style={styles.resultContainer}>
        {filter === HOUR_FILTER && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {hourCount.map((data) => (
              <View
                key={data.hour}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={[styles.text, { fontSize: 22 }]}>
                  {`${data.hour}h: ${data.count}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {filter === ROOM_FILTER && (
          <>
            {roomCount.map((data) => (
              <View key={data.room}>
                <Text style={[styles.text, { fontSize: 22 }]}>
                  {`${data.name}: ${data.count}`}
                </Text>
              </View>
            ))}
          </>
        )}

        {filter === JOB_FILTER && (
          <ScrollView>
            {jobCount.map((data) => (
              <View key={data.title}>
                <Text style={[styles.text, { fontSize: 22 }]}>
                  {`${data.title}: ${data.count}`}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={[styles.text, { fontSize: 22 }]}>
          {`Total: ${roomTotal}`}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Text style={styles.text}>{dateRange.start.split('-').reverse().join('/')}</Text>
        <Text style={styles.text}>{dateRange.end.split('-').reverse().join('/')}</Text>
      </View>

      <View style={styles.optionController}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => {
            setChangeStartDateRange(true);
            setModalStartVisible(true);
          }}
          >
            <View style={styles.dateButton}>
              <Text style={[styles.text, styles.selectedText]}>Data inicial</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setChangeStartDateRange(false);
            setModalStartVisible(true);
          }}
          >
            <View style={styles.dateButton}>
              <Text style={[styles.text, styles.selectedText]}>Data final</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <SelectedButton label="Hora:" option={HOUR_FILTER} current={filter} onClick={(opt) => handleChangeFilter(opt)} />
          <SelectedButton label="Sala:" option={ROOM_FILTER} current={filter} onClick={(opt) => handleChangeFilter(opt)} />
          <SelectedButton label="Profissão:" option={JOB_FILTER} current={filter} onClick={(opt) => handleChangeFilter(opt)} />
        </View>
        <View>
          <TouchableOpacity onPress={() => { handleSearchReports(filter); }}>
            <View style={styles.actionButton}>
              <Text style={[styles.text, styles.selectedText]}>Buscar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <DateRangeModal
        onClose={(dayModal) => {
          setModalStartVisible(false);
          if (dayModal) {
            if (changeStartDateRange) {
              setDateRange((prevState) => ({
                ...prevState,
                start: dayModal,
              }));
              return;
            }
            setDateRange((prevState) => ({
              ...prevState,
              end: dayModal,
            }));
          }
        }}
        visible={modalStartVisible}
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
    // backgroundColor: 'green',
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
  dateContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  dateButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.navigationColor,
    padding: 10,
    maxHeight: 50,
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
