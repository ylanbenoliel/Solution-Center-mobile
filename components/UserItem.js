/* eslint-disable global-require */
import React from 'react';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import colors from '@constants/colors';

// eslint-disable-next-line react/prop-types
const UserItem = ({ name, avatar }) => {
  const avatarUrl = avatar
    ? { uri: `${avatar}` }
    : require('@assets/icon.png');

  return (
    <View style={styles.container}>
      <Image source={avatarUrl} style={styles.avatarImage} />
      <Text style={styles.userName}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(5),
    marginVertical: verticalScale(10),
    borderWidth: scale(2),
    borderRadius: scale(16),
    borderColor: colors.mainColor,
  },
  userName: {
    marginLeft: scale(10),
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: 'left',
  },
  avatarImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(16),
  },
});

export default UserItem;
