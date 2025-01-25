import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Pantalla from "../../components/Pantalla";
import { ancho, alto } from "../../helpers/dimensiones";
import { tema } from "../../constants/tema";
import Cabecera from "../../components/Cabecera";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

const EditarPerfil = () => {
  return (
    <GestureHandlerRootView>
      <Pantalla>
        <View style={styles.contenedor}>
          <ScrollView styles={{ flex: 1 }}>
            <Cabecera titulo="Editar Perfil" atras="true" />
          </ScrollView>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

export default EditarPerfil;

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingHorizontal: ancho(7),
  },
  contenedorCabecera: {
    marginHorizontal: ancho(4),
    marginBottom: 20,
  },
  formaCabecera: {
    width: ancho(100),
    height: alto(20),
  },
  contenedorAvatar: {
    height: alto(12),
    width: ancho(50),
    alignSelf: "center",
  },
  iconoEditar: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  usuario: {
    fontSize: alto(3),
    fontWeight: "500",
    color: tema.colors.primaryDark,
  },
  cerrarSesion: {
    position: "absolute",
    right: 0,
    padding: 10,
    borderRadius: tema.radius.sm,
    backgroundColor: "#fee2e2",
  },
});
