/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scale, verticalScale } from 'react-native-size-matters';

import { FontAwesome5 } from '@expo/vector-icons';

import { GeneralStatusBar } from '@components';

import { api } from '@services/api';

import icon from '@assets/icon.png';
import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

// eslint-disable-next-line no-undef
const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  useEffect(() => {
    api.get('/user/details')
      .then((res) => {
        const user = { ...res.data[0] };
        if (user.avatar) {
          setAvatarUrl({ uri: `${user.avatar.url}` });
        } else {
          setAvatarUrl(icon);
        }
        setUserInfo(user);
      })
      .catch(() => {});
    return () => {
      setAvatarUrl(null);
      setUserInfo(null);
    };
  }, []);

  const RenderInfo = () => {
    if (userInfo) {
      return (
        <>
          <Image
            source={avatarUrl}
            resizeMode="cover"
            style={{
              width: scale(130),
              height: scale(130),
              borderRadius: scale(10),
            }}
          />
          <Text
            style={[styles.text, { fontSize: scale(32) }]}
          >
            {userInfo.name}
          </Text>
        </>
      );
    }
    return null;
  };

  const UserOptions = ({ leftIcon, description, last }) => (

    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        borderTopWidth: 2,
        borderBottomWidth: last === true ? 2 : 0,
        borderColor: '#ccc',
        paddingVertical: verticalScale(10),
      }}
    >
      <FontAwesome5
        name={leftIcon}
        size={28}
        color={colors.navigationColor}
      />
      <Text
        style={[styles.text,
          {
            flex: 1,
            color: colors.navigationColor,
            textAlign: 'center',
          }]}
      >
        {description}
      </Text>
      <FontAwesome5
        name="chevron-right"
        size={28}
        color={colors.navigationColor}
      />
    </TouchableOpacity>
  );

  return (

    <SafeAreaView style={{ flex: 1 }}>

      <GeneralStatusBar
        backgroundColor="white"
        barStyle="dark-content"
      />

      <ImageBackground
        source={require('@assets/mapa-fundo.png')}
        style={{ width: '100%', height: '50%' }}
      >
        <View style={styles.logoContainer}>
          <Logo width={200} height={45} />
        </View>
        {/*  */}

        <View style={{
          alignItems: 'center',
        }}
        >
          <View style={{
            alignItems: 'center',
            width: '80%',
            paddingVertical: verticalScale(20),
            backgroundColor: 'white',
            borderRadius: 20,
          }}
          >

            <RenderInfo />

            <View style={{
              width: '100%',
              alignItems: 'center',
            }}
            >

              <UserOptions leftIcon="user-alt" description="Editar meu perfil" />
              <UserOptions leftIcon="book-open" description="Minhas reservas" />
              <UserOptions leftIcon="coins" description="Meus planos" last />

              <TouchableOpacity style={{
                height: 50,
                borderWidth: 2,
                borderRadius: 4,
                borderColor: '#ccc',
                marginTop: verticalScale(10),
                paddingHorizontal: scale(30),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              >
                <Text
                  style={[styles.text, { color: colors.disableColor }]}
                >
                  Sair da conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/*  */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
});

export default UserProfile;
