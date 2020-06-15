import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import colors from '@constants/colors'
import { scale } from 'react-native-size-matters'


const Loading = ({ loading }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={scale(100)} color={colors.mainColor} />
      </View>

    )
  }
  else {
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    height: scale(100),
    width: scale(100),
    borderRadius:scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor
  }
})

export default Loading