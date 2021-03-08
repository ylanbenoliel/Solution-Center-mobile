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
          onSubmitEditing={() => {}}
          placeholder="Inserir profissão"
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

      <ScrollView>
        {jobs.map((i) => (
          <View key={i.job}>
            <Text style={styles.text}>{i.title}</Text>
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
});
