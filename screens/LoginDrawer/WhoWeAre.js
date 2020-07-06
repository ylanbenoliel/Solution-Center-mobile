/* eslint-disable global-require */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import Logo from '@assets/logo-solution-azul.svg';
import background from '@assets/whoweare.png';

import colors from '@constants/colors';

export default function WhoWeAre({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.whiteColor }}>

      <ImageBackground source={background} style={styles.imageBackground}>
        {/*  */}
        <View style={styles.header}>
          <View style={{ paddingLeft: scale(20) }} />
          <Text style={[styles.text, styles.headerName]}>Sobre nós</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Feather
              name="x"
              size={32}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: 'space-around' }}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {'\t\t'}
              O
              {' '}
              <Text style={styles.textStrong}>Solution Center</Text>
              {' '}
              foi idealizado pensando em você! Somos profissionais liberais e
              entendemos a dinâmica de trabalho que o cenário mundial, cada vez
              mais, nos traz.
            </Text>
            <Text style={styles.text}>
              {'\n\t\t'}
              Por isso, nossa missão é proporcionar ao profissional o
              espaço perfeito para o desenvolvimento de seu trabalho, com uma
              estrutura de alto padrão. Nossos ambientes são sofisticados,
              confortáveis e privados.
            </Text>
            <Text style={styles.text}>
              {'\n\t\t'}
              Assim, nós oferecemos segurança, conforto e praticidade
              ao seu atendimento. Tudo isso sem custo fixo ou burocracia. Aqui
              você paga somente quando usar.
            </Text>
          </View>

          <View style={styles.logoContainer}>
            <Logo width={300} height={70} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    zIndex: 2,
    width: '100%',
    height: verticalScale(56),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: verticalScale(40),
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: scale(36),
  },
  textContainer: {
    marginHorizontal: scale(20),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
    textAlign: 'justify',
  },
  textStrong: {
    fontWeight: 'bold',
  },
  logoContainer: { alignItems: 'center', marginBottom: verticalScale(30) },
});
