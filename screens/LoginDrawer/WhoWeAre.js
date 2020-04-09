import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { GeneralStatusBar } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";

import background from "../../assets/whoweare.png";
import logo from "../../assets/LogoHorizontal.png";

export default function WhoWeAre({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.whiteColor }}>
      <GeneralStatusBar
        backgroundColor={colors.mainColor}
        barStyle="light-content"
      />
      <ImageBackground source={background} style={styles.imageBackground}>
        {/*  */}
        <View style={styles.header}>
          <View style={{ paddingLeft: 20 }} />
          <Text style={[styles.text, { fontSize: 36 }]}>Sobre nós</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <MaterialIcons
              name="close"
              size={32}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>

        {/* Verificar aqui o bug de nao voltar para a tela de login */}
        <View
          style={{
            alignItems: "center",
            marginVertical: -100,
            zIndex: 1,
          }}
        >
          <Image source={logo} resizeMode="cover" width={64} height={64} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>
            O <Text style={styles.textStrong}>Solution Center</Text> foi
            idealizado pensando em você!{"\n"}
            Somos profissionais liberais e entendemos a dinâmica de trabalho que
            o cenário mundial, cada vez mais, nos traz.{"\n"}Por isso, nossa
            missão é proporcionar ao profissional o espaço perfeito para o
            desenvolvimento de seu trabalho, com uma estrutura de alto padrão.
            Nossos ambientes são sofisticados, confortáveis e privados.{"\n"}
            Assim, nós oferecemos segurança, conforto e praticidade ao seu
            atendimento. Tudo isso sem custo fixo ou burocracia. Aqui você paga
            somente quando usar.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  header: {
    zIndex: 2,
    width: "100%",
    height: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textContainer: {
    marginHorizontal: 40,
    zIndex: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.mainColor,
    textAlign: "justify",
  },
  textStrong: {
    fontWeight: "bold",
  },
});
