import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { crearOActualizarPublicacion } from "../../services/publicaciones";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Pantalla from "../../components/Pantalla";
import Cabecera from "../../components/Cabecera";
import { tema } from "../../constants/tema";
import { useAuth } from "../../context/AuthContext";
import { obtenerImagen, supabase_url } from "../../services/imagenes";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import Badge from "../../components/Badge";
import Boton from "../../components/Boton";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { fuentes } from "../../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { crearNotificacion } from "../../services/notificaciones";

const NuevaPublicacion = () => {
  const { usuario } = useAuth();
  const router = useRouter();
  const textoRef = useRef("");
  const [archivo, setArchivo] = useState(null);
  const [publicando, setPublicando] = useState(false);
  const [mostrarModalEtiquetado, setMostrarModalEtiquetado] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosEtiquetados, setUsuariosEtiquetados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerUsuarios = async () => {
    try {
      const idsEtiquetados = usuariosEtiquetados.map((u) => u.id);
      const idsExcluir = [usuario.id, ...idsEtiquetados];

      let query = supabase
        .from("usuarios")
        .select("id, nombre, imagen")
        .ilike("nombre", `%${textoBusqueda}%`)
        .limit(20);

      if (idsExcluir.length > 0) {
        query = query.not("id", "in", `(${idsExcluir.join(",")})`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, datos: data };
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return { success: false, error };
    }
  };

  const abrirModalEtiquetado = async () => {
    const resultado = await obtenerUsuarios();
    if (resultado.success) setUsuarios(resultado.datos);
    setMostrarModalEtiquetado(true);
  };

  const manejarNotificaciones = async () => {
    usuariosEtiquetados.forEach(async (etiquetado) => {
      await crearNotificacion({
        id_emisor: usuario.id,
        id_receptor: etiquetado.id,
        titulo: "Nuevo etiquetado",
        cuerpo: `@${usuario.nombre} te ha etiquetado en su nueva publicación`,
      });
    });
  };

  const seleccionarUsuario = (usuario) => {
    setUsuariosEtiquetados([...usuariosEtiquetados, usuario]);
    setMostrarModalEtiquetado(false);
    setTextoBusqueda("");
  };

  const eliminarEtiquetado = (idUsuario) => {
    setUsuariosEtiquetados(
      usuariosEtiquetados.filter((u) => u.id !== idUsuario)
    );
  };

  const publicarContenido = async () => {
    if (!textoRef.current || !archivo) {
      Alert.alert("Aviso", "Debes completar todos los campos");
      return;
    }

    setPublicando(true);

    try {
      const datosPublicacion = {
        cuerpo: textoRef.current,
        archivo: archivo,
        id_usuario: usuario.id,
        etiquetados: usuariosEtiquetados.map((u) => u.id),
      };

      const resultado = await crearOActualizarPublicacion(datosPublicacion);
      if (resultado.success) {
        await manejarNotificaciones();
        setArchivo(null);
        textoRef.current = "";
        setUsuariosEtiquetados([]);
        router.push("inicio");
      } else {
        Alert.alert("Error", "No se pudo publicar el contenido");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al publicar");
    } finally {
      setPublicando(false);
    }
  };

  const obtenerUriArchivo = (archivo) => {
    if (!archivo) return null;
    if (typeof archivo === "object") return archivo.uri;
    return supabase_url(archivo.uri);
  };

  const seleccionarArchivo = async () => {
    const opciones = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    };

    const resultado = await ImagePicker.launchImageLibraryAsync(opciones);
    if (!resultado.canceled) {
      setArchivo(resultado.assets[0]);
    }
  };

  const esArchivoLocal = (archivo) => {
    if (!archivo) return null;
    if (typeof archivo === "object") return true;
    return false;
  };

  const obtenerTipoArchivo = (archivo) => {
    if (!archivo) return null;
    if (esArchivoLocal(archivo)) {
      return archivo.type?.startsWith("video") ? "video" : "imagen";
    }
    return archivo.includes("imagen") ? "imagen" : "video";
  };

  useEffect(() => {
    if (mostrarModalEtiquetado) {
      obtenerUsuarios().then((resultado) => {
        if (resultado.success) setUsuarios(resultado.datos);
      });
    }
  }, [textoBusqueda]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla>
        <View style={styles.contenedorPrincipal}>
          <Cabecera titulo="Crear publicación" atras={true} />

          <ScrollView
            contentContainerStyle={styles.contenidoScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.seccionUsuario}>
              <Image
                source={obtenerImagen(usuario?.imagen)}
                style={styles.imagenUsuario}
              />
              <Text style={styles.nombreUsuario}>{usuario?.nombre}</Text>
            </View>

            {usuariosEtiquetados.length > 0 && (
              <View style={styles.contenedorEtiquetados}>
                <Text style={styles.textoEtiquetado}>Etiquetando a:</Text>
                <View style={styles.listaEtiquetados}>
                  {usuariosEtiquetados.map((usuario) => (
                    <View
                      key={usuario.id}
                      style={styles.tarjetaUsuarioEtiquetado}
                    >
                      <Image
                        source={obtenerImagen(usuario.imagen)}
                        style={styles.imagenEtiquetado}
                      />
                      <Text style={styles.nombreEtiquetado}>
                        {usuario.nombre}
                      </Text>
                      <TouchableOpacity
                        onPress={() => eliminarEtiquetado(usuario.id)}
                        style={styles.botonEliminarEtiquetado}
                      >
                        <Ionicons
                          name="close"
                          size={20}
                          color={tema.colors.texto}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.contenedorTexto}>
              <RNTextInput
                multiline
                numberOfLines={5}
                onChangeText={(value) => (textoRef.current = value)}
                placeholder="¿Qué estás pensando?"
                placeholderTextColor={tema.colors.texto}
                style={styles.inputTexto}
              />
            </View>

            {archivo && (
              <View style={styles.contenedorArchivo}>
                {obtenerTipoArchivo(archivo) === "video" ? (
                  <Video
                    style={styles.videoPrevisualizacion}
                    source={{ uri: obtenerUriArchivo(archivo) }}
                    useNativeControls
                    resizeMode="cover"
                    isLooping
                  />
                ) : (
                  <Image
                    source={{ uri: obtenerUriArchivo(archivo) }}
                    style={styles.imagenPrevisualizacion}
                  />
                )}
                <Badge
                  icono="trash"
                  color={"rgba(240, 27, 27, 0.68)"}
                  onPress={() => setArchivo(null)}
                  estilosExtra={styles.botonEliminarArchivo}
                />
              </View>
            )}

            <View style={styles.contenedorBotones}>
              <Pressable
                style={styles.botonAgregar}
                onPress={seleccionarArchivo}
              >
                <Ionicons
                  name="image-outline"
                  size={28}
                  color={tema.colors.principal}
                />
              </Pressable>
              <Pressable
                style={styles.botonAgregar}
                onPress={abrirModalEtiquetado}
              >
                <Ionicons
                  name="person-add-outline"
                  size={28}
                  color={
                    usuariosEtiquetados.length > 0
                      ? tema.colors.principal
                      : tema.colors.texto
                  }
                />
              </Pressable>
            </View>

            <Boton
              titulo={publicando ? "Publicando..." : "Publicar"}
              alPresionar={publicarContenido}
              deshabilitado={publicando || !archivo}
              estilosContenedor={styles.botonPublicar}
              estilosTexto={styles.textoBotonPublicar}
            />
          </ScrollView>
        </View>

        <Modal
          visible={mostrarModalEtiquetado}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setMostrarModalEtiquetado(false)}
        >
          <View style={styles.contenedorModal}>
            <View style={styles.cabeceraModal}>
              <Text style={styles.tituloModal}>Etiquetar usuarios</Text>
              <Pressable
                style={styles.botonCerrarModal}
                onPress={() => setMostrarModalEtiquetado(false)}
              >
                <Ionicons name="close" size={24} color={tema.colors.texto} />
              </Pressable>
            </View>

            <RNTextInput
              placeholder="Buscar usuarios..."
              value={textoBusqueda}
              onChangeText={setTextoBusqueda}
              style={styles.inputBusqueda}
              placeholderTextColor={tema.colors.textoSecundario}
            />

            <FlatList
              data={usuarios}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemUsuario}
                  onPress={() => seleccionarUsuario(item)}
                >
                  <Image
                    source={obtenerImagen(item.imagen)}
                    style={styles.imagenUsuarioModal}
                  />
                  <Text style={styles.nombreUsuarioModal}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listaUsuarios}
            />
          </View>
        </Modal>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contenidoScroll: {
    paddingBottom: 24,
  },
  seccionUsuario: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  imagenUsuario: {
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
  contenedorEtiquetados: {
    marginBottom: 16,
  },
  textoEtiquetado: {
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
    marginBottom: 8,
  },
  listaEtiquetados: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tarjetaUsuarioEtiquetado: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.colors.fondoSecundario,
    padding: 8,
    borderRadius: 20,
  },
  imagenEtiquetado: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  nombreEtiquetado: {
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
    marginRight: 8,
  },
  botonEliminarEtiquetado: {
    padding: 4,
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
    fontSize: 16,
    color: tema.colors.texto,
    fontFamily: fuentes.Poppins,
  },
  contenedorArchivo: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imagenPrevisualizacion: {
    width: "100%",
    height: 300,
    backgroundColor: tema.colors.fondo,
  },
  videoPrevisualizacion: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },
  botonEliminarArchivo: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  contenedorBotones: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  botonAgregar: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
  },
  botonPublicar: {
    backgroundColor: tema.colors.principal,
    borderRadius: 8,
    paddingVertical: 14,
  },
  textoBotonPublicar: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fuentes.PoppinsSemiBold,
  },
  contenedorModal: {
    flex: 1,
    backgroundColor: tema.colors.fondo,
    padding: 16,
  },
  cabeceraModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tituloModal: {
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: 20,
    color: tema.colors.texto,
  },
  botonCerrarModal: {
    padding: 8,
  },
  inputBusqueda: {
    backgroundColor: tema.colors.fondoSecundario,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
  },
  listaUsuarios: {
    paddingBottom: 24,
  },
  itemUsuario: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  imagenUsuarioModal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nombreUsuarioModal: {
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
    fontSize: 16,
  },
});

export default NuevaPublicacion;
