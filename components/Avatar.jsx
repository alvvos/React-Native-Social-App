import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { tema } from "../constants/tema";
import { alto } from "../helpers/dimensiones";
import { Image } from "expo-image";
import perfil from '../assets/images/perfil.png'


const Avatar = ({
  uri,
  tam = alto(4),
  rounded = tema.radius.md,
  style={}
}) => {
  return (
    <Image
      source={uri || perfil}
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
    borderColor: tema.colors.darklight
  },
});
