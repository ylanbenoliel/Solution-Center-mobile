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
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { scale, verticalScale } from 'react-native-size-matters';

import {
  format,
  parseISO,
  eachWeekendOfInterval,
  isSunday,
  isSaturday,
  formatISO,
  add,
  isAfter,
} from 'date-fns';
import BottomSheet from 'reanimated-bottom-sheet';

import {
  GeneralStatusBar,
  ShowInfo,
  Separator,
  StatusButton,
  Loading,
  RoomButton,
} from '@components';

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

export default function Schedule() {
  const bottomSheetRef = useRef();
  const calendarRef = useRef();

  const [isFirstRun, setIsFirstRun] = useState(true);
  const [datesBlacklist, setDatesBlacklist] = useState([
    formatISO(add(new Date(), { days: 8 })),
  ]);
  const [datesWhitelist, setDatesWhitelist] = useState(INITIALDATERANGE);
  const [scheduleList, setScheduleList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [calendarDate, setCalendarDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFirstRun) {
      return setIsFirstRun(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirstRun) {
      const timer = setTimeout(() => {
        setError('');
        bottomSheetRef.current.snapTo(0);
      }, 2200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error]);

  useEffect(() => {
    if (!isFirstRun) {
      const timer = setTimeout(() => {
        setSuccess('');
        bottomSheetRef.current.snapTo(0);
      }, 2200);
      return () => {
        clearTimeout(timer);
      };
    }
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
          disableSundays(minDate, maxDate),
        );
      })
      .catch(() => {
        setError('Erro ao buscar dias disponíveis.');
      });
  }, []);

  function disableSundays(startDate, endDate) {
    const weekends = eachWeekendOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });
    const sundays = weekends.filter((day) => isSunday(day));
    return sundays;
  }

  function reserveRoom(room, date, time) {
    api.post('/events/new', {
      room,
      date,
      time,
    })
      .then((res) => {
        const emptyEvent = scheduleList.find((evt) => evt.time.includes(time));

        const userEvent = {
          event: res.data.event.id,
          code: '2',
          ...res.data.event,
        };

        const totalList = scheduleList
          .map((event) => {
            if (event.time === emptyEvent.time) {
              return userEvent;
            }

            return event;
          })
          .sort((prev, next) => prev.time.localeCompare(next.time));

        setScheduleList(totalList);
        setSuccess('Horário salvo.');
      })
      .catch(() => {
        setError('Erro ao salvar horário.');
      });
  }

  function dismissRoom(eventId) {
    api.delete(`/events/${eventId}`)
      .then(() => {
        // eslint-disable-next-line eqeqeq
        const deletedEvent = scheduleList.find((evt) => evt.event == eventId);

        const emptyEvent = {
          event: `${Math.random()}`,
          user: '',
          room: `${deletedEvent.room}`,
          date: `${deletedEvent.date.split('T')[0]}`,
          time: `${deletedEvent.time}`,
          code: '1',
        };
        const totalList = scheduleList
          // eslint-disable-next-line eqeqeq
          .filter((evt) => evt.event != eventId)
          .concat(emptyEvent)
          .sort((prev, next) => prev.time.localeCompare(next.time));
        setScheduleList(totalList);
        setSuccess('Horário excluído.');
      })
      .catch(() => {
        setError('Erro ao excluir horário.');
      });
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
    setScheduleList([]);
    setCalendarDate('');

    const calendarRaw = calendarRef.current.getSelectedDate();
    const calendarDateFormatted = format(new Date(calendarRaw), 'yyyy-MM-dd');

    api
      .post('/events/list', {
        date: calendarDateFormatted,
        room,
      })
      .then((response) => {
        const { hoursInterval, validEvents } = response.data;
        transformEventToSchedule(hoursInterval, validEvents, room, calendarDateFormatted);
        setCalendarDate(calendarDateFormatted);
        setLoading(false);
        bottomSheetRef.current.snapTo(0);
      })
      .catch(() => {
        setLoading(false);
        setError('Erro na busca.');
        bottomSheetRef.current.snapTo(2);
      });
  }

  const ScheduleItem = ({
    event, date, room, time, code,
  }) => (
    <View
      key={event}
      style={{
        width: '100%',
        height: verticalScale(70),
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/*  */}
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            marginHorizontal: scale(10),
            color: colors.mainColor,
            fontSize: scale(22),
          }}
        >
          {time.split(':')[0]}
          h
        </Text>
      </View>

      <Separator vertical />

      <View
        style={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StatusButton
          code={code}
          onCheckIn={() => reserveRoom(room, date, time)}
          onDismiss={() => dismissRoom(event)}
        />
      </View>
    </View>
  );

  const ScheduleItemMemoized = React.memo(ScheduleItem);

  // Start of BottomSheet

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderInner = () => {
    function setPanelHeight() {
      const dateParsed = parseISO(calendarDate);
      return isSaturday(dateParsed)
        ? styles.panelSaturday : styles.panel;
    }
    return (
      <View style={setPanelHeight()}>
        <FlatList
          contentContainerStyle={{ paddingBottom: verticalScale(10) }}
          data={scheduleList}
          extraData={scheduleList}
          keyExtractor={(item) => `${item.event}`}
          renderItem={({ item }) => <ScheduleItemMemoized {...item} />}
        />
      </View>
    );
  };

  const BSheet = () => (
    <View
      style={{
        flex: 0.01,
        width: '100%',
        height: '100%',
      }}
    >
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['90%', '35%', '0%']}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={2}
      />
    </View>
  );
  // End of BottomSheet

  const renderLoading = () => {
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

      <View style={styles.calendarContainer}>
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

        <View style={{ alignItems: 'center' }}>
          <ShowInfo error={error} success={success} />
        </View>

        <View style={styles.roomsContainer}>
          <Text style={[styles.text, styles.selectRoomText]}>
            Selecione a sala
          </Text>
          <View style={styles.flatListContainer}>
            <FlatList
              data={ROOM_DATA}
              keyExtractor={(item) => item.room.toString()}
              renderItem={({ item: button }) => (
                <RoomButton
                  {...button}
                  onClick={() => getEventsByDate(button.room)}
                />
              )}
            />
          </View>
          {calendarRef === undefined ? null : <BSheet />}
        </View>
      </View>
      {renderLoading()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  calendarContainer: {
    flex: 1,
  },
  calendarStrip: {
    flex: 2,
    justifyContent: 'center',

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
  panel:
  // bottomsheet
  {
    height: verticalScale(72 * 14),
    padding: scale(10),
    backgroundColor: colors.whiteColor,
    paddingTop: verticalScale(20),
    marginBottom: verticalScale(42),
  },
  panelSaturday: {
    height: verticalScale(72 * 8),
    padding: scale(10),
    backgroundColor: colors.whiteColor,
    paddingTop: verticalScale(20),
  },
  header: {
    width: '100%',
    height: verticalScale(20),
    marginBottom: verticalScale(-5),
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: scale(16),
    borderTopRightRadius: scale(16),
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelHandle: {
    width: scale(40),
    height: verticalScale(8),
    borderRadius: scale(4),
    backgroundColor: colors.disableColor,
    marginBottom: verticalScale(10),
  },
  panelTitle: {
    fontSize: scale(24),
    width: scale(100),
    color: colors.disableColor,
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
  flatListContainer: {
    flex: 1,
    width: '95%',
    justifyContent: 'center',
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(25),
    marginBottom: verticalScale(20),
  },
});
