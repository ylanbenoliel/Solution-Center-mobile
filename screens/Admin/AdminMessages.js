/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { format, parseISO } from 'date-fns';

import { GeneralStatusBar } from '@components';
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

const AdminMessages = ({ route }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [label, setLabel] = useState('Carregando...');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 2000);
  }, []);

  useEffect(() => {
    getData();
  }, [page]);

  function getData() {
    if (totalPages && (page > totalPages)) {
      return null;
    }
    api.get(`/messages?page=${page}&user=${route.params.user}`)
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <FlatList
        data={messages}
        contentContainerStyle={{ paddingBottom: scale(25) }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageInfo key={item.id} message={item.message} date={item.created_at} />
        )}
        ItemSeparatorComponent={() => (<Separator />)}
        onEndReachedThreshold={0.5}
        onEndReached={() => handleLoadMore()}
        ListEmptyComponent={<ListEmpty label={label} />}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageInfoContainer: {
    minHeight: verticalScale(60),

    paddingLeft: scale(10),
  },
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
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

export default AdminMessages;
