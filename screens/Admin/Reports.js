/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
} from 'react-native';

import { GeneralStatusBar } from '@components';

import colors from '@constants/colors';

const HOUR_FILTER = 1;
const ROOM_FILTER = 2;
const JOB_FILTER = 3;

const Reports = () => {
  const [filter, setFilter] = useState(1);

  const SelectedButton = ({ label, option }) => {
    const buttonStyle = option === filter
      ? [styles.button, styles.selectedButton]
      : [styles.button];
    const buttonText = option === filter
      ? [styles.text, styles.selectedText]
      : [styles.text];
    return (
      <TouchableOpacity onPress={() => { setFilter(option); }}>
        <View style={buttonStyle}>
          <Text style={buttonText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <View style={styles.resultContainer} />

      <View style={styles.optionController}>
        <View style={styles.filterContainer}>
          <SelectedButton label="Hora:" option={HOUR_FILTER} />
          <SelectedButton label="Sala:" option={ROOM_FILTER} />
          <SelectedButton label="Profissão:" option={JOB_FILTER} />
        </View>
        <View>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.searchButton}>
              <Text style={[styles.text, styles.selectedText]}>Buscar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    marginHorizontal: 16,
  },
  resultContainer: {
    flex: 3,
    backgroundColor: 'green',
  },
  optionController: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: 16,
    color: colors.mainColor,
  },
  selectedText: {
    color: colors.whiteColor,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    maxHeight: 50,
    maxWidth: 100,
    backgroundColor: colors.whiteColor,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.mainColor,
  },
  selectedButton: {
    backgroundColor: colors.accentColor,
    borderColor: colors.whiteColor,
  },
  filterContainer: {
    height: 160,
    justifyContent: 'space-between',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 50,
    borderRadius: 4,
    backgroundColor: colors.mainColor,
  },
});

export default Reports;
