import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { tema } from "../constants/tema";
import { alto, ancho } from "../helpers/dimensiones";

const Campo = (props) => {
  return (
    <View style={[styles.contenedor]}>
      {props.icon}
      <TextInput
        style={{ flex: 1, fontSize: ancho(4) }}
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
