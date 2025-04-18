import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { tema } from "../constants/tema";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { ancho } from "../helpers/dimensiones";
import { useRouter } from "expo-router";
import { fuentes } from "../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";

const Desplegable = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const opciones = [
    { etiqueta: "Cerrar sesión", valor: "cerrarSesion" },
    { etiqueta: "Editar perfil", valor: "editarPerfil" },
  ];
  const manejarOpcionSeleccionada = (valor) => {
    console.log("Opción seleccionada:", valor);
    if (valor === "cerrarSesion") {
      cerrarSesion();
    }
    if (valor === "editarPerfil") {
      router.push("editarPerfil");
    }
    setMenuVisible(false);
  };

  async function cerrarSesion() {
    Alert.alert("Confirmar", "Estas seguro de que quieres cerrar la sesión", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert(
              "Cerrar Sesión",
              "Ha habido un problema cerrando tu sesión!"
            );
          }
        },
        style: "destructive",
      },
    ]);
  }

  return (
    <View style={styles.contenedor}>
      <TouchableOpacity
        onPress={() => setMenuVisible(!menuVisible)}
        style={styles.boton}
      >
        <Text
          style={
            ([styles.textoBoton],
            { fontFamily: fuentes.Poppins, color: "white" })
          }
        >
          <Ionicons name="menu" size={20} />
        </Text>
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menu}>
          {opciones.map((opcion) => (
            <TouchableOpacity
              key={opcion.valor}
              onPress={() => manejarOpcionSeleccionada(opcion.valor)}
              style={styles.opcion}
            >
              <Text style={{ fontFamily: fuentes.Poppins }}>
                {opcion.etiqueta}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    position: "relative",
  },
  boton: {
    padding: 10,
    backgroundColor: tema.colors.primary,
    borderRadius: tema.radius.sm,
  },
  textoBoton: {
    color: "white",
    fontWeight: tema.fonts.bold,
    fontFamily: fuentes.PoppinsBold,
  },
  menu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 1,
    width: ancho(40),
    alignItems: "center",
    marginTop: 10,
    padding: 5,
    fontFamily: fuentes.Poppins,
  },
  opcion: {
    marginTop: 10,
    margin: 2,
    fontFamily: fuentes.Poppins,
  },
});

export default Desplegable;
