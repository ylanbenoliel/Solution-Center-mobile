/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Feather } from '@expo/vector-icons';

import { GeneralStatusBar } from '@components';

import backgroundLogo from '@assets/LogoHorizontal.png';

import colors from '@constants/colors';

const width = Dimensions.get('window').width * 0.9;
const height = width * 0.6;

const Place = ({
  name, photo, support, com, indication, extra,
}) => (
  <View style={{
    width,
    marginHorizontal: verticalScale(20),
  }}
  >

    <Text style={[styles.text, { fontSize: scale(20), textAlign: 'center' }]}>
      {name.trim()}
    </Text>
    <View style={{ alignItems: 'center' }}>

      <Image
        source={photo}
        style={{
          width,
          height,
          borderRadius: scale(6),
          marginVertical: verticalScale(4),
        }}
      />
    </View>

    <Text style={styles.text}>{support.trim()}</Text>
    <Text style={[styles.text]}>{com.trim()}</Text>
    <Text style={styles.text}>
      {indication.trim()}
    </Text>
    {extra && (
      <Text style={styles.text}>
        {extra.trim()}
      </Text>
    )}
  </View>

);

export default function Ambients({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
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
        <View style={styles.header}>
          <View style={{ paddingLeft: verticalScale(20) }} />
          <Text style={[styles.text, styles.headerName]}>Ambientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Feather
              name="x"
              size={scale(32)}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>
        {/*  */}

        <View style={{ flex: 8 }}>

          <ScrollView horizontal>

            <Place
              name="Sala Clarice Lispector"
              photo={require('@assets/rooms/clarice-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa, poltrona, cadeiras e maca."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Médicos, Enfermeiros, Biomédicos,
              Farmacêuticos, Fisioterapeutas, Nutricionistas, Terapeutas Manuais, Profissionais da área
              de estética, entre outros profissionais."
            />

            <Place
              name="Sala Carlos Drummond de Andrade"
              photo={require('@assets/rooms/carlos-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa, poltrona, cadeira e divã."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Psicólogos,
             Terapeutas Ocupacionais, Advogados, Contadores, Coach, entre outros profissionais"
            />

            <Place
              name="Sala Cecília Meireles"
              photo={require('@assets/rooms/cecilia-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa de apoio, poltrona e divã."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Psicólogos,
             Terapeutas, entre outros profissionais."
            />

            <Place
              name="Sala Rui Barbosa"
              photo={require('@assets/rooms/rui-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa, poltrona, cadeiras e divã."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Médicos,
             Psicólogos, Nutricionistas, Advogados, Contadores, Terapeutas Ocupacionais,
              Coach, entre outros profissionais."
            />

            <Place
              name="Sala Machado de Assis"
              photo={require('@assets/rooms/machado-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa, poltrona,
             cadeiras, sofá, Smart TV de 29” e cabo HDMI disponível para conexão multimídia."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Médicos,
             Psicólogos, Nutricionistas, Advogados, Contadores, Engenheiros, Arquitetos,
              Terapeutas Ocupacionais, Cerimonialistas de Eventos, Fotógrafos, Decoradores,
               Coach, Terapeutas Manuais, Profissionais da área de estética, entre outros profissionais."
            />

            <Place
              name="Sala Monteiro Lobato"
              photo={require('@assets/rooms/monteiro-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa de apoio,
             poltrona e sofá."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Psicólogos,
             Terapeutas, entre outros profissionais."
            />

            <Place
              name="Sala Luís Fernando Veríssimo"
              photo={require('@assets/rooms/luis-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa, poltrona, cadeira e sofá."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Médicos,
             Psicólogos, Nutricionistas, Advogados, Contadores, Terapeutas Ocupacionais,
              Coach, entre outros profissionais."
            />

            <Place
              name="Sala Cora Coralina"
              photo={require('@assets/rooms/cora-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa de apoio e poltronas"
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Psicólogos, Terapeutas, entre outros profissionais."
            />

            <Place
              name="Sala Carolina de Jesus"
              photo={require('@assets/rooms/carolina-min.jpeg')}
              support="- Sala equipada com central de ar, telefone, mesa, poltrona,
             cadeiras, sofá, Smart TV de 29” e cabo HDMI disponível para conexão multimídia."
              com="- Acesso à internet e ligações ilimitadas."
              indication="- Sala excelente para atendimentos realizados por Médicos,
             Psicólogos, Nutricionistas, Advogados, Contadores, Engenheiros, Arquitetos,
              Terapeutas Ocupacionais, Cerimonialistas de Eventos, Fotógrafos, Decoradores,
               Coach, entre outros profissionais."
            />

            <Place
              name="Recepção"
              photo={require('@assets/rooms/recepcao-min.jpeg')}
              support="- Equipada com central de ar, telefone, cadeiras, recamier,
            Smart TV, som ambiente, dispensador de álcool líquido e um lindo lavabo."
              com="- Acesso à internet ilimitado."
              indication="- Solicite auxílio aos nossos recepcionistas para cópias e impressões,
             água, café, chocolate quente ou cappuccino, além de bombons e biscoitos."
            />

          </ScrollView>
        </View>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    height: '100%',
    width: '100%',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: scale(36),
  },
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
  },

});
