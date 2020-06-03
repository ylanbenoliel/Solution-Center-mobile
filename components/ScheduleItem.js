import React from 'react'
import { View, Text } from 'react-native'
import { Separator, StatusButton } from './index'
import { scale, verticalScale } from 'react-native-size-matters'

const ScheduleItem = ({ event, date, room, time, code }) => {

  return (
    <View
      key={event}
      style={{
        width: "100%",
        height: verticalScale(70),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/*  */}
      <View
        style={{
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            marginHorizontal: scale(10),
            color: colors.mainColor,
            fontSize: scale(22),
          }}
        >
          {time.split(':')[0]}h
        </Text>
      </View>

      <Separator vertical />

      <View
        style={{
          flex: 1,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusButton
          code={code}
          onCheckIn={() => reserveRoom(room, date, time)}
          onDismiss={() => dismissRoom(event)}
        />
      </View>
    </View>
  );
};

const ScheduleItemMemoized = React.memo(ScheduleItem)

export default ScheduleItemMemoized