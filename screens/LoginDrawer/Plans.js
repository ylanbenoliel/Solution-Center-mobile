import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { GeneralStatusBar } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";

import backgroundLogo from "../../assets/LogoHorizontal.png";

export default function Plans({ navigation }) {
  const [plan, setPlan] = useState(0);

  const Plan = ({ state, touchText, description }) => {
    if (plan !== state) {
      return (
        <TouchableOpacity onPress={() => setPlan(state)}>
          <View style={styles.showPlan}>
            <Text
              style={[styles.text, { color: colors.accentColor, fontSize: 26 }]}
            >
              {touchText}
            </Text>
            <View>
              <MaterialIcons
                name="arrow-drop-down"
                size={32}
                color={colors.accentColor}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (plan === state) {
      return (
        <>
          <TouchableOpacity onPress={() => setPlan(0)}>
            <View style={styles.showPlan}>
              <Text
                style={[
                  styles.text,
                  { color: colors.accentColor, fontSize: 26 },
                ]}
              >
                {touchText}
              </Text>
              <View>
                <MaterialIcons
                  name="arrow-drop-up"
                  size={32}
                  color={colors.accentColor}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ backgroundColor: colors.whiteColor, width: "90%" }}>
            {description.map((item, index) => {
              return (
                <Text key={index} style={[styles.text, { fontWeight: "bold" }]}>
                  {item}
                </Text>
              );
            })}
          </View>
        </>
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.whiteColor }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <ImageBackground
        source={backgroundLogo}
        imageStyle={{
          opacity: 0.4,
          resizeMode: "contain",
        }}
        style={styles.imageBackground}
      >
        {/*  */}
        <View style={styles.header}>
          <View style={{ paddingLeft: 20 }} />
          <Text style={[styles.text, { fontSize: 36 }]}>Planos</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <MaterialIcons
              name="close"
              size={32}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Nossos planos atendem à sua necessidade. E em todos eles, os custos
            com recepcionista, água, café, energia elétrica, segurança, internet
            e limpeza, estão inclusos no valor do aluguel.
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: "90%",
            marginHorizontal: 20,
            Bottom: -20,
          }}
        >
          <Plan
            state={1}
            touchText="Hora avulsa"
            description={[
              "– Períodos mínimos de 60 minutos.",
              "– Valor: R$ 35,00.",
            ]}
          />
          <View style={{ marginVertical: 10 }} />
          <Plan
            state={2}
            touchText="Turno"
            description={[
              "– 6 horas consecutivas.",
              "– Valor: R$ 180,00.",
              "– Hora adicional: R$ 30,00.",
            ]}
          />
          <View style={{ marginVertical: 10 }} />
          <Plan
            state={3}
            touchText="Diária"
            description={[
              "– De 08h às 18h",
              "– Valor: R$ 250,00.",
              "– Hora adicional: R$ 30,00.",
            ]}
          />
          <View style={{ marginVertical: 10 }} />
          <Plan
            state={4}
            touchText="Sala de reunião"
            description={[
              "– Capacidade: 10 pessoas.",
              "– Valor da hora: R$ 70,00.",
            ]}
          />
          <View style={{ marginVertical: 10 }} />
          <Plan
            state={5}
            touchText="Fidelidade"
            description={[
              "– Mensalidade de R$ 120,00",
              "– Valor da hora: R$ 30,00.",
              "– Marketing nos canais\n de comunicação.",
              "– Prioridade para agendamento\n de horários e escolha de salas.",
            ]}
          />
          <View style={{ marginVertical: 10 }} />
          <Plan
            state={6}
            touchText="Mensal"
            description={[
              "– Sala exclusiva",
              "– Mensalidade de R$ 2000,00.",
              "– Período matutino, de 08h às 13h.",
            ]}
          />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textContainer: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 22,
    color: colors.mainColor,
    textAlign: "justify",
  },
  showPlan: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});
