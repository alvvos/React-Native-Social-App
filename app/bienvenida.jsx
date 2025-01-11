import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import Pantalla from "../components/Pantalla";
import { StatusBar } from "expo-status-bar";
import { ancho, alto } from "../helpers/dimensiones";
import { tema } from "../constants/tema";
import Boton from "../components/Boton";
import { useRouter } from "expo-router";

const welcome = () => {
  const router = useRouter();

  return (
    <Pantalla bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={{ gap: 20 }}>
          <Text style={styles.titulo}>Bienvenidos!</Text>
          <Text style={styles.punchLine}>A mi proyecto final de grado.</Text>
        </View>
        <Image
          source={require("../assets/images/eep.png")}
          style={styles.welcomeImage}
        />
        <View style={styles.footer}>
          <Boton
            titulo="Empecemos"
            BotonStyle={{ marginHorizontal: ancho(3) }}
            onPress={() => {
              router.push("register");
            }}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Ya tengo una cuenta</Text>
            <Pressable
              onPress={() => {
                router.push("login");
              }}
            >
              <Text
                style={[
                  styles.loginText,
                  {
                    color: tema.colors.primary,
                    fontWeight: tema.fonts.semibold,
                  },
                ]}
              >
                Acceder
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pantalla>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: ancho(9),
  },
  welcomeImage: {
    height: alto(20),
    width: ancho(50),
    alignSelf: "center",
  },
  titulo: {
    color: tema.colors.text,
    fontSize: alto(5),
    textAlign: "center",

    fontWeight: tema.fonts.extrabold,
  },
  punchLine: {
    textAlign: "center",
    paddingHorizontal: ancho(3),
    fontSize: alto(2),
    color: tema.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loginText: {
    textAlign: "center",
    color: tema.colors.text,
    fontSize: alto(2),
  },
});
