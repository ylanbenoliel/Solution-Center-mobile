/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  View, Alert, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar, Separator, ListEmpty } from '@components';

import { roomById } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

// eslint-disable-next-line react/prop-types
const AdminPayment = ({ route }) => {
  const { user } = route.params;
  const [eventsNotPaid, setEventsNotPaid] = useState(null);

  useEffect(() => {
    seeUserDebts();
  }, []);

  async function seeUserDebts() {
    try {
      const eventsNotPaidResponse = await api.post('/admin/events/list/debts', {
        user,
      });
      setEventsNotPaid(eventsNotPaidResponse.data.data);
    } catch (error) {
      Alert.alert('Aviso', 'Não foi possível carregas os débitos do usuário',
        [
          {
            text: 'Ok',
          },
        ]);
    }
  }
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
    const onlyDate = singleEvent.date.split('T')[0];
    const dateWithBars = onlyDate.split('-').reverse().join('/');
    const roomName = roomById(singleEvent.room);
    return (
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
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />

      <View>

        <FlatList
          data={eventsNotPaid}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (<Separator />)}
          renderItem={({ item }) => (
            <ShowNotPaidEvent
              singleEvent={item}
            />
          )}
          ListEmptyComponent={(
            <ListEmpty
              label={eventsNotPaid ? 'Usuário em dia com os pagamentos.' : 'Carregando...'}
            />
)}
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
