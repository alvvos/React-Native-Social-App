import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import { alto } from "../helpers/dimensiones";
import { Image } from "expo-image";

const Avatar = ({ uri, tam, rounded, style = {} }) => {
  return (
    <Image
      source={require("../assets/images/perfil.png")}
      transition={100}
      styles={[
        styles.avatar,
        { height: tam, width: tam, borderRadius: rounded },
        style,
      ]}
    ></Image>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: tema.colors.darklight,
  },
});
