/* eslint-disable react/prop-types */
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
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { scale, verticalScale } from 'react-native-size-matters';

import { format } from 'date-fns';

import { GeneralStatusBar, ShowInfo, Loading } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';
// eslint-disable-next-line no-unused-vars
import LocaleConfig from '@constants/localeWixCalendar';

export default function Agenda({ navigation }) {
  const [daySelected, setDaySelected] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    setDaySelected(currentDate);
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

  function handleAgendaRequest() {
    setLoading(true);
    api.post('/admin/events/agenda', {
      date: daySelected,
    }).then((response) => {
      const { hoursInterval, events: rawEvents } = response.data;
      setLoading(false);
      navigation.navigate('AgendaTable',
        { events: rawEvents, hours: hoursInterval, showDate: daySelected });
    }).catch(() => {
      setLoading(false);
      setError('Erro ao buscar registros.');
    });
  }

  async function closeDay(dayToClose) {
    try {
      setLoading(true);
      const { data } = await api.post('/admin/events/close-day', {
        date: dayToClose,
      });
      Alert.alert('Sucesso.', `${data.message}`, [{
        text: 'Ok',
        onPress: () => { },
      }]);
    } catch (e) {
      if (e.response) {
        Alert.alert('Aviso!', `${e.response?.data?.message}`, [{
          text: 'Ok',
          onPress: () => { },
        }]);
        return;
      }
      Alert.alert('Erro de conexão.', '', [{
        text: 'Ok',
        onPress: () => { },
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(dateFormatted) {
    const date = dateFormatted.split('-').reverse().join('/');
    return (
      Alert.alert('Aviso!', `Deseja fechar o dia ${date}?`, [{
        text:
        'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => { closeDay(dateFormatted); },
      }])
    );
  }

  const RenderLoading = () => (
    loading && (
    <View style={styles.conditionalLoading}>
      <Loading loading={loading} />
    </View>
    )
  );

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={{ flex: 1, alignItems: 'flex-end', marginRight: scale(16) }}>

        <TouchableOpacity onPress={() => { handleOpenModal(daySelected); }}>
          <View style={styles.closeDayButton}>
            <Text style={styles.text}>Fechar dia</Text>
          </View>
        </TouchableOpacity>
      </View>

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

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ShowInfo error={error} />
      </View>

      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => handleAgendaRequest()}
        >
          <Text style={[styles.text, styles.modalButtonText]}>Agenda</Text>
        </TouchableOpacity>
      </View>

      <RenderLoading />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  closeDayButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(5),
    backgroundColor: colors.accentColor,
    borderRadius: 4,
  },
  calendarContainer: {
    flex: 4,
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
    paddingVertical: verticalScale(10),
    borderRadius: scale(4),
    backgroundColor: colors.navigationColor,
  },
  modalButtonText: {
    fontSize: scale(32),
    color: colors.whiteColor,
  },
  conditionalLoading: {
    zIndex: 10,
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
