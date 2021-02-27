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
import { CommonActions, useNavigation } from '@react-navigation/native';

import {
  GeneralStatusBar,
  UserEventsModal,
  UserMessagesModal,
  UserLogModal,
  SnackBar,
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

const Profile = ({ admin }) => {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({});
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userHasPhoto, setUserHasPhoto] = useState(false);
  const [isModalEventOpen, setIsModalEventOpen] = useState(false);
  const [isModalLogOpen, setIsModalLogOpen] = useState(false);
  const [isModalMessageOpen, setIsModalMessageOpen] = useState(false);

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [snackColor, setSnackColor] = useState('');

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setVisibleSnack(false);
    }, 2000);
  }, [visibleSnack === true]);

  function fetchInfo() {
    api.get('/user/details')
      .then((res) => {
        const user = { ...res.data[0] };
        if (user.avatar) {
          setAvatarUrl({ uri: `${user.avatar.url}` });
          setUserHasPhoto(true);
        } else {
          setAvatarUrl(icon);
        }
        setUserInfo(user);
      })
      .catch((e) => {
        setUserInfo(null);
        setSnackColor(colors.errorColor);
        if (String(e.response.status).includes('5')) {
          setSnackText('Erro, tente novamente em alguns minutos.');
          setVisibleSnack(true);
          return;
        }
        if (e.response.data) {
          setSnackText(`${e.response.data.message}`);
          setVisibleSnack(true);
          return;
        }
        if (e.request) {
          setSnackText('Erro na conexão.');
          setVisibleSnack(true);
          return;
        }
        setSnackText('Algo deu errado.');
        setVisibleSnack(true);
      });
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
    if (!userInfo) {
      return;
    }
    setIsModalEventOpen(true);
  }

  function handleShowMessages() {
    if (!userInfo) {
      return;
    }
    setIsModalMessageOpen(true);
  }
  function handleShowLogs() {
    if (!userInfo) {
      return;
    }
    setIsModalLogOpen(true);
  }

  function handleOpenInfoStack() {
    if (!userInfo) {
      return;
    }
    navigation.push('Info', { details: userInfo, photo: userHasPhoto ? avatarUrl : null });
  }

  function handleCloseModal(func) {
    return func(false);
  }

  const RenderInfo = () => {
    const imageSize = 130;
    if (userInfo?.id) {
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
            {userInfo?.listname}
          </Text>
        </>
      );
    }
    if (!userInfo) {
      return (
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: scale(imageSize),
          height: scale(imageSize),
        }}
        >
          <Text style={[styles.text, { fontSize: 24 }]}>
            Erro.
          </Text>
        </View>
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
    <>
      <GeneralStatusBar
        backgroundColor={colors.whiteColor}
        barStyle="dark-content"
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteColor }}>

        <ImageBackground
          source={require('@assets/mapa-fundo.png')}
          style={{ width: '100%', height: '60%', marginTop: -10 }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: scale(20),
          }}
          >
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Feather
                name="menu"
                size={scale(32)}
                color={colors.navigationColor}
              />
            </TouchableOpacity>

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
                  last={!admin}
                  description="Minhas notificações"
                  onClick={() => { handleShowMessages(); }}
                />
                {admin && (
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
        <SnackBar visible={visibleSnack} text={snackText} color={snackColor} />
      </SafeAreaView>
    </>
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
    width: '85%',
    paddingVertical: verticalScale(20),
    backgroundColor: 'white',
    borderRadius: 20,
  },
  signOutButton: {
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#ccc',
    marginTop: verticalScale(14),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
