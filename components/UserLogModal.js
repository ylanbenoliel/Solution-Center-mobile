/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState, memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

import ListEmpty from '@components/ListEmpty';
import Separator from '@components/Separator';

import { removeDuplicates } from '@helpers/functions';

import { api } from '@services/api';

import colors from '@constants/colors';

const LogInfo = ({ log, date }) => {
  const formattedDate = format(parseISO(date), "dd/MM/yyyy à's' HH:mm");
  return (
    <View style={styles.messageInfoContainer}>
      <Text style={styles.text}>
        {log}
      </Text>
      <Text style={[styles.text, styles.dateCreation]}>
        Gerado em:
        {' '}
        {formattedDate}
      </Text>
    </View>
  );
};

const LogInfoMemo = memo(LogInfo);

const UserLogModal = ({ isVisible, onClose }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [logs, setLogs] = useState(null);

  async function fetchData(pageToLoad = 1) {
    try {
      if (totalPages && (pageToLoad > totalPages)) {
        return;
      }
      const logsResponse = await api.get(`/logs?page=${pageToLoad}`);
      const incomingLogs = (logsResponse.data.data);
      if (pageToLoad === 1) {
        if (incomingLogs.length === 0) {
          setLogs([]);
          return;
        }
        setLogs(incomingLogs);
        return;
      }
      const combineLogs = [...logs, ...incomingLogs];
      const logsWithoutDuplicates = removeDuplicates(combineLogs, 'id');
      setTotalPages(logsResponse.data.lastPage);
      setLogs(logsWithoutDuplicates);
      setPage(page + 1);
    } catch (error) {
      setLogs([]);
    }
  }

  function handleOpenModal() {
    fetchData();
  }

  function handleCloseModal() {
    setLogs(null);
    setPage(1);
  }

  return (
    <Modal
      isVisible={isVisible}
      style={styles.container}
      onModalShow={() => { handleOpenModal(); }}
      onModalHide={() => { handleCloseModal(); }}
      onBackButtonPress={() => { onClose(); }}
      onBackdropPress={() => { onClose(); }}
    >
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
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LogInfoMemo key={item.id} log={item.log} date={item.created_at} />
          )}
          ItemSeparatorComponent={() => (<Separator />)}
          onEndReachedThreshold={0.6}
          onEndReached={() => fetchData(page + 1)}
          ListEmptyComponent={(
            <ListEmpty
              modal
              label={logs ? 'Sem logs.' : 'Carregando...'}
            />
          )}
        />
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  messageInfoContainer: {
    minHeight: verticalScale(70),
    justifyContent: 'center',
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
