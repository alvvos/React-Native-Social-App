import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { tema } from "../constants/tema";
import { Pressable } from "react-native";
import { fuentes } from "../constants/fuentes";

const Badge = ({ texto, onPress = {} }) => {
  return (
    <Pressable onPress={onPress} style={styles.boton}>
      <Text
        style={{
          color: tema.colors.text,
          fontFamily: fuentes.Poppins,
        }}
      >
        {texto}
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
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
