import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { tema } from "../constants/tema";
import { alto, ancho } from "../helpers/dimensiones";

const Campo = (props) => {
  return (
    <View
      style={[
        styles.contenedor,
        props.contenedorStyles && props.contenedorStyles,
      ]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1, fontSize: ancho(4) }}
        placeholderTextColor={tema.colors.textLight}
        ref={props.inputRef && props.inputRef}
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
    borderColor: tema.colors.text,
    paddingHorizontal: 18,
    gap: 12,
  },
});
