import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import colors from "../constants/colors";
import moment from "moment";

const ROOM_DATA = [
  { id: 1, name: "Sala 1" },
  { id: 2, name: "Sala 2" },
  { id: 3, name: "Sala 3" },
  { id: 4, name: "Sala 4" },
  { id: 5, name: "Sala 5" },
  { id: 6, name: "Sala 6" },
  { id: 7, name: "Sala 7" },
  { id: 8, name: "Sala 8" },
  { id: 9, name: "Sala 9" },
  { id: 10, name: "Sala de reunião" }
];

export default function Schedule() {
  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(4, "days")
    }
  ];
  let datesBlacklist = [moment().add(6, "days")];

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
        onPress={() => {}}
      >
        <Text style={{ margin: 5, fontSize: 24, color: colors.mainColor }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.secondaryColor }}>
        <View style={styles.container}>
          <CalendarStrip
            calendarAnimation={{ type: "sequence", duration: 30 }}
            daySelectionAnimation={{
              type: "border",
              duration: 200,
              borderWidth: 1,
              borderHighlightColor: colors.accentColor
            }}
            style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
            calendarHeaderStyle={{ color: "white" }}
            calendarColor={colors.secondaryColor}
            dateNumberStyle={{ color: "white" }}
            dateNameStyle={{ color: "white" }}
            highlightDateNumberStyle={{ color: colors.whiteColor }}
            highlightDateNameStyle={{ color: colors.whiteColor }}
            disabledDateNameStyle={{ color: colors.disableColor }}
            disabledDateNumberStyle={{ color: colors.disableColor }}
            iconContainer={{ flex: 0.1 }}
            datesBlacklist={datesBlacklist}
            datesWhitelist={datesWhitelist}
            // iconLeft={<Icon name="chevron-left" />}
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
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Room {...item} />}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: "10%" }
});
