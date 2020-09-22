/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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

import {
  GeneralStatusBar, Separator, Loading, ListEmpty,
} from '@components';

import { roomById } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

const UserEventsDetails = ({ route, navigation }) => {
  const { events, user } = route.params;
  const [totalEvents, setTotalEvents] = useState(events);
  const [loading, setLoading] = useState(false);

  function deleteEvent(eventId) {
    setLoading(true);
    api.delete(`/admin/events/${eventId}`)
      .then(() => {
        setTotalEvents(totalEvents.filter((event) => event.id !== eventId));
      })
      .catch(() => {
        Alert.alert('Aviso', 'Erro ao excluir reserva',
          [{ text: 'Ok' },
          ]);
      })
      .finally(() => { setLoading(false); });
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

  const EventList = ({ singleEvent }) => {
    const onlyDate = singleEvent.date.split('T')[0];
    const dateWithBars = onlyDate.split('-').reverse().join('/');
    const roomName = roomById(Number(singleEvent.room));

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
              {roomName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.text}>
                Pagamento:
              </Text>
              <Feather
                name="dollar-sign"
                size={scale(16)}
                color={Number(singleEvent.status_payment) === 1
                  ? colors.accentColor
                  : colors.errorColor}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => {
              Alert.alert('Aviso', 'Deseja alterar essa reserva?',
                [{
                  text: 'Cancelar',
                  style: 'cancel',
                }, {
                  text: 'Ok',
                  onPress: () => {
                    navigation.navigate('Editar', {
                      user,
                      previousDate: dateWithBars,
                      previousRoom: roomName,
                      previousTime: singleEvent.time,
                      eventId: singleEvent.id,
                    });
                  },
                }]);
            }}
          >
            <Feather
              name="edit-2"
              size={scale(28)}
              color={colors.whiteColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              Alert.alert('Aviso', 'Deseja excluir essa reserva?',
                [{
                  text: 'Cancelar',
                  style: 'cancel',
                }, {
                  text: 'Ok',
                  onPress: () => { deleteEvent(singleEvent.id); },
                }]);
            }}
          >
            <Feather
              name="x"
              size={scale(28)}
              color={colors.whiteColor}
            />
          </TouchableOpacity>
        </View>
      </View>

    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
      >
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
          <Text style={[styles.text, { fontSize: scale(24) }]}>Horários</Text>
        </View>

        <View style={{ width: scale(32) }} />
      </View>

      <FlatList
        data={totalEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventList
            singleEvent={item}
          />
        )}
        ItemSeparatorComponent={() => (<Separator />)}
        ListEmptyComponent={<ListEmpty label="Não há reservas." />}
      />
      <RenderLoading />
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

  conditionalLoading: {
    zIndex: 10,
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default UserEventsDetails;
