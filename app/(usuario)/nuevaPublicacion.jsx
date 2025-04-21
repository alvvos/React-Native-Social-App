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
import { fuentes } from "../../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";

const NuevaPublicacion = () => {
  const { usuario } = useAuth();
  const router = useRouter();
  const textoRef = useRef("");
  const [archivo, setArchivo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Publicar = async () => {
    if (!textoRef.current || !archivo) {
      Alert.alert("Aviso", "Completa todos los campos");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        cuerpo: textoRef.current,
        archivo: archivo,
        id_usuario: usuario.id,
      };

      const res = await crearOActualizarPublicacion(data);
      if (res.success) {
        setArchivo(null);
        textoRef.current = "";
        router.push("inicio");
      } else {
        Alert.alert("Error", "Ha habido un problema al publicar");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al procesar tu publicación");
    } finally {
      setIsSubmitting(false);
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
    const mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    };

    const res = await ImagePicker.launchImageLibraryAsync(mediaConfig);
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
      return archivo.type?.startsWith("video") ? "video" : "imagen";
    }
    return archivo.includes("imagen") ? "imagen" : "video";
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla colorFondo="#f8f8f8">
        <View style={styles.contenedorPrincipal}>
          <Cabecera titulo="Crear publicación" atras={true} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Sección del usuario */}
            <View style={styles.seccionUsuario}>
              <Image
                source={obtenerImagen(usuario?.imagen)}
                style={styles.avatarUsuario}
              />
              <Text style={styles.nombreUsuario}>{usuario?.nombre}</Text>
            </View>

            {/* Área de texto */}
            <View style={styles.contenedorTexto}>
              <TextInput
                multiline
                numberOfLines={5}
                onChangeText={(value) => (textoRef.current = value)}
                placeholder="¿Qué estás pensando?"
                placeholderTextColor={tema.colors.gris}
                style={styles.inputTexto}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                theme={{ colors: { primary: tema.colors.primary } }}
              />
            </View>

            {/* Vista previa del archivo */}
            {archivo && (
              <View style={styles.contenedorArchivo}>
                {getTipoArchivo(archivo) === "video" ? (
                  <Video
                    style={styles.videoPreview}
                    source={{ uri: getUri(archivo) }}
                    useNativeControls
                    resizeMode="cover"
                    isLooping
                  />
                ) : (
                  <Image
                    source={{ uri: getUri(archivo) }}
                    style={styles.imagenPreview}
                  />
                )}
                <Badge
                  icono="trash"
                  color={"rgba(240, 27, 27, 0.68)"}
                  onPress={() => setArchivo(null)}
                  estilosExtra={styles.botonEliminar}
                />
              </View>
            )}

            {/* Botón para subir archivo */}
            <Pressable style={styles.addMediaButton} onPress={subirArchivo}>
              <Ionicons
                name="image-outline"
                size={28}
                color={tema.colors.primary}
              />
            </Pressable>

            {/* Botón de publicar */}
            <Boton
              titulo={isSubmitting ? "Publicando..." : "Publicar"}
              alPresionar={Publicar}
              deshabilitado={isSubmitting || !archivo}
              estilosContenedor={styles.botonPublicar}
              estilosTexto={styles.textoBotonPublicar}
            />
          </ScrollView>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  seccionUsuario: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  addMediaButton: {
    alignSelf: "flex-start",
    padding: 12,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    marginBottom: 24,
  },
  avatarUsuario: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  nombreUsuario: {
    fontSize: 16,
    fontFamily: fuentes.PoppinsSemiBold,
    color: tema.colors.texto,
  },
  contenedorTexto: {
    borderRadius: 12,
    backgroundColor: "rgba(37, 37, 37, 0.05)",
    marginBottom: 24,
  },
  inputTexto: {
    minHeight: 160,
    padding: 16,
    textAlignVertical: "top",
    backgroundColor: "transparent",
    fontSize: 15,
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
  },
  contenedorArchivo: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imagenPreview: {
    width: "100%",
    height: 300,
    backgroundColor: tema.colors.fondo,
  },
  videoPreview: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },
  botonEliminar: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  contenedorSubirArchivo: {
    marginBottom: 32,
  },
  botonSubir: {
    borderColor: tema.colors.primary,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
  },
  textoBotonSubir: {
    color: tema.colors.primary,
    fontSize: 15,
    fontFamily: fuentes.PoppinsSemiBold,
  },
  botonPublicar: {
    backgroundColor: tema.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  textoBotonPublicar: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fuentes.PoppinsSemiBold,
  },
});

export default NuevaPublicacion;
