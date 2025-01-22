import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import Icon from "../assets/icons";

const Atras = ({ router }) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.boton}>
      <Text style={{ color: tema.colors.text, fontWeight: tema.fonts.bold }}>
        Atrás
      </Text>
    </Pressable>
  );
};

export default Atras;

const styles = StyleSheet.create({
  boton: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: tema.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
