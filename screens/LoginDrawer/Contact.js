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
import { verticalScale, scale } from "react-native-size-matters";

const Separator = () => {
  return <View style={{ marginTop: scale(10) }} />;
};

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

  function openSite() {
    Linking.openURL("https://www.solutioncenterbelem.com/");
  }

  const WppPhone = ({ phone }) => {
    return (
      <TouchableOpacity
        style={styles.clickableArea}
        onPress={() => openWpp(phone)}
      >
        <Text style={[styles.text, styles.clickableText]}>{phone}</Text>
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
          opacity: 0.1,
          resizeMode: "contain",
        }}
        style={styles.imageBackground}
      >
        {/*  */}
        <View style={styles.header}>
          <View style={{ paddingLeft: verticalScale(20) }} />
          <Text style={[styles.text, styles.headerName]}>Contato</Text>
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
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={48}
              color={colors.mainColor}
            />
            <View style={styles.whatsappNumbers}>
              <WppPhone phone="(91) 99118-8681" />
              <WppPhone phone="(91) 98131-9689" />
              <View style={styles.lastNumber}>
                <WppPhone phone="(91) 98252-0417" />
              </View>
            </View>
          </View>
          {/*  */}
          <Separator />
          {/*  */}
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="instagram"
              size={48}
              color={colors.mainColor}
            />
            <TouchableOpacity
              style={styles.clickableArea}
              onPress={() => {
                openInstagram();
              }}
            >
              <Text
                style={[
                  styles.text,
                  styles.clickableText,
                  { marginLeft: verticalScale(20) },
                ]}
              >
                @solutioncenterbelem
              </Text>
            </TouchableOpacity>
          </View>
          {/*  */}
          <Separator />
          {/*  */}
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="email"
              size={48}
              color={colors.mainColor}
            />
            <Text style={[styles.text, { marginLeft: verticalScale(20) }]}>
              contato@solutioncenterbelem.com
            </Text>
          </View>
          {/*  */}
          <Separator />
          {/*  */}
          <View style={styles.linksContainer}>
            <MaterialCommunityIcons
              name="web"
              size={48}
              color={colors.mainColor}
            />
            <TouchableOpacity
              style={styles.clickableArea}
              onPress={() => {
                openSite();
              }}
            >
              <Text
                style={[
                  styles.text,
                  styles.clickableText,
                  { marginLeft: verticalScale(20) },
                ]}
              >
                www.solutioncenterbelem.com
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*  */}
        <Separator />
        {/*  */}
        <View style={styles.localizationContainer}>
          <Text style={[styles.text, styles.headerName]}>Localização</Text>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.text}>
              Localização privilegiada, próximo a supermercados, restaurantes,
              farmácias. Temos estacionamento rotativo, com entrada pela Tv.
              Humaitá.
            </Text>
          </View>
          <View style={styles.localizationContent}>
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={48}
              color={colors.mainColor}
            />
            <TouchableOpacity onPress={() => openMaps()}>
              <Text style={[styles.text, styles.clickableText]}>
                Av. Rômulo Maiorana, nº 700,{"\n"}Ed. Vitta Office, Sala 1414,
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
  text: {
    fontFamily: "Amaranth-Regular",
    fontSize: scale(16),
    color: colors.mainColor,
    textAlign: "justify",
  },
  clickableArea: {
    padding: scale(2),
  },
  clickableText: {
    color: colors.accentColor,
  },
  contactContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginTop: verticalScale(10),
    marginHorizontal: scale(10),
    paddingLeft: scale(10),
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  whatsappNumbers: {
    marginLeft: scale(20),
    width: scale(230),
    height: verticalScale(70),
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  lastNumber: {
    width: "100%",
    flexDirection: "row",
    marginTop: verticalScale(25),
  },
  localizationContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: verticalScale(20),
    paddingBottom: verticalScale(5),
  },
  localizationContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
  },
});
