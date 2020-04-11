import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Platform,
} from "react-native";
import { GeneralStatusBar } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../constants/colors";

import backgroundLogo from "../../assets/LogoHorizontal.png";

export default function Contact({ navigation }) {
  function openWpp(phone) {
    const wppNumber = `+55${phone}`;
    Linking.openURL(`https://wa.me/${wppNumber}`);
  }

  function openInstagram() {
    Linking.openURL("instagram://user?username=solutioncenterbelem");
  }

  function openMaps() {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${-1.4405587},${-48.4647}`;
    const label = "Solution Center Belém";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  }

  function sendMail() {
    Platform.OS === "ios"
      ? Linking.openURL("mailto:contato@solutioncenterbelem.com")
      : Linking.openURL("googlegmail:contato@solutioncenterbelem.com");
  }

  const WppPhone = ({ phone }) => {
    return (
      <TouchableOpacity onPress={() => openWpp(phone)}>
        <Text style={[styles.clicableText]}>{phone}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
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
          <Text style={[styles.text, { fontSize: 36 }]}>Contato</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <MaterialCommunityIcons
              name="close"
              size={32}
              color={colors.navigationColor}
            />
          </TouchableOpacity>
        </View>
        {/*  */}
        <View style={styles.contactContainer}>
          <View style={styles.whatsappContainer}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={48}
              color={colors.navigationColor}
            />
            <View style={styles.whatsappNumbers}>
              <WppPhone phone="(91) 9118-8681" />
              <WppPhone phone="(91) 8131-9689" />
              <WppPhone phone="(91) 8252-0417" />
            </View>
          </View>
          {/*  */}
          <View style={{ marginTop: 10 }} />
          <View style={styles.instagramContainer}>
            <MaterialCommunityIcons
              name="instagram"
              size={48}
              color={colors.navigationColor}
            />
            <TouchableOpacity
              onPress={() => {
                openInstagram();
              }}
            >
              <Text style={[styles.clicableText, { marginLeft: 20 }]}>
                @solutioncenterbelem
              </Text>
            </TouchableOpacity>
          </View>
          {/*  */}

          <View style={{ marginTop: 10 }} />
          <View style={styles.emailContainer}>
            <MaterialCommunityIcons
              name="email"
              size={48}
              color={colors.navigationColor}
            />
            <Text style={[styles.text, { marginLeft: 20 }]}>
              contato@solutioncenterbelem{"\n"}.com
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }} />

        <View style={styles.localizationContainer}>
          <Text style={[styles.text, { fontSize: 36 }]}>Localização</Text>
          <Text style={styles.text}>
            Localização privilegiada, próximo a supermercados, restaurantes,
            farmácias. Temos estacionamento rotativo, com entrada pela Tv.
            Humaitá.
          </Text>
          <View style={styles.localizationContent}>
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={48}
              color={colors.navigationColor}
            />
            <TouchableOpacity onPress={() => openMaps()}>
              <Text style={[styles.clicableText, { marginLeft: 10 }]}>
                Av. Rômulo Maiorana, nº 700,{"\n"} Ed. Vitta Office, Sala 1414,
                {"\n"}Marco. CEP: 66093-672
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  text: {
    fontSize: 20,
    color: colors.mainColor,
    textAlign: "justify",
  },
  clicableText: {
    fontSize: 20,
    color: colors.accentColor,
    textAlign: "left",
  },
  contactContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginTop: 10,
    marginHorizontal: 10,
    paddingLeft: 10,
  },
  whatsappContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  whatsappNumbers: {
    marginLeft: 20,
    height: 100,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  instagramContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  localizationContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
    paddingBottom: 20,
  },
  localizationContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
