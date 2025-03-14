import { StyleSheet, Text, View } from "react-native";
import React from "react";

const CajadeColor = ({ color, texto }) => {
  return (
    <View style={[estilos.caja, { backgroundColor: color }]}>
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
};

export default CajadeColor;

const estilos = StyleSheet.create({
  texto: {
    color: "white",
    fontSize: 50,
  },
  caja: {
    alignItems: "center",
    margin: 30,
    marginTop: 10,
    padding: 20,
    borderRadius: 20,
  },
});
