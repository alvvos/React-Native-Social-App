import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { crearOActualizarPublicacion } from "../../services/publicaciones";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Pantalla from "../../components/Pantalla";
import Cabecera from "../../components/Cabecera";
import { ancho, alto } from "../../helpers/dimensiones";
import { tema } from "../../constants/tema";
import { useAuth } from "../../context/AuthContext";
import { obtenerImagen, supabase_url } from "../../services/imagenes";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import Badge from "../../components/Badge";
import Boton from "../../components/Boton";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { use } from "react";
import { fuentes } from "../../constants/fuentes";

const nuevaPublicacion = () => {
  const { usuario, setAuth } = useAuth();
  const router = useRouter();
  const textoRef = useRef("");
  const [archivo, setArchivo] = useState(archivo);

  const Publicar = async () => {
    if (!textoRef.current || !archivo) {
      Alert.alert("Aviso", "Completa todos los campos");
      return;
    }

    let data = {
      cuerpo: textoRef.current,
      archivo: archivo,
      id_usuario: usuario.id,
    };

    let res = await crearOActualizarPublicacion(data);
    if (res.success) {
      setArchivo(null);
      textoRef.current = "";
      router.push("inicio");
    } else {
      Alert.alert("Aviso", "Ha habido un problema al publicar la publicación");
    }
  };

  const getUri = (archivo) => {
    if (!archivo) return null;
    if (esLocal(archivo)) {
      return archivo.uri;
    }
    return supabase_url(archivo.uri);
  };

  const subirArchivo = async () => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 16],
      quality: 1,
    };

    let res = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    console.log("archivo: ", res.assets[0]);
    if (!res.canceled) {
      setArchivo(res.assets[0]);
    }
  };

  const esLocal = (archivo) => {
    if (!archivo) return null;
    if (typeof archivo === "object") return true;
    return false;
  };

  const getTipoArchivo = (archivo) => {
    if (!archivo) return null;
    if (esLocal(archivo)) {
      return archivo.type;
    }

    if (archivo.includes("imagen")) {
      return "imagen";
    }

    return "video";
  };

  return (
    <GestureHandlerRootView>
      <Pantalla>
        <View
          style={{
            flex: 1,
            padding: ancho(7),
          }}
        >
          <ScrollView>
            <Cabecera titulo="Publicación" atras="true"></Cabecera>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Image
                source={obtenerImagen(usuario?.imagen)}
                size={ancho(2)}
                borderRadius={100}
                alignSelf="right"
                transition={100}
                style={{
                  width: ancho(40),
                  height: ancho(40),
                  marginTop: 25,
                }}
              />
            </View>
            <View
              style={{
                marginTop: 30,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#fff",
                textAlignVertical: "top",
              }}
            >
              <TextInput
                multiline
                onChangeText={(value) => {
                  textoRef.current = value;
                }}
                placeholder="Escribe algo..."
                contentStyle={{
                  color: "#000",
                  fontSize: 15,
                  textAlignVertical: "top",
                  textAlign: "left",
                  padding: 10,
                  backgroundColor: "#fff",
                  height: 200,
                  fontFamily: fuentes.Poppins,
                }}
              />
            </View>
            {archivo && (
              <View
                styles={{
                  height: alto(20),
                  width: "100%",
                  borderRadius: tema.radius.xl,
                  borderCurve: "continuous",
                  overflow: "hidden",
                }}
              >
                {getTipoArchivo(archivo) == "video" ? (
                  <Video
                    style={{
                      width: ancho(80),
                      height: ancho(50),
                      marginTop: 30,
                    }}
                    source={{ uri: getUri(archivo) }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                  />
                ) : (
                  <Image
                    source={{ uri: getUri(archivo) }}
                    size={ancho(2)}
                    borderRadius={tema.radius.md}
                    alignSelf="center"
                    transition={100}
                    style={{
                      width: ancho(85),
                      height: ancho(50),
                      marginTop: 30,
                    }}
                  />
                )}
                <Badge
                  estilosExtra={{
                    marginLeft: 0,
                    position: "absolute",
                    top: 40,
                    right: 10,
                  }}
                  icono="trash"
                  color="rgb(180, 42, 42)"
                  onPress={() => setArchivo(null)}
                />
              </View>
            )}
            <View
              style={{
                marginTop: 30,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#fff",
                textAlignVertical: "top",
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Badge
                  icono="folder"
                  onPress={subirArchivo}
                  estilosExtra={{ marginTop: 0 }}
                />
              </View>
            </View>
            <Boton
              botonStyles={{ marginTop: 30 }}
              titulo="Publicar"
              alPresionar={Publicar}
            ></Boton>
          </ScrollView>
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
    flex: 1,
    height: alto(10),
    width: ancho(100),
    alignSelf: "center",
    borderWidth: 3,
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
