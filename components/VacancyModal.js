import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component";
import colors from "@constants/colors";

const tableHead = [
  "",
  "Sala 1",
  "Sala 2",
  "Sala 3",
  "Sala 4",
  "Sala 5",
  "Sala 6",
  "Sala 7",
  "Sala 8",
  "Sala 9",
  "Sala de reunião",
];
const VacancyModal = ({ hours, users, isVisible, showDate, onClose }) => {
  const tableTitle = hours;
  const tableData = users;
  const [date, setDate] = useState("");

  useEffect(() => {
    const formatedDate = showDate.split("-").reverse().join("-");
    setDate(formatedDate);
    return () => {
      setDate("");
    };
  }, [isVisible === true]);

  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.whiteColor,
          borderRadius: 4,
        }}
      >
        {/*  */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <View style={{ width: 32 }} />

          <Text
            style={[styles.text, { color: colors.disableColor, fontSize: 26 }]}
          >
            {date}
          </Text>

          <TouchableOpacity
            style={{ justifyContent: "flex-end" }}
            onPress={() => {
              onClose();
            }}
          >
            <MaterialIcons
              name="close"
              color={colors.navigationColor}
              size={32}
            />
          </TouchableOpacity>
        </View>
        {/*  */}
        <ScrollView
          style={{ margin: "3%" }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <Table>
            <Row
              data={tableHead}
              widthArr={[35, 50, 50, 50, 50, 50, 50, 50, 50, 50, 52]}
              style={styles.head}
              textStyle={styles.text}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              <Table
                borderStyle={{
                  borderWidth: 2,
                  borderColor: colors.disableColor,
                }}
              >
                <TableWrapper style={styles.wrapper}>
                  <Col
                    data={tableTitle}
                    style={styles.title}
                    heightArr={[66]}
                    textStyle={styles.text}
                  />
                  <Rows
                    data={tableData}
                    widthArr={[50, 50, 50, 50, 50, 50, 50, 50, 50, 52]}
                    style={styles.row}
                    textStyle={[styles.text, { color: colors.mainColor }]}
                  />
                </TableWrapper>
              </Table>
            </ScrollView>
          </Table>
        </ScrollView>
        {/*  */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff"
  },
  head: {
    height: 40,
    backgroundColor: colors.mainColor,
    justifyContent: "center",
  },
  wrapper: { flexDirection: "row" },
  title: { flex: 1, backgroundColor: colors.mainColor },
  row: { height: 66, backgroundColor: colors.whiteColor },
  text: {
    textAlign: "center",
    // fontFamily: 'Amaranth-Regular',
    fontSize: 14, 
    color: colors.whiteColor
  },
});

export default VacancyModal;
