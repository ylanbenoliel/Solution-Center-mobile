/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import colors from '@constants/colors';

const LogInfo = ({ log, date }) => (
  <View style={styles.messageInfoContainer}>
    <Text style={styles.text}>
      {log}
    </Text>
    <Text style={[styles.text, styles.dateCreation]}>
      Gerado em:
      {' '}
      {date}
    </Text>
  </View>
);

const UserLogModal = ({ isVisible, onClose, logs }) => (

  <Modal isVisible={isVisible} style={styles.container}>
    <View style={styles.header}>
      <View style={{ height: scale(32), width: scale(32) }} />
      <Text style={[styles.text, { fontSize: scale(24) }]}>Registros</Text>
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

    <View style={{ flex: 9, width: '90%' }}>

      {logs ? (
        <FlatList
          data={logs}
          contentContainerStyle={{
            borderTopWidth: 2,
            borderColor: '#ccc',
          }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LogInfo key={item.id} log={item.log} date={item.created_at} />
          )}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.text, { fontSize: scale(24) }]}>
            Não há registros.
          </Text>
        </View>
      )}
    </View>

  </Modal>
);

const styles = StyleSheet.create({
  messageInfoContainer: {
    minHeight: verticalScale(70),
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    paddingVertical: verticalScale(4),
    paddingLeft: scale(10),
  },
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderRadius: 20,
    alignItems: 'center',
  },
  header: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeModal: {
    marginRight: scale(4),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(20),
    color: colors.mainColor,
  },
  dateCreation: { fontSize: scale(14) },
});

export default UserLogModal;