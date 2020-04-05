import React, { useState, useEffect, createRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import BottomSheet from "reanimated-bottom-sheet";
import { Separator, StatusButton } from "../components";
import colors from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { ROOM_SCHEDULE, ROOM_DATA } from "../constants/fixedValues";
import moment from "moment";

export default function Schedule() {
  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(5, "days")
    }
  ];
  let datesBlacklist = [moment().add(6, "days")];

  const [scheduleList, setScheduleList] = useState(ROOM_SCHEDULE);

  function changeReserve(id) {
    const newSchedule = scheduleList.map(item => {
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
        style={{
          width: "45%",
          height: 120,
          backgroundColor: colors.whiteColor,
          alignItems: "flex-start",
          justifyContent: "flex-end",
          margin: 10
        }}
        onPress={() => {
          bottomSheetRef.current.snapTo(1);
        }}
      >
        <Text style={{ margin: 5, fontSize: 24, color: colors.mainColor }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const Schedule = ({ id, hour, code }) => {
    return (
      <View
        key={id}
        style={{
          width: "100%",
          height: 70,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        {/*  */}
        <View
          style={{
            height: "100%",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              marginHorizontal: 10,
              color: colors.mainColor,
              fontSize: 22
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
            justifyContent: "center"
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
          keyExtractor={item => item.id.toString()}
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
          height: "100%"
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
      <View style={{ flex: 1, backgroundColor: colors.secondaryColor }}>
        <View style={styles.container}>
          <CalendarStrip
            calendarAnimation={{ type: "sequence", duration: 30 }}
            daySelectionAnimation={{
              type: "border",
              duration: 200,
              borderWidth: 3,
              borderHighlightColor: colors.accentColor
            }}
            style={{ height: 100, margin: "3%" }}
            calendarHeaderStyle={{ color: "white" }}
            calendarColor={colors.secondaryColor}
            dateNumberStyle={{ color: "white" }}
            dateNameStyle={{ color: "white" }}
            highlightDateNumberStyle={{
              color: colors.whiteColor
            }}
            highlightDateNameStyle={{ color: colors.whiteColor }}
            disabledDateNameStyle={{ color: colors.disableColor }}
            disabledDateNumberStyle={{ color: colors.disableColor }}
            iconContainer={{ flex: 0.1 }}
            datesBlacklist={datesBlacklist}
            datesWhitelist={datesWhitelist}
            // iconLeft={}
            // iconRight={<Icon name="chevron-right" />}
          />
        </View>

        <View
          style={{
            flex: 4,
            backgroundColor: colors.mainColor,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            alignItems: "center"
          }}
        >
          <Text
            style={{ fontSize: 24, color: colors.whiteColor, marginTop: 5 }}
          >
            Selecione a sala
          </Text>

          <View style={{ flex: 1, marginTop: 10, width: "100%" }}>
            <FlatList
              data={ROOM_DATA}
              numColumns={2}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => <Room {...item} />}
            />
          </View>

          <BSheet />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: "10%" },
  // box: {
  //   width: 200,
  //   height: 200
  // },
  // panelContainer: {
  //   position: "absolute",
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0
  // },
  panel:
    //bottomsheet
    {
      height: 72 * 14,
      padding: 10,
      backgroundColor: colors.whiteColor,
      paddingTop: 20,
      marginBottom: -5
    },
  header: {
    width: "100%",
    height: 50,
    paddingTop: 10,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  panelHeader: {
    alignItems: "center"
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.disableColor,
    marginBottom: 10
  },
  panelTitle: {
    fontSize: 24,
    width: 100,
    color: colors.disableColor
  },
  // panelSubtitle: {
  //   fontSize: 14,
  //   color: "gray",
  //   height: 30,
  //   marginBottom: 10
  // },

  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white"
  },
  photo: {
    width: "100%",
    height: 225,
    marginTop: 30
  }
});
