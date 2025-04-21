import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
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
    {
      etiqueta: "Cerrar sesión",
      valor: "cerrarSesion",
      icono: "log-out-outline",
    },
    {
      etiqueta: "Editar perfil",
      valor: "editarPerfil",
      icono: "person-outline",
    },
  ];

  const manejarOpcionSeleccionada = (valor) => {
    if (valor === "cerrarSesion") {
      cerrarSesion();
    }
    if (valor === "editarPerfil") {
      router.push("editarPerfil");
    }
    setMenuVisible(false);
  };

  async function cerrarSesion() {
    Alert.alert("Confirmar", "¿Estás seguro de que quieres cerrar la sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert("Error", "Ha habido un problema cerrando tu sesión");
          }
        },
        style: "destructive",
      },
    ]);
  }

  return (
    <View style={styles.contenedor}>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.botonMenu}
      >
        <Ionicons name="menu" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setMenuVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.barraLateral}>
            <View style={styles.contenedorOpciones}>
              {opciones.map((opcion) => (
                <TouchableOpacity
                  key={opcion.valor}
                  onPress={() => manejarOpcionSeleccionada(opcion.valor)}
                  style={styles.opcion}
                >
                  <Ionicons
                    name={opcion.icono}
                    size={24}
                    color={tema.colors.primary}
                  />
                  <Text style={styles.textoOpcion}>{opcion.etiqueta}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.botonCerrar}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close" size={24} color={tema.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    position: "relative",
    zIndex: 1,
  },
  botonMenu: {
    padding: 10,
    backgroundColor: tema.colors.primary,
    borderRadius: tema.radius.sm,
  },
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  barraLateral: {
    width: ancho(70),
    height: "100%",
    backgroundColor: "white",
    padding: 20,
  },
  contenedorOpciones: {
    flex: 1,
    marginTop: 50,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  textoOpcion: {
    fontFamily: fuentes.Poppins,
    marginLeft: 15,
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  botonCerrar: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
});

export default Desplegable;
