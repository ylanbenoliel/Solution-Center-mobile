/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar, Separator } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

const UserEventsDetails = ({ route, navigation }) => {
  const { events } = route.params;
  const [eventsNotPaid, setEventsNotPaid] = useState(events);
  const [totalEvents, setTotalEvents] = useState(events);

  useEffect(() => {
    setTotalEvents(totalEvents
      .sort((prev, next) => next.event - prev.event));
  }, []);

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
      return (
        <View
          key={singleEvent.id}
          style={styles.eventsNotPaidContainer}
        >
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
            {singleEvent.room}
          </Text>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                Alert.alert('Aviso',
                  `O usuário pagou a reserva Hora: ${singleEvent.time.split(':')[0]}h Dia: ${dateWithBars}?`,
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
      );
    }
    return null;
  };

  const EventList = ({ singleEvent }) => {
    const onlyDate = singleEvent.date.split('T')[0];
    const dateWithBars = onlyDate.split('-').reverse().join('/');
    return (
      <View
        key={singleEvent.id}
        style={{ alignItems: 'center' }}
      >
        <View
          style={{
            width: '95%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
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
              {singleEvent.room}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => {
              Alert.alert('Aviso', 'Deseja alterar essa reserva?',
                [{
                  text:
          'Cancelar',
                  style: 'cancel',
                }, {
                  text: 'Ok',
                  onPress: () => { },
                }]);
            }}
          >
            <Text style={[styles.text, styles.buttonText]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              Alert.alert('Aviso', 'Deseja excluir essa reserva?',
                [{
                  text:
            'Cancelar',
                  style: 'cancel',
                }, {
                  text: 'Ok',
                  onPress: () => { },
                }]);
            }}
          >
            <Text style={[styles.text, styles.buttonText]}>Excluir</Text>
          </TouchableOpacity>
        </View>
        <Separator />
      </View>

    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <TouchableOpacity
        style={{ margin: scale(10) }}
        onPress={() => { navigation.pop(); }}
      >
        <Feather
          name="arrow-left"
          size={scale(32)}
          color={colors.navigationColor}
        />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.text}>Horários não pagos</Text>
        <FlatList
          horizontal
          data={eventsNotPaid}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ShowNotPaidEvent
              singleEvent={item}
            />
          )}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Text style={styles.text}>Horários</Text>
        <Separator />
      </View>

      <FlatList
        data={totalEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventList
            singleEvent={item}
          />
        )}
      />
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
  editButton: {
    backgroundColor: '#804d00',
  },
  deleteButton: {
    backgroundColor: colors.errorColor,
  },
  eventsNotPaidContainer: {
    marginVertical: verticalScale(5),
    marginHorizontal: scale(5),
  },
});

export default UserEventsDetails;
