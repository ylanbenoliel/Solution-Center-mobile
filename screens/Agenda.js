import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { eachWeekendOfMonth, parseISO, isSunday, format } from "date-fns";

import colors from "../constants/colors";
import { ALL_SCHEDULE_TABLE } from "../constants/fixedValues";
import { GeneralStatusBar, VacancyModal } from "../components";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";

/* <Text style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {sundays[0] + sundays[1]}
      </Text> */

export default function Agenda({ navigation }) {
  const [daySelected, setDaySelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sundays, setSundays] = useState([]);
  const [hours, setHours] = useState([]);
  const [users, setUsers] = useState({});

  function disableSundays(date) {
    const month = parseISO(date);
    const weekends = eachWeekendOfMonth(month);
    const sundaysInMonth = weekends
      .filter((day) => {
        let sunday = isSunday(day);
        return sunday;
      })
      .map((day) => {
        let result = format(day, "yyyy-MM-dd");
        return result;
      });
    setSundays(sundaysInMonth);
  }

  useEffect(() => {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    setDaySelected(currentDate);
    disableSundays(currentDate);
  }, []);

  function handleDayPress(day) {
    setDaySelected(day);
  }

  function handleOpenModal() {
    const data = ALL_SCHEDULE_TABLE;
    const users = data.names;
    const hours = data.hours;

    setIsModalOpen(true);
    setUsers(users);
    setHours(hours);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <LinearGradient
        colors={[colors.mainColor, colors.secondaryColor]}
        style={{ flex: 1 }}
      >
        <GeneralStatusBar
          backgroundColor={colors.mainColor}
          barStyle="light-content"
        />

        <View
          style={{
            flex: 1,
            marginVertical: verticalScale(70),
          }}
        >
          <Calendar
            markingType={"custom"}
            onMonthChange={(date) => {
              // disableSundays(date.dateString);
            }}
            minDate={"2020-03-19"}
            maxDate={"2020-05-30"}
            monthFormat={"MMMM yyyy"}
            current={daySelected}
            onDayPress={(date) => handleDayPress(date.dateString)}
            hideExtraDays
            markedDates={{
              // [sundays]: { disabled: true, disableTouchEvent: true },
              [daySelected]: {
                disabled: false,
                disableTouchEvent: false,
                customStyles: {
                  container: {
                    backgroundColor: colors.accentColor,
                  },
                  text: {
                    color: colors.whiteColor,
                    fontWeight: "bold",
                  },
                },
              },
            }}
            style={{
              height: 500,
            }}
            theme={{
              calendarBackground: "rgba(0,0,0,0)",
              //   selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: colors.whiteColor,
              todayTextColor: colors.accentColor,
              dayTextColor: colors.whiteColor,
              textDisabledColor: colors.disableColor,
              arrowColor: colors.navigationColor,
              disabledArrowColor: colors.disableColor,
              monthTextColor: colors.whiteColor,
              //   indicatorColor: "blue",
              textDayFontFamily: "Amaranth-Regular",
              textDayFontSize: 16,
              // textDayFontWeight: "300",
              textMonthFontFamily: "Amaranth-Regular",
              textMonthFontSize: 16,
              // textMonthFontWeight: "bold",
              textDayHeaderFontFamily: "Amaranth-Regular",
              textDayHeaderFontSize: 16,
              // textDayHeaderFontWeight: "300",
            }}
          />
        </View>

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleOpenModal}
          >
            <Text style={[styles.text, styles.modalButtonText]}>Agenda</Text>
          </TouchableOpacity>
        </View>
        <VacancyModal
          isVisible={isModalOpen}
          onClose={handleCloseModal}
          showDate={daySelected}
          users={users}
          hours={hours}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontFamily: "Amaranth-Regular",
    color: colors.whiteColor,
    fontSize: scale(18),
  },
  modalButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: verticalScale(48),
    borderRadius: scale(4),
    backgroundColor: colors.navigationColor,
  },
  modalButtonText: { fontSize: scale(32), color: colors.whiteColor },
});
