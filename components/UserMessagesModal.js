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

const MessageInfoMemo = memo(MessageInfo);

const UserMessagesModal = ({ isVisible, onClose }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [messages, setMessages] = useState(null);

  async function fetchData(pageToLoad = 1) {
    try {
      if (totalPages && (pageToLoad > totalPages)) {
        return;
      }
      const messagesResponse = await api.get(`/messages?page=${pageToLoad}`);
      const incomingMessages = (messagesResponse.data.data);
      if (pageToLoad === 1) {
        if (incomingMessages.length === 0) {
          setMessages([]);
          return;
        }
        setMessages(incomingMessages);
        return;
      }
      const combineMessages = [...messages, ...incomingMessages];
      const messagesWithoutDuplicates = removeDuplicates(combineMessages, 'id');
      setTotalPages(messagesResponse.data.lastPage);
      setMessages(messagesWithoutDuplicates);
      setPage(page + 1);
    } catch (error) {
      setMessages([]);
    }
  }

  function handleOpenModal() {
    fetchData();
  }

  function handleCloseModal() {
    setMessages(null);
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
            <MessageInfoMemo key={item.id} message={item.message} date={item.created_at} />
          )}
          ItemSeparatorComponent={() => (<Separator />)}
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchData(page + 1)}
          ListEmptyComponent={(
            <ListEmpty
              modal
              label={messages ? 'Sem mensagens.' : 'Carregando...'}
            />
          )}
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

export default UserMessagesModal;
