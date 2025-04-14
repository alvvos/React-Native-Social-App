import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { tema } from "../constants/tema";
import { Pressable } from "react-native";
import { fuentes } from "../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";

const Badge = ({ icono, onPress = {}, estilosExtra, color }) => {
  return (
    <Pressable onPress={onPress} style={[styles.boton, estilosExtra]}>
      <Text
        style={{
          color: color,
          fontFamily: fuentes.Poppins,
        }}
      >
        <Ionicons name={icono} size={20} />
      </Text>
    </Pressable>
  );
};

export default Badge;

const styles = StyleSheet.create({
  boton: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: tema.radius.sm,
    backgroundColor: "rgb(233, 233, 233)",
  },
});
