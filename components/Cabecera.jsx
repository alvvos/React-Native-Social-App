import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { alto } from "../helpers/dimensiones";
import { tema } from "../constants/tema";
import Atras from "./Atras";
import { useRouter } from "expo-router";
import Desplegable from "./Desplegable";

const Cabecera = ({ titulo, atras = false, mb = 10 }) => {
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {atras && (
        <View style={styles.atras}>
          <Atras router={router} />
        </View>
      )}
      <Text style={styles.titulo}>{titulo || ""}</Text>
      <View style={styles.menu}>
        <Desplegable style={styles.cerrarSesion} />
      </View>
    </View>
  );
};

export default Cabecera;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  titulo: {
    fontSize: alto(2.7),
    color: tema.colors.text,
    letterSpacing: 1.5,
  },
  atras: {
    position: "absolute",
    left: 0,
  },
  menu: {
    position: "absolute",
    right: 0,
  },
});
