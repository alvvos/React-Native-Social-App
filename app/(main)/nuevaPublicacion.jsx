import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Pantalla from "../../components/Pantalla";
import Cabecera from "../../components/Cabecera";
import { ancho, alto } from "../../helpers/dimensiones";
import { tema } from "../../constants/tema";

const nuevaPublicacion = () => {
  return (
    <GestureHandlerRootView>
      <Pantalla>
        <View
          style={{
            flex: 1,
            padding: ancho(7),
          }}
        >
          <Cabecera titulo="Publicación" atras="true"></Cabecera>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

export default nuevaPublicacion;

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
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
    height: alto(30),
    width: ancho(100),
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
    marginTop: 10,
    justifyContent: "center",
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
