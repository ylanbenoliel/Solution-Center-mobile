/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar, HeaderDrawer } from '@components';

import backgroundLogo from '@assets/LogoHorizontal.png';

import colors from '@constants/colors';

export default function Plans({ navigation }) {
  const [plan, setPlan] = useState(0);

  const Plan = ({ state, touchText, description }) => {
    if (plan !== state) {
      return (
        <TouchableOpacity onPress={() => setPlan(state)}>
          <View style={styles.showPlan}>
            <Text
              style={[
                styles.text,
                { color: colors.accentColor, fontSize: scale(20) },
              ]}
            >
              {touchText}
            </Text>
            <View>
              <Feather
                name="arrow-down"
                size={32}
                color={colors.accentColor}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    } if (plan === state) {
      return (
        <>
          <TouchableOpacity onPress={() => setPlan(0)}>
            <View style={styles.showPlan}>
              <Text
                style={[
                  styles.text,
                  { color: colors.accentColor, fontSize: scale(20) },
                ]}
              >
                {touchText}
              </Text>
              <View>
                <Feather
                  name="arrow-up"
                  size={32}
                  color={colors.accentColor}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ backgroundColor: colors.whiteColor, width: '90%' }}>
            {description.map((item, index) => (
              <Text key={index} style={[styles.text]}>
                {item}
              </Text>
            ))}
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.whiteColor,
      }}
    >
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <ImageBackground
        source={backgroundLogo}
        imageStyle={{
          opacity: 0.1,
          resizeMode: 'contain',
        }}
        style={styles.imageBackground}
      >
        {/*  */}

        <View style={{
          flex: 1,
          justifyContent: 'space-around',
        }}
        >
          <HeaderDrawer navigation={navigation} gotToScreen="Login" title="Planos" />

          <View style={{ marginVertical: verticalScale(14) }} />

          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {'\t\t'}
              Nossos planos atendem a sua necessidade. Em todos eles,
              os custos com recepcionista, água, café, energia elétrica,
              segurança, internet e limpeza, estão inclusos no valor do aluguel.
            </Text>
          </View>

          <View style={{ marginVertical: verticalScale(20) }} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.plansView}
          >
            <Plan
              state={1}
              touchText="Hora avulsa"
              description={[
                '– Períodos mínimos de 60 minutos.',
                '– Valor: R$ 35,00.',
              ]}
            />
            <View style={{ marginVertical: verticalScale(12) }} />
            <Plan
              state={2}
              touchText="Turno"
              description={[
                '– 6 horas consecutivas.',
                '– Valor: R$ 180,00.',
                '– Hora adicional: R$ 30,00.',
              ]}
            />
            <View style={{ marginVertical: verticalScale(12) }} />
            <Plan
              state={3}
              touchText="Diária"
              description={[
                '– De 08h às 18h.',
                '– Valor: R$ 250,00.',
                '– Hora adicional: R$ 30,00.',
              ]}
            />
            <View style={{ marginVertical: verticalScale(12) }} />
            <Plan
              state={5}
              touchText="Fidelidade"
              description={[
                '– Mensalidade de R$ 120,00.',
                '– Valor da hora: R$ 30,00.',
                '– Renovação não obrigatória.',
                '– Marketing nos canais\n de comunicação.',
                '– Prioridade para agendamento\n de horários e escolha de salas.',
              ]}
            />
            <View style={{ marginVertical: verticalScale(12) }} />
            <Plan
              state={6}
              touchText="Mensal"
              description={[
                '– Sala exclusiva.',
                '– Mensalidade de R$ 2000,00.',
                '– Renovação não obrigatória.',
                '– Todas as despesas inclusas.',
                '– Período matutino, de 08h às 13h.',
                '– Hora fora do turno: R$ 30,00.',
              ]}
            />
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  textContainer: {
    marginHorizontal: verticalScale(20),
  },
  plansView: {
    width: '90%',
    marginHorizontal: scale(20),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
    textAlign: 'justify',
  },
  showPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
