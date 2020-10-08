/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

import ListEmpty from '@components/ListEmpty';
import Separator from '@components/Separator';

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

const UserLogModal = ({ isVisible, onClose }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [label, setLabel] = useState('Carregando...');
  const [logs, setLogs] = useState([]);
  const [refreshList, setRefreshList] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      getData();
      setRefreshList(!refreshList);
    }, 2000);
  }, [!!isVisible]);

  useEffect(() => {
    getData();
  }, [page]);

  function getData() {
    if (totalPages && (page > totalPages)) {
      return null;
    }
    api.get(`/logs?page=${page}`)
      .then((res) => {
        const incomingLogs = (res.data.data);
        if (page === 1) {
          if (incomingLogs.length === 0) {
            return setLabel('Sem registros.');
          }
          return setLogs(incomingLogs);
        }
        const combineLogs = [...logs, ...incomingLogs];
        setTotalPages(res.data.lastPage);
        return setLogs(combineLogs);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          return setLabel('Sem registros.');
        }
        return setLabel('Erro ao pesquisar registros.');
      });
    return null;
  }

  function handleLoadMore() {
    setPage(page + 1);
  }

  return (
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

        <FlatList
          data={logs}
          extraData={refreshList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LogInfo key={item.id} log={item.log} date={item.created_at} />
          )}
          ItemSeparatorComponent={() => (<Separator />)}
          onEndReachedThreshold={0.5}
          onEndReached={() => handleLoadMore()}
          ListEmptyComponent={<ListEmpty modal label={label} />}

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
