/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Picker, Alert, ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import { GeneralStatusBar } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const AdminEditEvent = ({ route, navigation }) => {
  const {
    user, previousDate, previousRoom, previousTime, eventId,
  } = route.params;
  const [daySelected, setDaySelected] = useState('');
  const [room, setRoom] = useState(1);
  const [hour, setHour] = useState('08');

  useEffect(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    setDaySelected(currentDate);
  }, []);

  function handleDayPress(day) {
    setDaySelected(day);
  }

  function reserveRoom() {
    api.patch('/admin/events/update', {
      id: eventId,
      room,
      date: daySelected,
      time: hour,
    }).then(() => {
      Alert.alert('', 'Reserva atualizada.', [{
        text: 'Ok',
        onPress: () => { navigation.navigate('Usuários'); },
      }]);
    })
      .catch(() => {
        Alert.alert('', 'Erro ao editar reserva.', [{
          text: 'Ok',
        // onPress: () => { },
        }]);
      });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <View style={{
        flexDirection: 'row',
        margin: scale(10),
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      >
        <TouchableOpacity onPress={() => { navigation.pop(); }}>
          <Feather
            name="arrow-left"
            size={scale(32)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>
        <Text style={[styles.text, styles.headerText]}>Editar reserva</Text>
        <View style={{ width: scale(32) }} />
      </View>

      <ScrollView contentContainerStyle={{ height: '130%' }}>

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
          <Text style={styles.text}>Reserva atual:</Text>
          <Text style={styles.text}>
            Sala
            {' '}
            {previousRoom}
            ,
            {' '}
            Dia
            {' '}
            {previousDate}
            ,
            {' '}
            Hora
            {' '}
            {previousTime.split(':')[0]}
            h
          </Text>
        </View>

        <View style={{
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}
        >

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text}>Sala</Text>
            <Picker
              selectedValue={room}
              onValueChange={(value) => { setRoom(value); }}
              style={{
                height: 50, width: 150, color: colors.mainColor,
              }}
            >
              <Picker.Item label={`${ROOM_DATA[0].name}`} value={`${ROOM_DATA[0].room}`} />
              <Picker.Item label={`${ROOM_DATA[1].name}`} value={`${ROOM_DATA[1].room}`} />
              <Picker.Item label={`${ROOM_DATA[2].name}`} value={`${ROOM_DATA[2].room}`} />
              <Picker.Item label={`${ROOM_DATA[3].name}`} value={`${ROOM_DATA[3].room}`} />
              <Picker.Item label={`${ROOM_DATA[4].name}`} value={`${ROOM_DATA[4].room}`} />
              <Picker.Item label={`${ROOM_DATA[5].name}`} value={`${ROOM_DATA[5].room}`} />
              <Picker.Item label={`${ROOM_DATA[6].name}`} value={`${ROOM_DATA[6].room}`} />
              <Picker.Item label={`${ROOM_DATA[7].name}`} value={`${ROOM_DATA[7].room}`} />
              <Picker.Item label={`${ROOM_DATA[8].name}`} value={`${ROOM_DATA[8].room}`} />
            </Picker>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text}>Hora</Text>
            <Picker
              selectedValue={hour}
              onValueChange={(value) => { setHour(value); }}
              style={{
                height: 50, width: 150, color: colors.mainColor,
              }}
            >
              <Picker.Item label="08h" value="08:00:00" />
              <Picker.Item label="09h" value="09:00:00" />
              <Picker.Item label="10h" value="10:00:00" />
              <Picker.Item label="11h" value="11:00:00" />
              <Picker.Item label="12h" value="12:00:00" />
              <Picker.Item label="13h" value="13:00:00" />
              <Picker.Item label="14h" value="14:00:00" />
              <Picker.Item label="15h" value="15:00:00" />
              <Picker.Item label="16h" value="16:00:00" />
              <Picker.Item label="17h" value="17:00:00" />
              <Picker.Item label="18h" value="18:00:00" />
              <Picker.Item label="19h" value="19:00:00" />
              <Picker.Item label="20h" value="20:00:00" />
              <Picker.Item label="21h" value="21:00:00" />
            </Picker>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <TouchableOpacity
            onPress={() => {
              Alert.alert('', `Editar reserva de ${user.name}?`,
                [{
                  text:
            'Cancelar',
                  style: 'cancel',
                }, {
                  text: 'Ok',
                  onPress: () => { reserveRoom(); },
                }]);
            }}
            style={[styles.button, styles.confirmButton]}
          >
            <Text style={[styles.text, styles.buttonText]}>Editar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    color: colors.mainColor,
    fontSize: scale(16),
  },
  headerText: { fontSize: scale(18) },
  buttonText: { color: colors.whiteColor },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: verticalScale(40),
    borderRadius: scale(8),
  },
  confirmButton: {
    backgroundColor: colors.accentColor,
  },
});

export default AdminEditEvent;
