import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Separator } from "./index";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component";
import colors from "../constants/colors";

const VacancyModal = ({ isVisible, onClose }) => {
  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.whiteColor,
          borderRadius: 4,
        }}
      >
        <Text>Oi</Text>
        <TouchableOpacity
          onPress={() => {
            onClose();
          }}
        >
          <Text>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
// const [rooms, setRooms] = useState({})
// const [usersReserve, setUsersReserve] = useState({
//   0: { name: "Jose Scales", room: 3, schedule: [14, 15, 16] },
//   1: { name: "Elene Brewster", room: 5, schedule: [16, 18] }
// });
// const VacancyModal = ({ isVisible, toogle }) => {
//   const Room = ({ number, selected = false }) => {
//     return (
//       <TouchableOpacity>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <Text style={{ fontSize: 18, color: colors.mainColor }}>
//             Sala {number}
//           </Text>
//           <MaterialIcons
//             name={selected === true ? "check-box" : "check-box-outline-blank"}
//             size={28}
//             color={colors.accentColor}
//           />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const User = ({ name, room, schedule }) => {
//     const hours = schedule.map((hour, index) => {
//       return (
//         <Text key={index} style={{ fontSize: 18, color: colors.mainColor }}>
//           {hour}h
//         </Text>
//       );
//     });
//     return (
//       <>
//         <View
//           style={{
//             width: "100%",
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-around",
//             // marginTop: 5,
//             paddingLeft: 25
//           }}
//         >
//           <View />

//           <Text style={{ fontSize: 32, color: colors.mainColor }}>{name}</Text>

//           {/* Edit button which go to edit room */}
//           <TouchableOpacity>
//             <MaterialIcons
//               name="edit"
//               size={22}
//               color={colors.navigationColor}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={{ marginTop: -10 }}>
//           <Text
//             style={{
//               fontStyle: "italic",
//               fontSize: 16,
//               color: colors.disableColor
//             }}
//           >
//             Sala {room}
//           </Text>
//         </View>

//         <View
//           style={{
//             width: "70%",
//             height: 20,
//             flexDirection: "row",
//             flexWrap: "wrap",
//             alignItems: "flex-end",
//             justifyContent: "space-between",
//             marginVertical: 10
//           }}
//         >
//           {hours}
//         </View>
//         <Separator />
//       </>
//     );
//   };

//   return (
//     <Modal isVisible={isVisible}>
//       <View
//         style={{
//           flex: 1,
//           alignItems: "center",
//           backgroundColor: colors.whiteColor,
//           borderRadius: 4
//         }}
//       >
//         <View
//           style={{
//             width: "100%",
//             height: 38,
//             flexDirection: "column",
//             alignItems: "flex-end",
//             justifyContent: "center",
//             marginRight: 10
//           }}
//         >
//           <TouchableOpacity>
//             <MaterialIcons
//               name="close"
//               color={colors.navigationColor}
//               size={32}
//             />
//           </TouchableOpacity>
//         </View>

//         <Separator />

//         <View
//           style={{
//             marginVertical: 10,
//             alignItems: "center",
//             justifyContent: "center"
//           }}
//         >
//           <Text style={{ fontSize: 22, color: colors.disableColor }}>
//             Salas
//           </Text>
//         </View>

//         <View
//           style={{
//             width: "90%",
//             flexDirection: "row",
//             justifyContent: "space-around",
//             paddingBottom: 10
//           }}
//         >
//           <Room number={1} />
//           <Room number={2} />
//           <Room number={3} selected />
//         </View>

//         <View
//           style={{
//             width: "90%",
//             flexDirection: "row",
//             justifyContent: "space-around",
//             paddingBottom: 10
//           }}
//         >
//           <Room number={4} />
//           <Room number={5} selected />
//           <Room number={6} />
//         </View>

//         <View
//           style={{
//             width: "90%",
//             flexDirection: "row",
//             justifyContent: "space-around",
//             paddingBottom: 10
//           }}
//         >
//           <Room number={7} />
//           <Room number={8} />
//           <Room number={9} />
//         </View>

//         <Separator />
//         <User name="Jose Scales" room={3} schedule={[14, 15, 16]} />
//         <User name="Elene Brewster" room={5} schedule={[16, 18]} />
//       </View>
//     </Modal>
//   );
// };

export default VacancyModal;
