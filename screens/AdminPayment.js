/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  View, Alert, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar, Separator, ListEmpty } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

// eslint-disable-next-line react/prop-types
const AdminPayment = ({ route }) => {
  const { events } = route.params;
  const [eventsNotPaid, setEventsNotPaid] = useState(events);

  function confirmEventPayment(eventId) {
    api.patch('/admin/events/payment', {
      id: eventId,
      status_payment: 1,
    })
      .then(() => {
        const restEvents = eventsNotPaid
          .filter((evt) => {
            if (evt.id !== eventId) { return evt; } return false;
          });
        setEventsNotPaid(restEvents);
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
            <View style={{ flexDirection: 'column' }}>
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

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.text]}>Pgto.</Text>
              <TouchableOpacity
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

                <Feather name="x" color={colors.errorColor} size={scale(28)} />
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
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={{ marginTop: 10 }}>

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
          ListEmptyComponent={<ListEmpty label="Usuário em dia com os pagamentos." />}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: 'justify',
  },

  eventsNotPaidContainer: {
    margin: scale(5),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default AdminPayment;
