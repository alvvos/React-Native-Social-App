import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import Icon from "../assets/icons";

const Atras = ({ router }) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Text style={{ color: tema.colors.text }}>Atrás</Text>
    </Pressable>
  );
};

export default Atras;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: tema.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
