/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar } from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [jobInput, setJobInput] = useState('');

  useEffect(() => {
    fetchJobs();
    return () => {
      setJobs([]);
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

  async function storeJob() {
    try {
      await api.post('/jobs', { title: jobInput });
      const newJob = jobs.concat({ job: Math.random(), title: jobInput });
      setJobs(newJob);
      setJobInput('');
    } catch {
      Alert.alert('Erro!', 'Não foi possível salvar profissão.',
        [{
          text: 'Ok',
          onPress: () => { },
        }]);
    }
  }

  async function handleSaveJob() {
    if (!jobInput) {
      Alert.alert('Erro!', 'Insira uma profissão.',
        [{
          text: 'Ok',
          onPress: () => { },
        }]);
      return;
    }

    Alert.alert('', `Deseja salvar a profissão: ${jobInput}?`,
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

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="white-content"
      />

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

      <ScrollView contentContainerStyle={{ marginVertical: 20 }}>
        {jobs.map((data, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={index}>
            <Text style={styles.text}>{data.title}</Text>
          </View>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: colors.whiteColor,
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: 16,
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
});
