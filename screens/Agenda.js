import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import colors from "../constants/colors";
import { api } from '../services/api'
import { ROOM_IDS } from "../constants/fixedValues";
import { GeneralStatusBar, VacancyModal } from "../components";
import { removeDuplicates, chunkArray } from '../helpers/functions'
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import { CommonActions } from "@react-navigation/native";
import AuthContext from '../contexts/auth'

export default function Agenda({ navigation }) {
  const { signOut } = useContext(AuthContext)
  const [daySelected, setDaySelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hours, setHours] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    setDaySelected(currentDate);
  }, []);

  function handleDayPress(day) {
    setDaySelected(day);
  }

  function handleOpenModal() {
    setLoading(true)
    api.post('/events/list', {
      date: daySelected
    }).then((response) => {
      const { hoursInterval, validEvents } = response.data
      if (validEvents.length === 0) {
        const nonUsers = new Array(hoursInterval.length * 10).fill('')
        const chunkNonUsers = chunkArray(nonUsers, 10)
        setUsers(chunkNonUsers)
      }
      else {
        const rawList = hoursInterval.flatMap(hour => {
          return ROOM_IDS.flatMap(place => {
            const list = { hour, place }
            return list
          })
        })

        const usersList = validEvents.flatMap(evt => {
          return rawList.flatMap((container, index) => {
            if (evt.time.includes(container.hour) && container.place == evt.room) {
              const fullName = evt.name.split(' ')
              const name =
                `${fullName[0]} ${fullName[fullName.length - 1].split('')[0]}`
              const user = {
                index,
                hour: container.hour,
                place: container.place,
                name
              }
              return user
            }
            const withoutUser = {
              index,
              hour: container.hour,
              place: container.place,
              name: ''
            }
            return withoutUser
          })
        })

        const sortedList = usersList
          .sort((a, b) => {
            if (a.name === "") {
              return 1;
            } else if (b.name === "") {
              return -1;
            } else {
              return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            }
          })

        const withoutDuplicates = removeDuplicates(sortedList, 'index')
        const totalUsers = withoutDuplicates
          .sort((a, b) => {
            return a.index - b.index
          })
          .map(el => el.name)
        const chunkUsers = chunkArray(totalUsers, 10)
        setUsers(chunkUsers);
      }
      setHours(hoursInterval);
      setIsModalOpen(true);
    }).catch((e) => {
      setError('Erro ao buscar registros')
    }).finally(() => {
      setLoading(false)
    })
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function showFetchLoading() {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.whiteColor} />;
    } else {
      return <Text style={[styles.text, styles.modalButtonText]}>Agenda</Text>;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <LinearGradient
        colors={[colors.mainColor, colors.secondaryColor]}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            marginVertical: verticalScale(70),
          }}
        >
          {/* <TouchableOpacity onPress={() => {
            signOut()
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "LoginDrawer" }]
              }))
          }}>
            <Text>Sair</Text>
          </TouchableOpacity> */}

          <Calendar
            markingType={"custom"}
            monthFormat={"MMMM yyyy"}
            current={daySelected}
            onDayPress={(date) => handleDayPress(date.dateString)}
            hideExtraDays
            markedDates={{
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
              selectedDayTextColor: colors.whiteColor,
              todayTextColor: colors.accentColor,
              dayTextColor: colors.whiteColor,
              textDisabledColor: colors.disableColor,
              arrowColor: colors.navigationColor,
              disabledArrowColor: colors.disableColor,
              monthTextColor: colors.whiteColor,
              textDayFontFamily: "Amaranth-Regular",
              textDayFontSize: 16,
              textMonthFontFamily: "Amaranth-Regular",
              textMonthFontSize: 16,
              textDayHeaderFontFamily: "Amaranth-Regular",
              textDayHeaderFontSize: 16,
            }}
          />
        </View>

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleOpenModal}
          >
            {showFetchLoading()}
          </TouchableOpacity>
        </View>
        <VacancyModal
          isVisible={isModalOpen}
          onClose={() => handleCloseModal()}
          showDate={daySelected}
          users={users}
          hours={hours}
        />
      </LinearGradient>
    </SafeAreaView>
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
