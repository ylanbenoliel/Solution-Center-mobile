/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import {
  GeneralStatusBar,
  UserEventsModal,
  UserMessagesModal,
  UserLogModal,
} from '@components';

import AuthContext from '@contexts/auth';

import { api } from '@services/api';

import icon from '@assets/icon.png';
import Logo from '@assets/logo-solution-azul.svg';

import colors from '@constants/colors';

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
    <Feather
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
    <Feather
      name="chevron-right"
      size={28}
      color={colors.navigationColor}
    />
  </TouchableOpacity>
);

const Profile = ({ navigation, menu }) => {
  const { signOut } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isModalEventOpen, setIsModalEventOpen] = useState(false);
  const [isModalLogOpen, setIsModalLogOpen] = useState(false);
  const [isModalMessageOpen, setIsModalMessageOpen] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  function fetchInfo() {
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
  }

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
              routes: [{ name: 'Login' }],
            }),
          );
        },
      }]));
  }

  function handleShowEvents() {
    setIsModalEventOpen(true);
  }

  function handleShowMessages() {
    setIsModalMessageOpen(true);
  }
  function handleShowLogs() {
    setIsModalLogOpen(true);
  }

  function handleOpenInfoStack() {
    navigation.navigate('Info', { details: userInfo, photo: avatarUrl });
  }

  function handleCloseModal(func) {
    return func(false);
  }

  const RenderInfo = () => {
    const imageSize = 130;
    if (userInfo) {
      return (
        <>
          <Image
            source={avatarUrl}
            style={{
              width: scale(imageSize),
              height: scale(imageSize),
              borderRadius: scale(imageSize / 2),
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
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: scale(imageSize),
        height: scale(imageSize),
      }}
      >
        <ActivityIndicator size="large" color={colors.mainColor} />
        <Text style={[styles.text, { fontSize: 24 }]}>
          Carregando...
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eee' }}>
      <GeneralStatusBar
        backgroundColor="white"
        barStyle="dark-content"
      />

      <ImageBackground
        source={require('@assets/mapa-fundo.png')}
        style={{ width: '100%', height: '50%' }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 16,
        }}
        >
          {menu ? (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Feather
                name="menu"
                size={scale(32)}
                color={colors.navigationColor}
              />
            </TouchableOpacity>
          ) : (<View style={{ width: scale(32) }} />)}

          <View style={styles.logoContainer}>
            <Logo width={200} height={45} />
          </View>

          <View style={{ width: scale(32) }} />
        </View>

        {/*  */}

        <View style={{ alignItems: 'center' }}>
          <View style={styles.userView}>

            <RenderInfo />

            <View style={{ width: '100%', alignItems: 'center' }}>

              <UserOptions
                leftIcon="user"
                description="Editar meu perfil"
                onClick={() => handleOpenInfoStack()}
              />
              <UserOptions
                leftIcon="book-open"
                description="Minhas reservas"
                onClick={() => handleShowEvents()}
              />
              <UserOptions
                leftIcon="bell"
                last={menu}
                description="Minhas notificações"
                onClick={() => { handleShowMessages(); }}
              />
              {!menu
              && (
              <UserOptions
                last
                leftIcon="settings"
                description="Registros do sistema"
                onClick={() => { handleShowLogs(); }}
              />
              )}

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
        onClose={() => handleCloseModal(setIsModalEventOpen)}
      />

      <UserMessagesModal
        isVisible={isModalMessageOpen}
        onClose={() => handleCloseModal(setIsModalMessageOpen)}
      />

      <UserLogModal
        isVisible={isModalLogOpen}
        onClose={() => handleCloseModal(setIsModalLogOpen)}
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
    marginTop: verticalScale(14),
    paddingHorizontal: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
