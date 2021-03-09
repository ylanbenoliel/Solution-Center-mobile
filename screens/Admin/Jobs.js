/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar, SnackBar } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [jobInput, setJobInput] = useState('');

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [snackColor, setSnackColor] = useState('');

  useEffect(() => {
    fetchJobs();
    return () => {
      setJobs([]);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
  }, [visibleSnack === true]);

  async function fetchJobs() {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      Alert.alert('', 'Erro ao buscar as profissões salvas.');
    }
  }

  async function storeJob() {
    try {
      await api.post('/jobs', { title: jobInput });
      const newJob = jobs.concat({ job: Math.random(), title: jobInput });
      setJobs(newJob);
      setJobInput('');
      setSnackColor(colors.accentColor);
      setSnackText('Profissão criada.');
      setVisibleSnack(true);
    } catch {
      setSnackColor(colors.errorColor);
      setSnackText('Erro! Não foi possível salvar profissão.');
      setVisibleSnack(true);
    }
  }

  async function updateJob(jobObject) {
    try {
      await api.put(`/jobs/${jobObject.job}`, { title: jobInput });
      const currentJobList = jobs.map((info) => {
        if (info.job === jobObject.job) {
          return {
            ...info,
            title: jobInput,
          };
        }
        return info;
      });
      setJobs(currentJobList);
      setJobInput('');
      setSnackColor(colors.accentColor);
      setSnackText('Profissão Atualizada.');
      setVisibleSnack(true);
    } catch {
      setSnackColor(colors.errorColor);
      setSnackText('Erro! Não foi possível atualizar profissão.');
      setVisibleSnack(true);
    }
  }

  function handleSaveJob() {
    if (!jobInput) {
      setSnackColor(colors.errorColor);
      setSnackText('Erro! Insira uma profissão.');
      setVisibleSnack(true);
      return;
    }

    Alert.alert('', `Deseja inserir a nova profissão: ${jobInput}?`,
      [{
        text:
    'Cancelar',
        style: 'cancel',
      }, {
        text: 'Sim',
        onPress: () => {
          Keyboard.dismiss();
          storeJob();
        },
      }]);
  }

  function handleUpdateJob(jobSelected) {
    if (!jobInput) {
      setSnackColor(colors.errorColor);
      setSnackText('Erro! Insira uma profissão.');
      setVisibleSnack(true);
      return;
    }

    Alert.alert('Aviso', `Deseja alterar a atual profissão: ${jobSelected.title}, 
para: ${jobInput}?`,
    [{
      text:
  'Cancelar',
      style: 'cancel',
    }, {
      text: 'Sim',
      onPress: () => {
        Keyboard.dismiss();
        updateJob(jobSelected);
      },
    }]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="white-content"
      />

      <View style={{ marginHorizontal: 16 }}>

        <View style={styles.inputContainer}>
          <TextInput
            value={jobInput}
            style={[styles.text, styles.textInput]}
            onChangeText={(text) => {
              setJobInput(text);
            }}
            placeholder="Profissão"
            autoCapitalize="words"
            autoCorrect={false}
            placeholderTextColor={colors.placeholderColor}
          />

          <TouchableOpacity onPress={() => setJobInput('')}>
            <Feather
              name="x"
              size={32}
              color={colors.placeholderColor}
            />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => { handleSaveJob(); }}>
            <View style={styles.saveButton}>
              <Text style={[styles.text, { color: colors.whiteColor }]}>Salvar</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{ paddingBottom: 180 }}
          data={jobs}
          keyExtractor={(item) => item.job.toString()}
          renderItem={({ item }) => (
            <View
              key={item.job}
              style={styles.jobItem}
            >
              <Text style={styles.text}>{item.title}</Text>
              <TouchableOpacity onPress={() => { handleUpdateJob(item); }}>
                <Feather
                  name="edit-2"
                  size={28}
                  color={colors.accentColor}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <SnackBar visible={visibleSnack} text={snackText} color={snackColor} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: 18,
    color: colors.mainColor,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.mainColor,
  },
  textInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    height: 42,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.mainColor,
  },
  jobItem: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
