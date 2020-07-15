/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Keyboard,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import {
  GeneralStatusBar,
} from '@components';

import { api } from '@services/api';

import colors from '@constants/colors';

const Info = ({ route, navigation }) => {
  const { details } = route.params;

  const [name, setName] = useState(details.name);
  const [email, setEmail] = useState(details.email);
  const [address, setAddress] = useState(details.address);
  const [phone, setPhone] = useState(details.phone);
  const [cpf, setCpf] = useState(details.cpf);
  const [rg, setRg] = useState(details.rg);
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  function handleUpdate() {
    if (
      name === ''
    || email === ''
    || address === ''
    || cpf === ''
    || phone === ''
    || rg === ''
    ) {
      return setError('Campo vazio');
    }
    if (!password) {
      api.patch(`/users/${details.id}`, {
        name,
        email,
        address,
        cpf,
        phone,
        rg,
      }).then(() => {
        Keyboard.dismiss();
        navigation.push('UserProfile');
      })
        .catch(() => {});
    } else {
      api.patch(`/users/${details.id}`, {
        name,
        email,
        address,
        cpf,
        phone,
        rg,
        password,
      }).then(() => {
        Keyboard.dismiss();
        navigation.push('UserProfile');
      })
        .catch(() => {});
    }
    return null;
  }

  return (

    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        backgroundColor="white"
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <View style={{ height: scale(32), width: scale(32) }} />
        <Text style={[styles.text, { fontSize: scale(24) }]}>Perfil</Text>
        <TouchableOpacity
          style={styles.closeModal}
          onPress={() => {
            Keyboard.dismiss();
            navigation.pop();
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

        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Nome:
          </Text>
          <TextInput
            style={[styles.text, styles.textInput]}
            value={name}
            placeholder="Nome"
            onChangeText={(text) => {
              setName(text);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Email:
          </Text>
          <TextInput
            keyboardType="email-address"
            style={[styles.text, styles.textInput]}
            value={email}
            placeholder="Email"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Endereço:
          </Text>
          <TextInput
            style={[styles.text, styles.textInput]}
            value={address}
            placeholder="Endereço"
            onChangeText={(text) => {
              setAddress(text);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Telefone:
          </Text>
          <TextInput
            keyboardType="number-pad"
            style={[styles.text, styles.textInput]}
            value={phone}
            placeholder="Telefone"
            onChangeText={(text) => {
              setPhone(text);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Cpf:
          </Text>
          <TextInput
            keyboardType="number-pad"
            style={[styles.text, styles.textInput]}
            value={cpf}
            placeholder="Cpf"
            onChangeText={(text) => {
              setCpf(text);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Rg:
          </Text>
          <TextInput
            keyboardType="number-pad"
            style={[styles.text, styles.textInput]}
            value={rg}
            placeholder="Rg"
            onChangeText={(text) => {
              setRg(text);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Senha:
          </Text>
          <TextInput
            style={[styles.text, styles.textInput]}
            value={password}
            placeholderTextColor={colors.disableColor}
            placeholder="Vazia para permanecer"
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdate()}
        >
          <Text
            style={
            [styles.text, { color: colors.whiteColor }]
            }
          >
            Atualizar
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderRadius: 4,
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(4),
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
  textInput: {
    flex: 1,
    marginLeft: scale(15),
    fontSize: scale(16),
    height: verticalScale(42),
  },
  button: {
    backgroundColor: colors.mainColor,
    paddingVertical: verticalScale(10),
    marginVertical: verticalScale(20),
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Info;
