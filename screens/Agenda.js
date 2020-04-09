import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { eachWeekendOfMonth, parseISO, isSunday, format } from "date-fns";

import colors from "../constants/colors";
import VacancyModal from "../components/VacancyModal";
import { ALL_SCHEDULE_TABLE } from "../constants/fixedValues";
import { GeneralStatusBar } from "../components";

/* <Text style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {sundays[0] + sundays[1]}
      </Text> */

export default function Agenda({ navigation }) {
  const [daySelected, setDaySelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sundays, setSundays] = useState([]);
  const [hours, setHours] = useState([]);
  const [users, setUsers] = useState({});

  const disableSundays = (date) => {
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
  };

  useEffect(() => {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    setDaySelected(currentDate);
    disableSundays(currentDate);
  }, []);

  const _onDayPress = (day) => {
    setDaySelected(day);
  };

  function handleOpenModal() {
    const data = ALL_SCHEDULE_TABLE;
    const users = data.names;
    const hours = data.hours;

    setIsModalOpen(true);
    setUsers(users);
    setHours(hours);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.mainColor,
      }}
    >
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <View
        style={{
          flex: 2,
          height: 100,
          paddingTop: 20,
          justifyContent: "flex-start",
          backgroundColor: colors.mainColor,
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
          onDayPress={(date) => _onDayPress(date.dateString)}
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
            height: 350,
          }}
          theme={{
            backgroundColor: "blue",
            calendarBackground: "rgba(0,0,0,0)",
            textSectionTitleColor: "#b6c1cd",
            //   selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: colors.whiteColor,
            todayTextColor: colors.accentColor,
            dayTextColor: colors.whiteColor,
            textDisabledColor: colors.disableColor,
            arrowColor: colors.navigationColor,
            disabledArrowColor: colors.disableColor,
            monthTextColor: colors.whiteColor,
            //   indicatorColor: "blue",
            //   textDayFontFamily: "space-mono",
            textDayFontSize: 16,
            textDayFontWeight: "300",
            //   textMonthFontFamily: "space-mono",
            textMonthFontSize: 16,
            textMonthFontWeight: "bold",
            //   textDayHeaderFontFamily: "space-mono",
            textDayHeaderFontSize: 16,
            textDayHeaderFontWeight: "300",
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.secondaryColor,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 150,
            height: 48,
            borderRadius: 4,
            backgroundColor: colors.navigationColor,
          }}
          onPress={handleOpenModal}
        >
          <Text style={{ fontSize: 32, color: colors.whiteColor }}>
            Horários
          </Text>
        </TouchableOpacity>

        <VacancyModal
          isVisible={isModalOpen}
          onClose={closeModal}
          showDate={daySelected}
          users={users}
          hours={hours}
        />
      </View>
    </View>
  );
}
