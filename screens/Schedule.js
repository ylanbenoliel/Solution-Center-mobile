import React, { useState, useEffect, createRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import BottomSheet from "reanimated-bottom-sheet";
import { Separator, StatusButton, GeneralStatusBar } from "../components";
import colors from "../constants/colors";
import { ROOM_SCHEDULE, ROOM_DATA } from "../constants/fixedValues";
import { scale, verticalScale } from "react-native-size-matters";

import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

export default function Schedule() {
  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(5, "days"),
    },
  ];
  let datesBlacklist = [moment().add(6, "days")];

  const [scheduleList, setScheduleList] = useState(ROOM_SCHEDULE);

  function changeReserve(id) {
    const newSchedule = scheduleList.map((item) => {
      if (item.id === id) {
        item.code === 2 ? (item.code = 1) : (item.code = 2);
      }
      return item;
    });
    setScheduleList(newSchedule);
  }

  const Room = ({ name }) => {
    return (
      <TouchableOpacity
        style={styles.roomButton}
        onPress={() => {
          bottomSheetRef.current.snapTo(1);
        }}
      >
        <Text style={[styles.text, styles.roomText]}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const Schedule = ({ id, hour, code }) => {
    return (
      <View
        key={id}
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
            {hour}h
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
          <StatusButton code={code} onChange={() => changeReserve(id)} />
        </View>
      </View>
    );
  };

  // Start of BottomSheet
  const bottomSheetRef = createRef();

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle}>
            {/* <Text ref={roomTitle} style={styles.panelTitle}></Text> */}
          </View>
        </View>
      </View>
    );
  }

  function renderInner() {
    return (
      <View style={styles.panel}>
        <FlatList
          data={scheduleList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return <Schedule {...item} />;
          }}
        />
      </View>
    );
  }

  const BSheet = () => {
    return (
      <View
        style={{
          flex: 0.01,
          width: "100%",
          height: "100%",
        }}
      >
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["75%", "50%", "0%"]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={2}
        />
      </View>
    );
  };
  // End of BottomSheet

  return (
    <>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <LinearGradient
        colors={[colors.mainColor, colors.secondaryColor]}
        style={{ flex: 1 }}
      >
        <View style={styles.calendarContainer}>
          <View style={styles.container}>
            <CalendarStrip
              calendarAnimation={{ type: "sequence", duration: 30 }}
              daySelectionAnimation={{
                type: "border",
                duration: 100,
                borderWidth: 3,
                borderHighlightColor: colors.accentColor,
              }}
              style={styles.calendarStyle}
              calendarHeaderStyle={styles.text}
              dateNumberStyle={styles.dateStyle}
              dateNameStyle={styles.dateStyle}
              highlightDateNumberStyle={styles.highlightDateStyle}
              highlightDateNameStyle={styles.highlightDateStyle}
              disabledDateNameStyle={styles.disabledDateStyle}
              disabledDateNumberStyle={styles.disabledDateStyle}
              iconContainer={{ flex: 0.1 }}
              datesBlacklist={datesBlacklist}
              datesWhitelist={datesWhitelist}
              // iconLeft={}
              // iconRight={<Icon name="chevron-right" />}
            />
          </View>

          <View style={styles.roomsContainer}>
            <Text style={[styles.text, styles.selectRoomText]}>
              Selecione a sala
            </Text>

            <View style={styles.flatListContainer}>
              <FlatList
                data={ROOM_DATA}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Room {...item} />}
              />
            </View>

            <BSheet />
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
  },
  calendarContainer: {
    flex: 2,
  },
  roomsContainer: {
    flex: 4,
    alignItems: "center",
  },
  roomButton: {
    width: "45%",
    height: verticalScale(120),
    alignItems: "flex-start",
    justifyContent: "flex-end",
    backgroundColor: colors.whiteColor,
    borderRadius: scale(16),
    margin: scale(10),
  },
  roomText: {
    margin: scale(5),
    fontSize: scale(18),
    color: colors.mainColor,
  },
  text: {
    fontFamily: "Amaranth-Regular",
    fontSize: scale(16),
    color: colors.whiteColor,
  },
  panel:
    //bottomsheet
    {
      height: verticalScale(72 * 14),
      padding: scale(10),
      backgroundColor: colors.whiteColor,
      paddingTop: verticalScale(20),
      marginBottom: -5,
    },
  header: {
    width: "100%",
    height: verticalScale(50),
    paddingTop: verticalScale(10),
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: scale(16),
    borderTopRightRadius: scale(16),
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: scale(40),
    height: verticalScale(8),
    borderRadius: scale(4),
    backgroundColor: colors.disableColor,
    marginBottom: verticalScale(10),
  },
  panelTitle: {
    fontSize: scale(24),
    width: scale(100),
    color: colors.disableColor,
  },
  calendarStyle: { height: verticalScale(100), margin: "3%" },
  dateStyle: {
    color: colors.whiteColor,
    fontFamily: "Amaranth-Regular",
  },
  highlightDateStyle: {
    color: colors.whiteColor,
  },
  disabledDateStyle: {
    color: colors.disableColor,
  },
  selectRoomText: {
    color: colors.whiteColor,
    fontSize: 24,
    marginTop: 5,
  },
  flatListContainer: {
    flex: 1,
    width: "95%",
    justifyContent: "center",
    marginTop: verticalScale(10),
  },
});
