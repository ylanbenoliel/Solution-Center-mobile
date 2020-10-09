/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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

const MessageInfo = ({ message, date }) => {
  const formattedDate = format(parseISO(date), "dd/MM/yyyy à's' HH:mm");
  return (
    <View style={styles.messageInfoContainer}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.text}>
          {message}
        </Text>
      </View>

      <Text style={[styles.text, styles.dateCreation]}>
        Gerado em:
        {' '}
        {formattedDate}
      </Text>
    </View>
  );
};

const UserEventsModal = ({ isVisible, onClose }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [label, setLabel] = useState('Carregando...');
  const [messages, setMessages] = useState([]);

  function getData() {
    if (totalPages && (page > totalPages)) {
      return null;
    }
    api.get(`/messages?page=${page}`)
      .then((res) => {
        const incomingMessages = (res.data.data);
        if (page === 1) {
          if (incomingMessages.length === 0) {
            return setLabel('Sem mensagens.');
          }
          return setMessages(incomingMessages);
        }

        const combineMessages = [...messages, ...incomingMessages];
        setTotalPages(res.data.lastPage);
        return setMessages(combineMessages);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          return setLabel('Sem mensagens.');
        }
        return setLabel('Erro ao pesquisar mensagens.');
      });
    return null;
  }

  function handleLoadMore() {
    setPage(page + 1);
    getData();
  }

  function handleOpenModal() {
    getData();
  }

  function handleCloseModal() {
    setMessages([]);
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
        <Text style={[styles.text, { fontSize: scale(24) }]}>Notificações</Text>
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
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MessageInfo key={item.id} message={item.message} date={item.created_at} />
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
    minHeight: verticalScale(60),
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

export default UserEventsModal;
