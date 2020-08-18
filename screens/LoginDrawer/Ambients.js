/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { verticalScale, scale } from 'react-native-size-matters';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import { GeneralStatusBar } from '@components';

import backgroundLogo from '@assets/LogoHorizontal.png';
import Spa from '@assets/spa.svg';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const widthImage = Dimensions.get('window').width * 0.9;
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

export default function Ambients({ navigation }) {
  const clarice = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
    // require('@assets/rooms/cecilia-min.jpeg'),
  ];

  const scrollRef = useRef();

  function handleScrollDown(size) {
    scrollRef.current.scrollTo({
      y: height * size,
      animated: true,
    });
  }

  function Slide({
    name, images, icons, goTo,
  }) {
    return (
      <View>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.text, { fontSize: scale(20) }]}>
            {name}
          </Text>
        </View>

        <SliderBox
          images={images}
          dotColor={colors.accentColor}
          paginationBoxVerticalPadding={20}
          ImageComponentStyle={{ borderRadius: 15, width: widthImage, marginTop: 5 }}
        />

        <View style={styles.iconContainer}>
          {icons.map((icon) => {
            if (icon === 'spa') {
              return <Spa width={scale(24)} height={scale(24)} />;
            }

            return (
              <FontAwesome5
                name={icon}
                size={scale(24)}
                color={colors.mainColor}
              />
            );
          })}

        </View>
        <View style={{ alignItems: 'center', marginTop: verticalScale(30) }}>
          <TouchableOpacity
            style={styles.knowMoreButton}
            onPress={() => { handleScrollDown(goTo); }}
          >
            <Text style={styles.text}>{goTo === 0 ? 'Início' : 'Mais salas'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          <View style={{ width: scale(32) }} />
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

        <View style={{ flex: 9 }}>
          <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: verticalScale(50) }}>

            <View style={{
              paddingLeft: 10, marginTop: verticalScale(20), height,
            }}
            >
              <>
                <Text style={styles.text}>Espaços privativos, sofisticados e confortáveis.</Text>
                <Text style={styles.text}>Acesso à internet e ligações ilimitadas.</Text>
                <Text style={styles.text}>Segurança e praticidade.</Text>
              </>
              <View style={{
                flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginBottom: verticalScale(180),
              }}
              >
                <TouchableOpacity
                  style={styles.knowMoreButton}
                  onPress={() => { handleScrollDown(1); }}
                >
                  <Text style={styles.text}>Saiba mais</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[0].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch',
                  'spa']}
                goTo={2}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[1].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch',
                ]}
                goTo={3}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[2].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch']}
                goTo={4}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[3].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch']}
                goTo={5}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[4].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch',
                  'tv',
                ]}
                goTo={6}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[5].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch',
                ]}
                goTo={7}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[6].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch',
                ]}
                goTo={8}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[7].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch',
                ]}
                goTo={9}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                name={ROOM_DATA[8].name}
                images={clarice}
                icons={[
                  'wifi',
                  'snowflake',
                  'phone',
                  'couch',
                  'tv',
                ]}
                goTo={0}
              />
            </View>

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
  knowMoreButton: {
    height: 50,
    width: 200,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#ccc',
    marginTop: verticalScale(14),
    paddingHorizontal: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: verticalScale(10),
  },

});
