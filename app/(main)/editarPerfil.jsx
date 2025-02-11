import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import Pantalla from "../../components/Pantalla";
import { useRouter } from "expo-router";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Icon from "../../assets/icons";
import { tema } from "../../constants/tema";
import { Image } from "expo-image";
import Campo from "../../components/Campo";
import { useState } from "react";
import Boton from "../../components/Boton";
import { updateUsuarioData } from "../../services/usuarios";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { obtenerImagen, subirImagen } from "../../services/imagenes";

const EditarPerfil = () => {
  const { usuario, setAuth, setUsuarioData } = useAuth();
  const _id = usuario.id;
  const [_usuario, setUsuario] = useState({
    nombre: "",
    telefono: "",
    imagen: "",
    email: "",
    biografia: "",
    direccion: "",
  });
  const router = useRouter();

  useEffect(() => {
    console.log("_id del usuario: ", _id);
    if (usuario) {
      console.log("Se ha recibido el usuario en Editar");
      console.log(usuario);
      setUsuario({
        nombre: usuario.nombre || "",
        telefono: usuario.telefono || "",
        imagen: usuario.imagen || null,
        email: usuario.email || "",
        biografia: usuario.biografia || "",
        direccion: usuario.direccion || "",
      });
    }
  }, []);

  const cambiarDatos = async () => {
    let data = { ..._usuario };
    let { nombre, telefono, imagen, biografia, direccion } = data;
    if (!nombre || !telefono || !imagen || !biografia || !direccion) {
      Alert.alert("Perfil", "Por favor, rellena todos los campos");
      return;
    }
    if (typeof imagen === "object") {
      let imagenRes = await subirImagen("perfil", imagen.uri, true);
      if (imagenRes.success) data.imagen = imagenRes.data;
      else data.imagen = null;
    }
    const res = await updateUsuarioData(usuario.id, data);
    console.log(usuario?.id);
    console.log("Resultado de la actualización", res);
    if (res.success) {
      setUsuarioData({ ...usuario, ...data }, usuario.id);
      router.back();
    }
  };

  const cambiarFoto = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!res.canceled) {
      setUsuario({ ..._usuario, imagen: res.assets[0] });
    }
  };

  return (
    <GestureHandlerRootView>
      <Pantalla colorFondo="white" style={{ flex: 1 }}>
        <View>
          <ScrollView style={{ padding: ancho(7) }}>
            <Cabecera titulo={"Editar Perfil"} atras={true}></Cabecera>
            <View style={styles.contenedorAvatar}>
              <Image
                source={
                  _usuario?.imagen
                    ? _usuario.imagen
                    : obtenerImagen(usuario?.imagen)
                }
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
              <View style={([styles.contenedor], { marginTop: 30, gap: 20 })}>
                <Campo
                  icon={
                    <Icon
                      name="usuario"
                      size={ancho(6)}
                      color={tema.colors.text}
                    />
                  }
                  placeholder="Nombre"
                  value={_usuario.nombre}
                  onChangeText={(value) =>
                    setUsuario({ ..._usuario, nombre: value })
                  }
                />
                <Campo
                  icon={
                    <Icon
                      name="telefono"
                      size={ancho(6)}
                      color={tema.colors.text}
                    />
                  }
                  placeholder="Teléfono"
                  value={_usuario.telefono}
                  onChangeText={(value) => {
                    setUsuario({ ..._usuario, telefono: value });
                  }}
                />
                <Campo
                  icon={
                    <Icon
                      name="perfil"
                      size={ancho(6)}
                      color={tema.colors.text}
                    />
                  }
                  placeholder="Direción"
                  value={_usuario.direccion}
                  onChangeText={(value) => {
                    setUsuario({ ..._usuario, direccion: value });
                  }}
                />
                <Campo
                  contenedorStyles={{ height: ancho(30) }}
                  placeholder="Biografía"
                  value={_usuario.biografia}
                  multiline={true}
                  onChangeText={(value) => {
                    setUsuario({ ..._usuario, biografia: value });
                  }}
                />
              </View>
              <Boton
                botonStyle={{ marginTop: 20 }}
                titulo="Actualizar"
                onPress={cambiarDatos}
              ></Boton>
            </View>
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
    paddingBottom: ancho(15),
  },
  contenedorCabecera: {
    marginHorizontal: ancho(4),
    marginBottom: 0,
    borderWidth: 5,
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
