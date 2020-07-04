/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scale, verticalScale } from 'react-native-size-matters';

import { FontAwesome5 } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { GeneralStatusBar } from '@components';

import AuthContext from '@contexts/auth';

import { api } from '@services/api';

import icon from '@assets/icon.png';
import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

import UserEventsModal from '../components/UserEventsModal';

// eslint-disable-next-line no-undef
const UserProfile = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [eventList, setEventList] = useState(null);
  const [isModalEventOpen, setIsModalEventOpen] = useState(false);

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

  function handleSignOut() {
    return (
      Alert.alert('', 'Deseja sair da conta?', [{
        text:
        'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => {
          signOut();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginDrawer' }],
            }),
          );
        },
      }]));
  }

  function fetchEvents() {
    api.get('/events/list/user').then((res) => {
      setEventList(res.data);
    })
      .catch((err) => { })
      .finally(() => {
        setIsModalEventOpen(true);
      });
  }

  function handleCloseModal(func) {
    return func(false);
  }

  const RenderInfo = () => {
    if (userInfo) {
      return (
        <>
          <Image
            source={avatarUrl}
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

  const UserOptions = ({
    leftIcon, description, last, onClick,
  }) => (
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
      onPress={() => onClick()}
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
          <View style={styles.userView}>

            <RenderInfo />

            <View style={{
              width: '100%',
              alignItems: 'center',
            }}
            >

              <UserOptions
                leftIcon="user-alt"
                description="Editar meu perfil"
                onClick={() => {}}
              />
              <UserOptions
                leftIcon="book-open"
                description="Minhas reservas"
                onClick={() => fetchEvents()}
              />
              <UserOptions
                last
                leftIcon="coins"
                description="Meus planos"
                onClick={() => {}}
              />

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={() => { handleSignOut(); }}
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
      <UserEventsModal
        isVisible={isModalEventOpen}
        events={eventList}
        onClose={() => handleCloseModal(setIsModalEventOpen)}

      />

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
  userView: {
    alignItems: 'center',
    width: '80%',
    paddingVertical: verticalScale(20),
    backgroundColor: 'white',
    borderRadius: 20,
  },
  signOutButton: {
    height: 50,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#ccc',
    marginTop: verticalScale(10),
    paddingHorizontal: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserProfile;
