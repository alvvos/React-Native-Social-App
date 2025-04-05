import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import { alto } from "../helpers/dimensiones";
import { fuentes } from "../constants/fuentes";

const Boton = ({ botonStyles, titulo = "", alPresionar = () => {} }) => {
  return (
    <Pressable onPress={alPresionar} style={[styles.boton, botonStyles]}>
      <Text
        style={{
          fontFamily: fuentes.PoppinsBold,
          color: "white",
          fontSize: alto(2.5),
        }}
      >
        {titulo}
      </Text>
    </Pressable>
  );
};

export default Boton;

const styles = StyleSheet.create({
  boton: {
    backgroundColor: tema.colors.primary,
    height: alto(6),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tema.radius.sm,
  },
  texto: {
    fontSize: alto(2.5),
    color: "white",
    fontWeight: tema.fonts.bold,
  },
});
