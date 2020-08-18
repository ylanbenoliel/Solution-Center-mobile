/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  View, Alert, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar, Separator } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

// eslint-disable-next-line react/prop-types
const AdminPayment = ({ route, navigation }) => {
  const { events } = route.params;
  const [eventsNotPaid, setEventsNotPaid] = useState(events);
  function confirmEventPayment(eventId) {
    api.patch('/admin/events/update', {
      id: eventId,
      status_payment: 1,
    })
      .then(() => {
        setEventsNotPaid(eventsNotPaid.filter((evt) => {
          if (evt.id !== eventId) { return evt; } return false;
        }));
      })
      .catch(() => {
        Alert.alert('Aviso', 'Erro ao salvar informação de pagamento.',
          [
            {
              text: 'Ok',
            },
          ]);
      });
  }
  const ShowNotPaidEvent = ({ singleEvent }) => {
    if (singleEvent.status_payment === 0) {
      const onlyDate = singleEvent.date.split('T')[0];
      const dateWithBars = onlyDate.split('-').reverse().join('/');
      const roomName = ROOM_DATA.map((data) => {
        if (data.room === Number(singleEvent.room)) { return data.name.split(' ')[0]; }
        return false;
      }).filter((element) => element);
      return (
        <>
          <View
            key={singleEvent.id}
            style={styles.eventsNotPaidContainer}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={styles.text}>
                Data:
                {' '}
                {dateWithBars}
              </Text>
              <Text style={styles.text}>
                Hora:
                {' '}
                {singleEvent.time}
              </Text>
              <Text style={styles.text}>
                Sala:
                {' '}
                {roomName}
              </Text>
            </View>

            <View style={{ justifyContent: 'center' }}>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  Alert.alert('Aviso',
                    `O usuário pagou a reserva Hora: ${singleEvent.time.split(':')[0]}h, Dia: ${dateWithBars}, Sala: ${roomName}?`,
                    [{
                      text:
                    'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Ok',
                      onPress: () => { confirmEventPayment(singleEvent.id); },
                    }]);
                }}
              >
                <Text style={[styles.text, styles.buttonText]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Separator />
        </>
      );
    }
    return null;
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>

        <TouchableOpacity
          style={{ marginVertical: scale(10) }}
          onPress={() => { navigation.pop(); }}
        >
          <Feather
            name="arrow-left"
            size={scale(32)}
            color={colors.navigationColor}
          />
        </TouchableOpacity>
        <View>
          <Text style={[styles.text, { fontSize: scale(24) }]}>Horários não pagos</Text>
        </View>

        <View style={{ width: scale(32) }} />
      </View>

      <View>

        <FlatList
          data={eventsNotPaid}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ShowNotPaidEvent
              singleEvent={item}
            />
          )}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: 'justify',
  },
  buttonText: { color: colors.whiteColor },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(80),
    height: verticalScale(40),
    borderRadius: scale(8),
  },
  confirmButton: {
    backgroundColor: colors.accentColor,
  },
  eventsNotPaidContainer: {
    margin: scale(5),
    flexDirection: 'row',
  },
});

export default AdminPayment;
