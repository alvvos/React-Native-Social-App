import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect } from "react";
import Pantalla from "../../components/Pantalla";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { ancho, alto } from "../../helpers/dimensiones";
import { tema } from "../../constants/tema";
import { useRouter } from "expo-router";
import { useState } from "react";
import Icon from "../../assets/icons";
import Boton from "../../components/Boton";
import Avatar from "../../components/Avatar";

const Inicio = () => {
  const { usuario, setAuth } = useAuth();
  const router = useRouter();

  return (
    <Pantalla>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={{
              fontSize: ancho(8),
              letterSpacing: 2,
            }}
          >
            Bienvenido
          </Text>
        </View>
        <View style={styles.icons}>
          <Pressable onPress={() => router.push("notificaciones")}>
            <Icon
              name="campana"
              size={alto(4)}
              strokeWidth={2}
              color={tema.colors.text}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("nuevaPublicacion");
            }}
          >
            <Icon
              name="subir"
              size={alto(4)}
              strokeWidth={2}
              color={tema.colors.text}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("perfil");
            }}
          >
            <Icon
              name="perfil"
              size={alto(4)}
              strokeWidth={2}
              color={tema.colors.primary}
            />
          </Pressable>
        </View>
      </View>
    </Pantalla>
  );
};

export default Inicio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ancho(7),
  },
  welcomeImage: {
    height: alto(60),
    width: ancho(100),
    alignSelf: "center",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: ancho(4),
    marginBottom: 10,
  },
  icons: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    gap: ancho(30),
    padding: 30,
  },
  listStyle: {
    paddingTop: 20,
    paddingBottom: ancho(4),
  },
  noPosts: {
    fontSize: alto(2),
    textAlign: "center",
    color: tema.colors.text,
  },
  avatarImage: {
    height: alto(40),
    width: ancho(40),
    borderRadius: tema.radius.sm,
    borderCurve: "continuous",
    borderColor: tema.colors.gray,
    borderWidth: 3,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
  },
  titulo: {
    color: tema.colors.text,
    fontSize: alto(5),
    fontWeight: tema.fonts.bold,
  },
  punchLine: {
    textAlign: "center",
    paddingHorizontal: ancho(8),
    fontSize: alto(3),
    color: tema.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loginText: {
    textAlign: "center",
    color: tema.colors.text,
    fontSize: alto(4),
  },
});
