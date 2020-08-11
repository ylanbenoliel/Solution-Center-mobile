/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
import React, {
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { scale, verticalScale } from 'react-native-size-matters';

import { format } from 'date-fns';

import { GeneralStatusBar, VacancyModal, ShowInfo } from '@components';

import { removeDuplicates, chunkArray } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_IDS } from '@constants/fixedValues';
// eslint-disable-next-line no-unused-vars
import LocaleConfig from '@constants/localeWixCalendar';

export default function Agenda() {
  const [daySelected, setDaySelected] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hours, setHours] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    setDaySelected(currentDate);
    return () => {
      setHours(null);
      setUsers(null);
    };
  }, []);

  function handleDayPress(day) {
    setDaySelected(day);
  }

  function handleOpenModal() {
    setLoading(true);
    api.post('/events/list', {
      date: daySelected,
    }).then((response) => {
      const { hoursInterval, validEvents } = response.data;
      if (validEvents.length === 0) {
        const nonUsers = new Array(hoursInterval.length * 10).fill('');
        const chunkNonUsers = chunkArray(nonUsers, 10);
        setUsers(chunkNonUsers);
      } else {
        const rawList = hoursInterval.flatMap((hour) => ROOM_IDS.flatMap((place) => {
          const list = { hour, place };
          return list;
        }));

        const usersList = validEvents.flatMap((evt) => rawList.flatMap((container, index) => {
          if (evt.time.includes(container.hour) && container.place == evt.room) {
            const fullName = evt.name.split(' ');
            const name = `${fullName[0]} ${fullName[fullName.length - 1].split('')[0]}`;
            const user = {
              index,
              hour: container.hour,
              place: container.place,
              name,
            };
            return user;
          }
          const withoutUser = {
            index,
            hour: container.hour,
            place: container.place,
            name: '',
          };
          return withoutUser;
        }));

        const sortedList = usersList
          .sort((a, b) => {
            if (a.name === '') {
              return 1;
            } if (b.name === '') {
              return -1;
            }
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });

        const withoutDuplicates = removeDuplicates(sortedList, 'index');
        const totalUsers = withoutDuplicates
          .sort((a, b) => a.index - b.index)
          .map((el) => el.name);
        const chunkUsers = chunkArray(totalUsers, 10);
        setUsers(chunkUsers);
      }
      setLoading(false);
      setHours(hoursInterval);
      setIsModalOpen(true);
    }).catch(() => {
      setLoading(false);
      setError('Erro ao buscar registros');
    });
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const RenderFetchLoading = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.whiteColor} />;
    }
    return <Text style={[styles.text, styles.modalButtonText]}>Agenda</Text>;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={styles.calendarContainer}>
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
          style={{
            borderWidth: 2,
            borderColor: '#ccc',
            height: 350,
          }}
          theme={{
            calendarBackground: 'transparent',
            selectedDayTextColor: colors.mainColor,
            todayTextColor: colors.accentColor,
            dayTextColor: colors.mainColor,
            textDisabledColor: colors.disableColor,
            arrowColor: colors.navigationColor,
            disabledArrowColor: colors.disableColor,
            monthTextColor: colors.mainColor,
            textDayFontFamily: 'Amaranth-Regular',
            textDayFontSize: 16,
            textMonthFontFamily: 'Amaranth-Regular',
            textMonthFontSize: 16,
            textDayHeaderFontFamily: 'Amaranth-Regular',
            textDayHeaderFontSize: 16,
          }}
        />
      </View>

      <View style={{ flex: 1 }}>

        <ShowInfo error={error} />

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleOpenModal()}
          >
            <RenderFetchLoading />
          </TouchableOpacity>
        </View>

      </View>

      <VacancyModal
        isVisible={isModalOpen}
        onClose={() => handleCloseModal()}
        showDate={daySelected}
        users={users}
        hours={hours}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 2,
    justifyContent: 'center',
    marginTop: verticalScale(40),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    color: colors.whiteColor,
    fontSize: scale(18),
  },
  modalButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: verticalScale(48),
    borderRadius: scale(4),
    backgroundColor: colors.navigationColor,
  },
  modalButtonText: { fontSize: scale(32), color: colors.whiteColor },
});
