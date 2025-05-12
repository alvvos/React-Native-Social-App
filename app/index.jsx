import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect } from "react";
import Pantalla from "../components/Pantalla";
import { StatusBar } from "expo-status-bar";
import { ancho, alto } from "../helpers/dimensiones";
import { tema } from "../constants/tema";
import Boton from "../components/Boton";
import { useRouter } from "expo-router";
import { cargarFuentes, fuentes } from "../constants/fuentes";

const Index = () => {
  useEffect(() => {
    const cargar = async () => {
      await cargarFuentes();
      console.log("fuentes cargadas");
    };

    cargar();
  }, []);

  const router = useRouter();
  return (
    <Pantalla>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={{ gap: 20 }}>
          <Text style={styles.titulo}>Bienvenido/a</Text>
          <Text style={styles.punchLine}>Imperia</Text>
        </View>
        <Image
          source={require("../assets/images/eep.png")}
          style={styles.welcomeImage}
        />
        <View style={styles.footer}>
          <Boton
            titulo="Registrarse"
            BotonStyle={{ marginHorizontal: ancho(3) }}
            alPresionar={() => {
              router.push("registrar");
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

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: ancho(9),
  },
  welcomeImage: {
    height: alto(30),
    width: ancho(65),
    alignSelf: "center",
  },
  titulo: {
    color: tema.colors.text,
    fontSize: alto(5),
    textAlign: "center",
    fontFamily: fuentes.PoppinsBold,
    fontWeight: tema.fonts.extrabold,
  },
  punchLine: {
    textAlign: "center",
    paddingHorizontal: ancho(3),
    fontSize: alto(2),
    color: tema.colors.text,
    fontFamily: fuentes.Poppins,
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
