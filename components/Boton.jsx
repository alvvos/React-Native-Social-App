import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import { alto } from "../helpers/dimensiones";

const Boton = ({ botonStyle, textoStyle, titulo = "", onPress = () => {} }) => {
  return (
    <Pressable onPress={onPress} style={[styles.boton, botonStyle]}>
      <Text style={[styles.texto, textoStyle]}>{titulo}</Text>
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
