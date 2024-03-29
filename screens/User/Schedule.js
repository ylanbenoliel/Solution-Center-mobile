/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import {
  format,
  parseISO,
  eachWeekendOfInterval,
  formatISO,
  add,
  endOfWeek,
  isSunday,
} from 'date-fns';

import {
  GeneralStatusBar,
  ShowInfo,
  Loading,
  RoomButton,
} from '@components';
import EventModal from '@components/EventModal';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';
import LOCALE from '@constants/localeCalendarStrip';

const INITIALDATE = isSunday(new Date()) === true
  ? add(new Date(), { days: 1 })
  : new Date();

const INITIALDATERANGE = [
  {
    start: formatISO(INITIALDATE),
    end: formatISO(endOfWeek(INITIALDATE), 1),
  },
];

export default function Schedule({ navigation }) {
  const calendarRef = useRef();

  const [datesBlacklist, setDatesBlacklist] = useState([
    formatISO(add(INITIALDATE, { days: 8 })),
  ]);

  const [datesWhitelist, setDatesWhitelist] = useState(INITIALDATERANGE);
  const [scheduleList, setScheduleList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    Alert.alert('Aviso!',
      'Mudanças podem ocorrer em seu agendamento, mediante aviso prévio da gerência.');
    return () => {};
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    fetchDates();
  }, []);

  async function fetchDates() {
    try {
      const response = await api.get('/dates');
      const { maxDate, minDate } = response.data;
      const rangeData = [{
        start: parseISO(minDate),
        end: parseISO(maxDate),
      }];
      setDatesWhitelist(rangeData);
      setDatesBlacklist(
        disableSundays(minDate, maxDate),
      );
    } catch (e) {
      if (String(e.response.status).includes('5')) {
        const errMessage = 'Erro, tente novamente em alguns minutos.';
        setError(errMessage);
        return;
      }
      if (e.response.data) {
        setError(`${e.response?.data?.message}`);
        return;
      }
      if (e.request) {
        setError('Erro de conexão de internet.');
        return;
      }
      setError('Algo deu errado.');
    }
  }

  function disableSundays(startDate, endDate) {
    const weekends = eachWeekendOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });

    const allSundays = weekends.filter((dt) => isSunday(dt));
    return allSundays;
  }

  function reloadDates() {
    fetchDates();
  }

  function getEventsByDate(room) {
    setLoading(true);

    const selectedRoom = ROOM_DATA
      .filter((item) => item.room === room)
      .map((item) => item.name);

    setRoomName(selectedRoom);

    const calendarRaw = calendarRef.current.getSelectedDate();
    const calendarDateFormatted = format(new Date(calendarRaw), 'yyyy-MM-dd');

    api
      .post('/events/list', {
        date: calendarDateFormatted,
        room,
      })
      .then((response) => {
        const { validEvents, active } = response.data;
        if (active === 0) {
          return setError('Usuário pendente de liberação.');
        }

        setScheduleList(validEvents);
        setDate(calendarDateFormatted);
        setIsEventModalOpen(true);
      })
      .catch((e) => {
        if (String(e.response.status).includes('5')) {
          const errMessage = 'Erro, tente novamente em alguns minutos.';
          setError(errMessage);
          return;
        }
        if (e.response.data) {
          setError(`${e.response?.data?.message}`);
          return;
        }
        if (e.request) {
          setError('Erro na conexão.');
          return;
        }
        setError('Algo deu errado.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const RenderLoading = () => {
    if (loading) {
      return (
        <View style={styles.conditionalLoading}>
          <Loading loading={loading} />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather
            name="menu"
            size={scale(32)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reloadDates()}>
          <Feather
            name="refresh-cw"
            size={scale(28)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <View
          style={{ flex: 2, width: '100%', alignItems: 'center' }}
        >

          <View style={styles.calendarStrip}>
            <CalendarStrip
              ref={calendarRef}
              scrollable
              startingDate={INITIALDATE}
              selectedDate={INITIALDATE}
              locale={LOCALE}
              calendarAnimation={{ type: 'sequence', duration: 50 }}
              daySelectionAnimation={{
                type: 'border',
                duration: 100,
                borderWidth: 3,
                borderHighlightColor: colors.accentColor,
              }}
              style={styles.calendarStyle}
              calendarHeaderStyle={styles.text}
              dateNumberStyle={styles.dateStyle}
              dateNameStyle={styles.dateStyle}
              highlightDateNumberStyle={styles.highlightDateStyle}
              highlightDateNameStyle={styles.highlightDateStyle}
              disabledDateNameStyle={styles.disabledDateStyle}
              disabledDateNumberStyle={styles.disabledDateStyle}
              datesBlacklist={datesBlacklist}
              datesWhitelist={datesWhitelist}
            />
          </View>
        </View>

        {error && (
        <View style={{ alignItems: 'center' }}>
          <ShowInfo error={error} />
        </View>
        )}

        <View style={styles.roomsContainer}>
          <Text style={[styles.text, styles.selectRoomText]}>
            Selecione a sala
          </Text>

          <View style={styles.scrollViewContainer}>
            <ScrollView>
              <RoomButton
                photo={require('@assets/rooms/clarice-min.jpeg')}
                name={ROOM_DATA[0].name}
                onClick={() => getEventsByDate(ROOM_DATA[0].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/carlos-min.jpeg')}
                name={ROOM_DATA[1].name}
                onClick={() => getEventsByDate(ROOM_DATA[1].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/cecilia-min.jpeg')}
                name={ROOM_DATA[2].name}
                onClick={() => getEventsByDate(ROOM_DATA[2].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/rui-min.jpeg')}
                name={ROOM_DATA[3].name}
                onClick={() => getEventsByDate(ROOM_DATA[3].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/machado-min.jpeg')}
                name={ROOM_DATA[4].name}
                onClick={() => getEventsByDate(ROOM_DATA[4].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/monteiro-min.jpeg')}
                name={ROOM_DATA[5].name}
                onClick={() => getEventsByDate(ROOM_DATA[5].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/luis-min.jpeg')}
                name={ROOM_DATA[6].name}
                onClick={() => getEventsByDate(ROOM_DATA[6].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/cora-min.jpeg')}
                name={ROOM_DATA[7].name}
                onClick={() => getEventsByDate(ROOM_DATA[7].room)}
              />
              <RoomButton
                photo={require('@assets/rooms/carolina-min.jpeg')}
                name={ROOM_DATA[8].name}
                onClick={() => getEventsByDate(ROOM_DATA[8].room)}
              />
            </ScrollView>
          </View>

        </View>

        <EventModal
          dateHeader={date}
          eventList={scheduleList}
          roomName={roomName}
          isVisible={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
        />

      </View>
      <RenderLoading />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteColor,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(20),
  },

  calendarContainer: {
    flex: 9,
  },
  calendarStrip: {
    width: '90%',
  },
  roomsContainer: {
    flex: 8,
    alignItems: 'center',
    marginBottom: scale(14),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
  },

  calendarStyle: {
    height: verticalScale(100),
    margin: '3%',
  },
  dateStyle: {
    color: colors.mainColor,
    fontFamily: 'Amaranth-Regular',
  },
  highlightDateStyle: {
    color: colors.accentColor,
  },
  disabledDateStyle: {
    color: colors.disableColor,
  },
  selectRoomText: {
    color: colors.mainColor,
    fontSize: 24,
    marginTop: 5,
  },
  conditionalLoading: {
    zIndex: 10,
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scrollViewContainer: {
    flex: 1,
    width: '95%',
    justifyContent: 'center',
    paddingBottom: verticalScale(50),
  },
});
