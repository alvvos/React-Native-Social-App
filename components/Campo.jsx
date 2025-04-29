import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { tema } from "../constants/tema";
import { alto, ancho } from "../helpers/dimensiones";
import { fuentes } from "../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";

const Campo = (props) => {
  return (
    <View style={[styles.contenedor]}>
      <Ionicons name={props.icon} size={alto(3)} color={tema.colors.text} />
      <TextInput
        style={{ flex: 1, fontSize: ancho(4), fontFamily: fuentes.Poppins }}
        placeholderTextColor={tema.colors.textLight}
        {...props}
      />
    </View>
  );
};

export default Campo;

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    height: alto(8),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 18,
    gap: 12,
    borderRadius: tema.radius.sm,
  },
});
