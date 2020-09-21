import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';

import colors from '@constants/colors';

// eslint-disable-next-line react/prop-types
const ListEmpty = ({ label }) => (
  <View style={{
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  }}
  >
    <Text style={{
      fontFamily: 'Amaranth-Regular',
      fontSize: scale(18),
      color: colors.mainColor,
      textAlign: 'justify',
    }}
    >
      {label}
    </Text>
  </View>
);

export default ListEmpty;
