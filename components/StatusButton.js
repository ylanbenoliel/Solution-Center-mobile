import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import colors from "../constants/colors";

const StatusButton = ({ code, onChange }) => {
  if (code == 1) {
    return (
      <>
        <TouchableOpacity
          onLongPress={() => onChange()}
          style={{
            width: "80%",
            height: "65%",
            borderRadius: 8,
            paddingVertical: 4,
            justifyContent: "center",
            backgroundColor: colors.accentColor
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 22,
              color: colors.whiteColor
            }}
          >
            Pressione para reservar
          </Text>
        </TouchableOpacity>
      </>
    );
  }
  if (code == 2) {
    return (
      <TouchableOpacity
        onLongPress={() => onChange()}
        style={{
          width: "95%",
          height: "80%",
          borderRadius: 8,
          justifyContent: "center",
          backgroundColor: colors.mainColor
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
            color: colors.whiteColor
          }}
        >
          Sua reserva
        </Text>
      </TouchableOpacity>
    );
  }
  if (code == 3) {
    return (
      <TouchableOpacity
        onLongPress={() =>
          Alert.alert("Erro", "Não é possível cancelar esse horário", [
            { text: "Ok" }
          ])
        }
        style={{
          width: "95%",
          height: "80%",
          borderRadius: 8,
          justifyContent: "center",
          backgroundColor: colors.disableColor
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
            color: colors.whiteColor
          }}
        >
          Sua reserva
        </Text>
      </TouchableOpacity>
    );
  }
  if (code == 4) {
    return (
      <TouchableOpacity
        style={{
          width: "95%",
          height: "80%",
          borderRadius: 8,
          justifyContent: "center",
          backgroundColor: colors.errorColor
        }}
        disabled
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
            color: colors.whiteColor
          }}
        >
          Horário indisponível
        </Text>
      </TouchableOpacity>
    );
  }
};

export default StatusButton;
