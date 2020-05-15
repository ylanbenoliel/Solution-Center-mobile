import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import BottomSheet from "reanimated-bottom-sheet";
import {
  GeneralStatusBar,
  ShowErrors,
  Separator,
  StatusButton
} from "../components";
import colors from "../constants/colors";
import { ROOM_DATA } from "../constants/fixedValues";
import { scale, verticalScale } from "react-native-size-matters";
import {
  format,
  parseISO,
  eachWeekendOfInterval,
  isSunday,
  isSaturday,
  formatISO,
  add,
} from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../services/api";

const INITIALDATERANGE = [
  {
    start: formatISO(new Date()),
    end: formatISO(add(new Date(), { days: 5 })),
  },
];

export default function Schedule() {
  const bottomSheetRef = useRef();
  const calendarRef = useRef();

  const [datesBlacklist, setDatesBlacklist] = useState([
    formatISO(add(new Date(), { days: 10 })),
  ]);
  const [datesWhitelist, setDatesWhitelist] = useState(INITIALDATERANGE);
  const [scheduleList, setScheduleList] = useState([]);
  const [error, setError] = useState("");
  const [hours, setHours] = useState([]);
  const [events, setEvents] = useState([]);
  const [calendarDate, setCalendarDate] = useState('')
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 2200);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    api
      .get("/dates")
      .then((response) => {
        let rangeData = [];
        const { maxDate, minDate } = response.data;
        if (!!minDate && !!maxDate) {
          rangeData = INITIALDATERANGE.map(() => {
            return {
              start: parseISO(minDate),
              end: parseISO(maxDate),
            };
          });
        }
        setDatesWhitelist(rangeData);
        setDatesBlacklist(
          disableSundays(datesWhitelist[0]["start"], datesWhitelist[0]["end"])
        );
      })
      .catch((e) => {
        // setError('Erro ao buscar horários');
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
      room: room,
      date: date,
      time: time
    })
      .then((response) => {
        const newList = scheduleList.map(evt => {
          if (response.data.event.time === evt.time) {
            const { id, date, room, time, user_id } = response.data.event
            return {
              code: '2',
              date: date,
              event: id,
              room: room,
              time: time,
              user: user_id
            }
          }
          return evt
        })
        setScheduleList(newList)
        bottomSheetRef.current.snapTo(0)
      })
      .catch((error) => {
        bottomSheetRef.current.snapTo(2)
        setError('Erro ao salvar horário.')
      })
  }

  function dismissRoom(eventID) {
    api.delete(`/events/${eventID}`)
      .then((response) => {
        const newList = scheduleList.map(evt => {
          if (evt.event == eventID) {
            return {
              ...evt,
              user: '',
              code: '1',
              event: `${Math.random()}`
            }
          }
          return evt
        })
        setScheduleList(newList)
        bottomSheetRef.current.snapTo(0)
      })
      .catch(() => {
        bottomSheetRef.current.snapTo(2)
        setError('Erro ao excluir horário')
      })
  }

  function removeDuplicates(array, key) {
    const cache = new Set()
    return array.filter(
      (object) => !cache.has(object[key]) && cache.add(object[key])
    )
  }

  function transformEventToSchedule(hrs, evts, room, date) {
    if (evts.length == 0) {
      evts.push({
        event: '',
        user: '',
        room: '',
        date: '',
        time: '',
        code: ''
      })
    }
    const eventRawList = hrs.flatMap((hour) => {
      return evts
        .flatMap((event) => {
          if (event.time.includes(hour) && event.user) {
            return {
              ...event,
            }
          }
          const emptyEvent = {
            event: `${Math.random()}`,
            user: '',
            room: `${room}`,
            date: `${date}`,
            time: `${hour}:00:00`,
            code: '1'

          }
          return emptyEvent
        })
        .sort((prev, next) => next.event - prev.event)
    })
    const eventList = removeDuplicates(eventRawList, 'time')
    setScheduleList(eventList)
  }

  function getEventsByDate(room) {
    setLoading(true);
    bottomSheetRef.current.snapTo(2);

    const calendarRaw = calendarRef.current.getSelectedDate();
    const calendarDateFormatted = format(new Date(calendarRaw), "yyyy-MM-dd");
    setCalendarDate(calendarDateFormatted)

    api
      .post("/events/list", {
        date: calendarDateFormatted,
        room: room,
      })
      .then((response) => {
        const { hoursInterval, validEvents } = response.data;
        transformEventToSchedule(hoursInterval, validEvents, room, calendarDate)
      })
      .catch(() => {
        setError("Erro na busca.");
      })
      .finally(() => {
        setLoading(false);
        bottomSheetRef.current.snapTo(0);
      });
  }

  const Room = ({ name, onClick }) => {
    return (
      <TouchableOpacity
        style={styles.roomButton}
        onPress={() => {
          onClick();
        }}
      >
        <Text style={[styles.text, styles.roomText]}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const ScheduleItem = ({ event, date, room, time, code }) => {
    return (
      <View
        key={event}
        style={{
          width: "100%",
          height: verticalScale(70),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/*  */}
        <View
          style={{
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              marginHorizontal: scale(10),
              color: colors.mainColor,
              fontSize: scale(22),
            }}
          >
            {time.split(':')[0]}h
          </Text>
        </View>

        <Separator vertical />

        <View
          style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
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
  };

  const ScheduleItemMemoized = React.memo(ScheduleItem)

  // Start of BottomSheet

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
    );
  }

  function renderInner() {
    function setPanelHeight() {
      const dateParsed = parseISO(calendarDate)
      return isSaturday(dateParsed)
        ? styles.panelSaturday : styles.panel
    }
    return (
      <View style={setPanelHeight()}>
        <FlatList
          data={scheduleList}
          extraData={scheduleList}
          keyExtractor={(item) => `${item.event}`}
          renderItem={({ item }) => {
            return <ScheduleItemMemoized {...item} />;
          }}
        />
      </View>
    );
  }

  const BSheet = () => {
    return (
      <View
        style={{
          flex: 0.01,
          width: "100%",
          height: "100%",
        }}
      >
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["85%", "35%", "0%"]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={2}
        />
      </View>
    );
  };
  // End of BottomSheet

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <LinearGradient
        colors={[colors.mainColor, colors.secondaryColor]}
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        <View style={styles.calendarContainer}>
          <View style={styles.container}>
            <CalendarStrip
              ref={calendarRef}
              calendarAnimation={{ type: "sequence", duration: 300 }}
              daySelectionAnimation={{
                type: "border",
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
              iconLeft={require('../assets/chevron_left.png')}
              iconRight={require('../assets/chevron_right.png')}
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <ShowErrors error={error} />
          </View>

          <View style={styles.roomsContainer}>
            <Text style={[styles.text, styles.selectRoomText]}>
              Selecione a sala
            </Text>
            <View style={styles.flatListContainer}>
              <FlatList
                data={ROOM_DATA}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Room {...item} onClick={() => getEventsByDate(item.id)} />
                )}
              />
            </View>
            {calendarRef === undefined ? null : <BSheet />}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
  },
  calendarContainer: {
    flex: 2,
  },
  roomsContainer: {
    flex: 4,
    alignItems: "center",
  },
  roomButton: {
    width: "45%",
    height: verticalScale(120),
    alignItems: "flex-start",
    justifyContent: "flex-end",
    backgroundColor: colors.whiteColor,
    borderRadius: scale(16),
    margin: scale(10),
  },
  roomText: {
    margin: scale(5),
    fontSize: scale(18),
    color: colors.mainColor,
  },
  text: {
    fontFamily: "Amaranth-Regular",
    fontSize: scale(16),
    color: colors.whiteColor,
  },
  panel:
  //bottomsheet
  {
    height: verticalScale(72 * 14),
    padding: scale(10),
    backgroundColor: colors.whiteColor,
    paddingTop: verticalScale(20),
    marginBottom: -5,
  },
  panelSaturday: {
    height: verticalScale(72 * 7.5),
    padding: scale(10),
    backgroundColor: colors.whiteColor,
    paddingTop: verticalScale(20),
    marginBottom: -5,
  },
  header: {
    width: "100%",
    height: verticalScale(50),
    paddingTop: verticalScale(10),
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: scale(16),
    borderTopRightRadius: scale(16),
  },
  panelHeader: {
    alignItems: "center",
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
  calendarStyle: { height: verticalScale(100), margin: "3%" },
  dateStyle: {
    color: colors.whiteColor,
    fontFamily: "Amaranth-Regular",
  },
  highlightDateStyle: {
    color: colors.whiteColor,
  },
  disabledDateStyle: {
    color: colors.disableColor,
  },
  selectRoomText: {
    color: colors.whiteColor,
    fontSize: 24,
    marginTop: 5,
  },
  flatListContainer: {
    flex: 1,
    width: "95%",
    justifyContent: "center",
    marginTop: verticalScale(10),
  },
});
