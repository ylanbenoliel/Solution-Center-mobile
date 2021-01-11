/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import React from 'react';
import {
  View, Image, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import { Feather } from '@expo/vector-icons';

import colors from '@constants/colors';

const UserItem = ({
  listname, avatarUrl, active, onClick,
}) => {
  const avatarImageUrl = avatarUrl
    ? { uri: `${avatarUrl}` }
    : require('@assets/icon.png');

  return (
    <TouchableOpacity onPress={() => onClick()}>
      <View style={styles.container}>
        <Image source={avatarImageUrl} style={styles.avatarImage} />
        <View style={styles.textAndIconContainer}>
          <Text style={styles.userName}>{listname}</Text>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={styles.userName}>Status</Text>

            {active
              ? (<Feather name="check" size={scale(20)} color={colors.accentColor} />)
              : (<Feather name="x" size={scale(20)} color={colors.errorColor} />)}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(5),
    marginVertical: verticalScale(5),
    borderWidth: scale(2),
    borderRadius: scale(16),
    borderColor: colors.mainColor,
  },
  textAndIconContainer: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    marginLeft: scale(15),
    fontFamily: 'Amaranth-Regular',
    fontSize: scale(16),
    color: colors.mainColor,
  },
  avatarImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
  },
});

export default UserItem;
