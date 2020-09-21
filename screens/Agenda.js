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

import { api } from '@services/api';

import colors from '@constants/colors';
// eslint-disable-next-line no-unused-vars
import LocaleConfig from '@constants/localeWixCalendar';

export default function Agenda() {
  const [daySelected, setDaySelected] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hours, setHours] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    setDaySelected(currentDate);
    return () => {
      setHours(null);
      setEvents(null);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 2200);
    return () => clearTimeout(timer);
  }, [error]);

  function handleDayPress(day) {
    setDaySelected(day);
  }

  function handleOpenModal() {
    setLoading(true);
    api.post('/admin/events/agenda', {
      date: daySelected,
    }).then((response) => {
      const { hoursInterval, events: rawEvents } = response.data;

      // const chunkEvents = chunkArray(rawEvents, ROOM_IDS.length);
      setEvents(rawEvents);
      setLoading(false);
      setHours(hoursInterval);
      setIsModalOpen(true);
    }).catch((e) => {
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

      { isModalOpen && (
      <VacancyModal
        isVisible={isModalOpen}
        onClose={() => handleCloseModal()}
        showDate={daySelected}
        events={events}
        hours={hours}
      />
      )}

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
