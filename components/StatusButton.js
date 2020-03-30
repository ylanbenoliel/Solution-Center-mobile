import React from "react";
import { TouchableOpacity, Text } from "react-native";
import colors from "../constants/colors";

const StatusButton = ({ code }) => {
  if (code == 1) {
    return (
      <>
        <TouchableOpacity
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
          Você já reservou esse horário
        </Text>
      </TouchableOpacity>
    );
  }
  if (code == 3) {
    return (
      <TouchableOpacity
        style={{
          width: "95%",
          height: "80%",
          borderRadius: 8,
          justifyContent: "center",
          backgroundColor: colors.disableColor
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
          Não é possível desmarcar {"\n"} esse horário
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
