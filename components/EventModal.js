/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { Separator, StatusButton } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

const EventModal = ({
  isVisible, onClose, roomName, eventList, dateHeader,
}) => {
  const [localEventList, setLocalEventList] = useState(null);

  useEffect(() => {
    setLocalEventList(eventList);
  }, [!!isVisible]);

  function reserveRoom(room, date, time) {
    api.post('/events/new', {
      room,
      date,
      time,
    })
      .then((res) => {
        const emptyEvent = localEventList
          .find((evt) => evt.time.includes(time));

        const userEvent = {
          event: res.data.event.id,
          code: '2',
          ...res.data.event,
        };

        const totalList = localEventList
          .map((event) => {
            if (event.time === emptyEvent.time) {
              return userEvent;
            }

            return event;
          })
          .sort((prev, next) => prev.time.localeCompare(next.time));

        setLocalEventList(totalList);
      })
      .catch(() => {
      });
  }

  function dismissRoom(eventId) {
    api.delete(`/events/${eventId}`)
      .then(() => {
        // eslint-disable-next-line eqeqeq
        const deletedEvent = localEventList.find((evt) => evt.event == eventId);

        const emptyEvent = {
          event: `${Math.random()}`,
          user: '',
          room: `${deletedEvent.room}`,
          date: `${deletedEvent.date.split('T')[0]}`,
          time: `${deletedEvent.time}`,
          code: '1',
        };
        const totalList = localEventList
          // eslint-disable-next-line eqeqeq
          .filter((evt) => evt.event != eventId)
          .concat(emptyEvent)
          .sort((prev, next) => prev.time.localeCompare(next.time));
        setLocalEventList(totalList);
      })
      .catch(() => {
      });
  }

  const ScheduleItem = ({
    event, date, room, time, code,
  }) => (
    <View
      key={event}
      style={styles.scheduleItemContainer}
    >
      {/*  */}
      <View style={styles.scheduleItemHourContainer}>
        <Text style={styles.text}>
          {time.split(':')[0]}
          h
        </Text>
      </View>

      <Separator vertical />

      <View
        style={styles.statusButtonContainer}
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

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={{ height: scale(20), width: scale(20) }} />
          <Text style={[styles.text]}>{roomName}</Text>
          <Text style={[styles.text]}>{dateHeader.split('-').reverse().join('/')}</Text>
          <TouchableOpacity
            style={styles.closeModal}
            onPress={() => {
              onClose();
            }}
          >
            <Feather
              name="x"
              size={scale(32)}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>

        <View style={{
          flex: 9,
          width: '100%',
        }}
        >

          <FlatList
            data={localEventList}
            keyExtractor={(item) => `${item.event}`}
            renderItem={({ item }) => <ScheduleItemMemoized {...item} />}
          />
        </View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderRadius: 4,
    alignItems: 'center',
  },
  header: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(20),
    color: colors.mainColor,
  },
  closeModal: {
    marginRight: scale(6),
  },
  scheduleItemContainer: {
    width: '100%',
    height: verticalScale(70),
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleItemHourContainer: {
    height: '100%',
    width: scale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusButtonContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventModal;
