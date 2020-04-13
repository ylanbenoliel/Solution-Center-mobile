import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { verticalScale, scale } from "react-native-size-matters";
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
          <View style={{ paddingLeft: scale(20) }} />
          <Text style={[styles.text, styles.headerName]}>Sobre nós</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <MaterialIcons
              name="close"
              size={32}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignItems: "center",
            marginVertical: verticalScale(-110),
            zIndex: 1,
          }}
        >
          <Image source={logo} resizeMode="contain" width={64} height={64} />
        </View>

        <ScrollView>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {"    "}O <Text style={styles.textStrong}>Solution Center</Text>{" "}
              foi idealizado pensando em você! Somos profissionais liberais e
              entendemos a dinâmica de trabalho que o cenário mundial, cada vez
              mais, nos traz.
            </Text>
            <Text style={styles.text}>
              {"    "}Por isso, nossa missão é proporcionar ao profissional o
              espaço perfeito para o desenvolvimento de seu trabalho, com uma
              estrutura de alto padrão. Nossos ambientes são sofisticados,
              confortáveis e privados.
            </Text>
            <Text style={styles.text}>
              {"    "}Assim, nós oferecemos segurança, conforto e praticidade ao
              seu atendi-{"\n"}mento. Tudo isso sem custo fixo ou burocracia.
              Aqui você paga somente quando usar.
            </Text>
          </View>
        </ScrollView>
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
    height: verticalScale(56),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: verticalScale(15),
  },
  headerName: {
    fontWeight: "bold",
    fontSize: scale(36),
  },
  textContainer: {
    marginHorizontal: scale(20),
  },
  text: {
    fontFamily: "Amaranth-Regular",
    fontSize: scale(18),
    color: colors.mainColor,
    textAlign: "left",
  },
  textStrong: {
    fontWeight: "bold",
  },
});
