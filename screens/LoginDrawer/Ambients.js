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
import Chair from '@assets/svgs/chair.svg';
import Spa from '@assets/svgs/spa.svg';

import colors from '@constants/colors';
import { ROOM_DATA } from '@constants/fixedValues';

const widthImage = Dimensions.get('window').width * 0.9;
const height = Dimensions.get('window').height * 0.5;
const { width } = Dimensions.get('window');

export default function Ambients({ navigation }) {
  const clarice = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const carlos = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const cecilia = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const rui = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const machado = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const monteiro = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const luis = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const cora = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];
  const carolina = [
    require('@assets/rooms/clarice-min.jpeg'),
    require('@assets/rooms/carlos-min.jpeg'),
  ];

  const Slide = ({
    name, images, icons,
  }) => (
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
          if (icon === 'armchair') {
            return <Armchair width={scale(24)} height={scale(24)} />;
          }
          if (icon === 'chair') {
            return <Chair width={scale(24)} height={scale(24)} fill={colors.secondaryColor} />;
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

  const Description = ({ text, icon }) => (

    <View style={styles.iconAndText}>
      <View style={styles.headerIconContainer}>
        <FontAwesome5
          name={icon}
          size={scale(16)}
          color={colors.mainColor}
        />
      </View>
      <Text style={styles.text}>{text}</Text>
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
              marginHorizontal: verticalScale(16),
              marginBottom: verticalScale(20),
            }}
            >
              <Text style={styles.text}>
                Nossos ambientes foram elaborados para
                atender à sua necessidade.
                Todas as salas possuem:
                {'\n'}
              </Text>

              <Description text="Internet ilimitada." icon="wifi" />
              <Description text="Ligações ilimitadas." icon="phone" />
              <Description text="Salas climatizadas." icon="snowflake" />
              <Description text="Segurança e praticidade." icon="shield-alt" />

            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[0].room}
                name={ROOM_DATA[0].name}
                images={clarice}
                icons={[
                  'spa',
                  'armchair',
                  'chair',
                  'chair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[1].room}
                name={ROOM_DATA[1].name}
                images={carlos}
                icons={[
                  'couch',
                  'armchair',
                  'chair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[2].room}
                name={ROOM_DATA[2].name}
                images={cecilia}
                icons={[
                  'armchair',
                  'couch',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[3].room}
                name={ROOM_DATA[3].name}
                images={rui}
                icons={[
                  'couch',
                  'armchair',
                  'chair',
                  'chair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[4].room}
                name={ROOM_DATA[4].name}
                images={machado}
                icons={[
                  'couch',
                  'armchair',
                  'chair',
                  'chair',
                  'tv',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[5].room}
                name={ROOM_DATA[5].name}
                images={monteiro}
                icons={[
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[6].room}
                name={ROOM_DATA[6].name}
                images={luis}
                icons={[
                  'couch',
                  'armchair',
                  'chair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[7].room}
                name={ROOM_DATA[7].name}
                images={cora}
                icons={[
                  'couch',
                  'armchair',
                ]}
              />
            </View>

            <View style={{ width, height }}>
              <Slide
                key={ROOM_DATA[8].room}
                name={ROOM_DATA[8].name}
                images={carolina}
                icons={[
                  'spa',
                  'armchair',
                  'chair',
                  'chair',
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
