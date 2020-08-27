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
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { verticalScale, scale } from 'react-native-size-matters';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import { GeneralStatusBar } from '@components';

import backgroundLogo from '@assets/LogoHorizontal.png';
import Armchair from '@assets/svgs/armchair.svg';
import Spa from '@assets/svgs/spa.svg';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const widthImage = Dimensions.get('window').width * 0.9;
const height = Dimensions.get('window').height * 0.4;
const { width } = Dimensions.get('window');

export default function Ambients({ navigation }) {
  const clarice = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];

  const Slide = ({
    id, name, images, icons,
  }) => (
    <View key={id}>
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
          if (icon === 'armchair') {
            return <Armchair width={scale(24)} height={scale(24)} />;
          }

          return (
            <FontAwesome5
              name={icon}
              size={scale(24)}
              color={colors.secondaryColor}
            />
          );
        })}

      </View>
    </View>
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
          <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(20) }}>

            <View style={{
              paddingLeft: scale(5), marginVertical: verticalScale(20),
            }}
            >
              <Text style={styles.text}>
                Nossos ambientes foram elaborados para
                atender à sua necessidade.
              </Text>

              <View style={styles.iconAndText}>
                <View style={styles.headerIconContainer}>
                  <FontAwesome5
                    name="wifi"
                    size={scale(16)}
                    color={colors.mainColor}
                  />
                </View>
                <Text style={styles.text}>Internet ilimitada.</Text>
              </View>

              <View style={styles.iconAndText}>
                <View style={styles.headerIconContainer}>
                  <FontAwesome5
                    name="phone"
                    size={scale(16)}
                    color={colors.mainColor}
                  />
                </View>
                <Text style={styles.text}>Ligações ilimitadas.</Text>
              </View>

              <View style={styles.iconAndText}>
                <View style={styles.headerIconContainer}>
                  <FontAwesome5
                    name="snowflake"
                    size={scale(16)}
                    color={colors.mainColor}
                  />
                </View>
                <Text style={styles.text}>Salas climatizadas.</Text>
              </View>

              <View style={styles.iconAndText}>
                <View style={styles.headerIconContainer}>
                  <FontAwesome5
                    name="shield-alt"
                    size={scale(16)}
                    color={colors.mainColor}
                  />
                </View>
                <Text style={styles.text}>Segurança e praticidade.</Text>
              </View>

            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[0].room}
                name={ROOM_DATA[0].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                  'spa',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[1].room}
                name={ROOM_DATA[1].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[2].room}
                name={ROOM_DATA[2].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[3].room}
                name={ROOM_DATA[3].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[4].room}
                name={ROOM_DATA[4].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                  'tv',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[5].room}
                name={ROOM_DATA[5].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[6].room}
                name={ROOM_DATA[6].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[7].room}
                name={ROOM_DATA[7].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                id={ROOM_DATA[8].room}
                name={ROOM_DATA[8].name}
                images={clarice}
                icons={[
                  'snowflake',
                  'couch',
                  'armchair',
                  'tv',
                ]}
              />
            </View>

          </ScrollView>
        </View>

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
    flexShrink: 1,
  },

  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: { width: '10%', alignItems: 'center' },
  iconContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: verticalScale(10),
  },

});
