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
  Linking,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';

// eslint-disable-next-line import/no-extraneous-dependencies
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GeneralStatusBar } from '@components';

import backgroundLogo from '@assets/LogoHorizontal.png';

import colors from '@constants/colors';

const ICON_SIZE = scale(24);

const Separator = () => <View style={{ marginVertical: scale(8) }} />;

export default function Contact({ navigation }) {
  function openWpp(phone) {
    const wppNumber = `+55${phone}`;
    Linking.openURL(`https://wa.me/${wppNumber}`);
  }

  function openInstagram() {
    Linking.openURL('instagram://user?username=solutioncenterbelem');
  }

  function openMaps() {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${-1.4405587},${-48.4647}`;
    const label = 'Solution Center Belém';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  }

  function openSite() {
    Linking.openURL('https://www.solutioncenterbelem.com/');
  }

  const WppPhone = ({ phone }) => (
    <TouchableOpacity
      style={styles.clickableArea}
      onPress={() => openWpp(phone)}
    >
      <Text style={[styles.text, styles.clickableText]}>{phone}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <Text style={[styles.text, styles.headerName]}>Contato</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <MaterialCommunityIcons
              name="close"
              size={scale(32)}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>
        {/*  */}
        <View style={styles.contactContainer}>
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={ICON_SIZE}
              color={colors.mainColor}
            />
            <View style={styles.whatsappNumbers}>
              <WppPhone phone="(91) 99118-8681" />
              <WppPhone phone="(91) 98131-9689" />
              <WppPhone phone="(91) 98252-0417" />
            </View>
          </View>
          {/*  */}
          <Separator />
          {/*  */}
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="instagram"
              size={ICON_SIZE}
              color={colors.mainColor}
            />
            <TouchableOpacity
              style={styles.clickableArea}
              onPress={() => {
                openInstagram();
              }}
            >
              <Text
                style={[
                  styles.text,
                  styles.clickableText,
                  { marginLeft: verticalScale(20) },
                ]}
              >
                @solutioncenterbelem
              </Text>
            </TouchableOpacity>
          </View>
          {/*  */}
          <Separator />
          {/*  */}
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="email"
              size={ICON_SIZE}
              color={colors.mainColor}
            />
            <Text style={[styles.text, { marginLeft: verticalScale(20) }]}>
              contato@solutioncenterbelem.com
            </Text>
          </View>
          {/*  */}
          <Separator />
          {/*  */}
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="web"
              size={ICON_SIZE}
              color={colors.mainColor}
            />
            <TouchableOpacity
              style={styles.clickableArea}
              onPress={() => {
                openSite();
              }}
            >
              <Text
                style={[
                  styles.text,
                  styles.clickableText,
                  { marginLeft: verticalScale(20) },
                ]}
              >
                www.solutioncenterbelem.com
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*  */}
        <Separator />
        {/*  */}
        <ScrollView style={styles.localizationScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.localizationContainer}>
            <Text style={[styles.text, styles.headerName]}>Localização</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.text}>
                {'\t\t'}
                Localização privilegiada, bairro central e próximo a
                grandes avenidas. Temos estacionamento rotativo, com entrada
                pela Tv. Humaitá.
              </Text>
            </View>
            {/*  */}
            <View style={{ width: '100%' }}>
              <View style={styles.localizationContent}>
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={ICON_SIZE}
                  color={colors.mainColor}
                />
                <TouchableOpacity onPress={() => openMaps()}>
                  <Text style={[styles.text, styles.clickableText]}>
                    Av. Rômulo Maiorana, nº 700,
                    {'\n'}
                    Ed. Vitta Office, Sala
                    1414
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Separator />
            <Image
              source={require('@assets/Maps.jpeg')}
              resizeMode="stretch"
              style={{ width: scale(300), height: verticalScale(200) }}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    height: '100%',
    width: '100%',
  },
  header: {
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
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
    textAlign: 'justify',
  },
  clickableArea: {
    padding: scale(2),
  },
  clickableText: {
    color: colors.accentColor,
  },
  contactContainer: {
    flex: 1,
    paddingLeft: scale(15),
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappNumbers: {
    marginLeft: scale(20),
    height: verticalScale(70),
    justifyContent: 'space-between',
  },

  localizationScrollView: {
    flex: 2,
    marginTop: verticalScale(-130),
    marginBottom: verticalScale(50),
  },
  localizationContainer: {
    flex: 2,
    alignItems: 'center',
    marginHorizontal: scale(20),
    // marginVertical: verticalScale(10),
  },
  localizationContent: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 0,
    marginTop: verticalScale(10),
  },
});
