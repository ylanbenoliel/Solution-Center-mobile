import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import colors from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

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
      <View
        style={{
          width: "40%",
          height: "50%",
          backgroundColor: colors.whiteColor,
          alignItems: "flex-start",
          justifyContent: "flex-end",
          paddingLeft: 10,
          paddingBottom: 10,
          margin: 10
        }}
      >
        <Text style={{ fontSize: 20, color: colors.mainColor }}>{name}</Text>
      </View>
    );
  };

  const Icon = ({ name }) => {
    return (
      <MaterialIcons name={name} size={16} color={colors.navigationColor} />
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
            flex: 2,
            backgroundColor: colors.mainColor,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            alignItems: "center"
          }}
        >
          <View style={{ marginTop: 60 }}>
            <ScrollView showsHorizontalScrollIndicator={false}>
              <Room name="Sala 1" />
              <Room name="Sala 2" />
              <Room name="Sala 3" />
              <Room name="Sala 4" />
              <Room name="Sala 5" />
              <Room name="Sala 6" />
              <Room name="Sala 7" />
              <Room name="Sala 8" />
              <Room name="Sala 9" />
              <Room name="Sala de reunião" />
            </ScrollView>
          </View>

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 150,
                height: 40,
                borderRadius: 4,
                backgroundColor: colors.navigationColor
              }}
            >
              <Text style={{ fontSize: 32, color: colors.whiteColor }}>
                Horários
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: "10%" }
});
