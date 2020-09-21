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
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import {
  format,
  parseISO,
  eachWeekendOfInterval,
  isSunday,
  formatISO,
  add,
  isAfter,
} from 'date-fns';

import {
  GeneralStatusBar,
  ShowInfo,
  Loading,
  RoomButton,
} from '@components';
import EventModal from '@components/EventModal';

import { removeDuplicates } from '@helpers/functions';

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
    end: formatISO(add(new Date(), { days: 6 })),
  },
];

export default function Schedule({ navigation }) {
  const calendarRef = useRef();

  const [datesBlacklist, setDatesBlacklist] = useState([
    formatISO(add(new Date(), { days: 8 })),
  ]);

  const [datesWhitelist, setDatesWhitelist] = useState(INITIALDATERANGE);
  const [scheduleList, setScheduleList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 2200);
    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess('');
    }, 2200);
    return () => {
      clearTimeout(timer);
    };
  }, [success]);

  useEffect(() => {
    api
      .get('/dates')
      .then((response) => {
        const { maxDate, minDate } = response.data;
        const rangeData = [
          {
            start: parseISO(minDate),
            end: parseISO(maxDate),
          },
        ];
        setDatesWhitelist(rangeData);
        setDatesBlacklist(
          disableWeekends(minDate, maxDate),
        );
      })
      .catch(() => {
        setError('Erro ao buscar dias disponíveis.');
      });
  }, []);

  function disableWeekends(startDate, endDate) {
    const weekends = eachWeekendOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });
    return weekends;
  }

  function transformEventToSchedule(hrs, evts, room, date) {
    if (evts.length === 0) {
      evts.push({
        event: '',
        user: '',
        room: '',
        date: '',
        time: '',
        code: '',
      });
    }

    const currDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      Number(new Date().getHours()),
      new Date().getMinutes(),
    );

    const dateArray = date.split('-');

    const eventRawList = hrs.flatMap((hour) => evts
      .flatMap((event) => {
        if (event.time.includes(hour) && event.user) {
          return {
            ...event,
          };
        }

        const noEvent = {
          event: `${Math.random()}`,
          user: '',
          room: `${room}`,
          date: `${date}`,
          time: `${hour}:00:00`,
        };

        const eventDate = new Date(
          Number(dateArray[0]),
          Number(dateArray[1]) - 1,
          Number(dateArray[2]),
          Number(hour),
        );

        if ((eventDate.toDateString() === currDate.toDateString())) {
          if (eventDate.getHours() > currDate.getHours()) {
            return {
              ...noEvent,
              code: '1',
            };
          }
          return {
            ...noEvent,
            code: '4',
          };
        }
        if (isAfter(eventDate, currDate)) {
          return {
            ...noEvent,
            code: '1',
          };
        }
        return {
          ...noEvent,
          code: '4',
        };
      })
      .sort((prev, next) => next.event - prev.event));
    const eventList = removeDuplicates(eventRawList, 'time');
    setScheduleList(eventList);
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
        const { hoursInterval, validEvents, active } = response.data;
        if (active === 0) {
          return setError('Usuário pendente de liberação.');
        }
        transformEventToSchedule(
          hoursInterval,
          validEvents,
          room,
          calendarDateFormatted,
        );
        setDate(calendarDateFormatted);
        setIsEventModalOpen(true);
      })
      .catch(() => {})
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
      <View style={{ flex: 1, justifyContent: 'center', marginLeft: 16 }}>

        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather
            name="menu"
            size={scale(32)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>

          <View style={styles.calendarStrip}>
            <CalendarStrip
              ref={calendarRef}
              selectedDate={INITIALDATE}
              startingDate={INITIALDATE}
              locale={LOCALE}
              calendarAnimation={{ type: 'sequence', duration: 300 }}
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

        <View style={{ alignItems: 'center' }}>
          <ShowInfo error={error} success={success} />
        </View>

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
    flex: 1,
    backgroundColor: '#eee',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  calendarContainer: {
    flex: 9,
  },
  calendarStrip: {
    width: '90%',
  },
  roomsContainer: {
    flex: 7,
    alignItems: 'center',
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
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(45),
  },
});
