import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import Pantalla from "../../components/Pantalla";
import { useRouter } from "expo-router";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Icon from "../../assets/icons";
import { tema } from "../../constants/tema";
import { Image } from "expo-image";
import Campo from "../../components/Campo";
import { useState } from "react";
import { useFilterScreenChildren } from "expo-router/build/layouts/withLayoutContext";

const EditarPerfil = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState({
    nombre: "",
    telefono: "",
    imagen: "",
    biografia: "",
    direccion: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setUser({
        nombre: currentUser.name || "",
        telefono: currentUser.phoneNumber || "",
        imagen: currentUser.image || "",
        biografia: currentUser.bio || "",
        direccion: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const cambiarFoto = () => {};

  return (
    <GestureHandlerRootView>
      <Pantalla colorFondo="white">
        <View
          style={{
            flex: 1,
            paddingHorizontal: ancho(7),
          }}
        >
          <Cabecera titulo={"Editar Perfil"} atras={true}></Cabecera>
          <View style={styles.contenedorAvatar}>
            <Image
              source={user?.image || require("../../assets/images/perfil.png")}
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
            <Pressable style={styles.boton} onPress={cambiarFoto}>
              <Text>Cambiar foto</Text>
            </Pressable>
          </View>
          <View style={styles.contenedor}>
            <Text
              style={{
                fontSize: ancho(5),
                color: tema.colors.text,
                alignSelf: "center",
              }}
            >
              Completa tus datos
            </Text>
            <View style={([styles.contenedor], { marginTop: 30 })}>
              <Campo
                icon={
                  <Icon
                    name="usuario"
                    size={ancho(6)}
                    color={tema.colors.text}
                  />
                }
                placeholder="Nombre"
                value={null}
                onChangeText={(value) => {}}
              />
              <Campo
                icon={
                  <Icon
                    name="usuario"
                    size={ancho(6)}
                    color={tema.colors.text}
                  />
                }
                placeholder="Nombre"
                value={null}
                onChangeText={(value) => {}}
              />
            </View>
          </View>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

export default EditarPerfil;

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
  boton: {
    padding: 10,
    backgroundColor: tema.colors.darklight,
    borderRadius: tema.radius.sm,
    alignSelf: "center",
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
