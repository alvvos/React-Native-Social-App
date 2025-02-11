import { StyleSheet, View, Text } from "react-native";
import React from "react";
import Pantalla from "../../components/Pantalla";
import { useRouter } from "expo-router";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "../../assets/icons";
import { tema } from "../../constants/tema";
import { Image } from "expo-image";
import { useEffect } from "react";
import { use } from "react";
import { obtenerImagen } from "../../services/imagenes";

const Perfil = () => {
  const { usuario, setAuth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    console.log("usuario en perfil: ", usuario);
  }, []);

  return (
    <GestureHandlerRootView>
      <Pantalla colorFondo="white">
        <View
          style={{
            flex: 1,
            padding: ancho(7),
          }}
        >
          <Cabecera titulo={usuario?.nombre} atras={true}></Cabecera>
          <View style={styles.contenedorAvatar}>
            <Image
              source={obtenerImagen(usuario?.imagen)}
              size={ancho(1)}
              borderRadius={tema.radius.doublexxl}
              alignSelf="center"
              transition={100}
              style={{
                width: ancho(30),
                height: ancho(30),
                marginTop: 30,
                marginBottom: 30,
              }}
            />
            <View style={styles.info}>
              <Icon name="email" size={alto(3)} color={tema.colors.text} />
              <Text style={{ fontSize: ancho(4) }}>{usuario?.email}</Text>
            </View>
            <View style={styles.info}>
              <Icon
                name="telefono"
                size={alto(3)}
                color={tema.colors.text}
                strokeWidth={2}
              />
              <Text style={{ fontSize: ancho(4) }}>{usuario?.telefono}</Text>
            </View>
          </View>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

export default Perfil;

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
