import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import { Pressable } from "react-native";

const Badge = ({ texto, onPress = {} }) => {
  return (
    <Pressable onPress={onPress} style={styles.boton}>
      <Text style={{ color: tema.colors.text, fontWeight: tema.fonts.bold }}>
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
