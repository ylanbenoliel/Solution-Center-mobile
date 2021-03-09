/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { GeneralStatusBar } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

export default function UserJob({ route }) {
  const { id: userId } = route.params;
  const [userJob, setUserJob] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchUserJob();
    return () => {
      setJobs([]);
      setUserJob({});
    };
  }, []);

  async function fetchJobs() {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      Alert.alert('', 'Erro ao buscar as profissões salvas.');
    }
  }

  async function fetchUserJob() {
    try {
      const { data } = await api.get(`/user/${userId}/job`);
      setUserJob(data);
    } catch (error) {
      Alert.alert('', 'Erro ao buscar profissão do usuário.');
    }
  }

  function handleUpdateUserJob(jobSelected) {
    Alert.alert('Aviso', `Deseja alterar a atual profissão: ${userJob.title}, 
para: ${jobSelected.title}?`,
    [{
      text:
      'Cancelar',
      style: 'cancel',
    }, {
      text: 'Sim',
      onPress: () => { updateJob(jobSelected.job); },
    }]);
  }

  async function updateJob(jobId) {
    try {
      const { data } = await api.patch('/update-user-job', {
        user: userId,
        job: jobId,
      });

      Alert.alert('', `${data.message}`);
      setUserJob(jobs.find((info) => info.job === jobId));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="white-content"
      />
      <View style={{ alignItems: 'center' }}>
        <Text
          style={[styles.text, { color: colors.mainColor, fontSize: 24 }]}
        >
          Selecione a profissão
        </Text>
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 180 }}
        data={jobs}
        extraData={userJob}
        keyExtractor={(item) => item.job.toString()}
        renderItem={({ item }) => {
          const btnStyle = item.job === userJob.job
            ? [styles.defaultButton, styles.selectedButton] : styles.defaultButton;
          return (
            <TouchableOpacity onPress={() => { handleUpdateUserJob(item); }}>
              <View
                key={item.job}
                style={btnStyle}
              >
                <Text style={styles.text}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    marginHorizontal: 16,
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: 16,
    color: colors.whiteColor,
  },
  defaultButton: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.placeholderColor,
  },
  selectedButton: {
    backgroundColor: colors.mainColor,
  },
});
