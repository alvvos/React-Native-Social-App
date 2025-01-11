import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import { alto } from "../helpers/dimensiones";
import Carga from "./Carga";

const Boton = ({
  botonStyle,
  textStyle,
  titulo = "",
  onPress = () => {},
  Carga = false,
}) => {
  if (Carga) {
    return (
      <View style={[styles.boton, botonStyle, { backgroundColor: "white" }]}>
        <Carga />
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.boton, botonStyle]}>
      <Text style={[styles.text, textStyle]}>{titulo}</Text>
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
  },
  text: {
    fontSize: alto(2.5),
    color: "white",
    fontWeight: tema.fonts.bold,
  },
});
