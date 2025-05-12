import {
  Image,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { ancho, alto } from "../helpers/dimensiones";
import { tema } from "../constants/tema";
import { obtenerImagen } from "../services/imagenes";
import { fuentes } from "../constants/fuentes";
import moment from "moment";
import { TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  buscarLikesPorIdPublicacion,
  agregarLikePorIdPublicacion,
  agregarComentario,
  obtenerComentariosPorPublicacion,
} from "../services/publicaciones";
import { crearNotificacion } from "../services/notificaciones";
import { contarComentariosPublicacion } from "../services/publicaciones";

const Publicacion = ({ item, usuarioActual, router }) => {
  const [likes, setLikes] = useState([]);
  const [likeYaExistente, setLikeYaExistente] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [comentariosModal, setComentariosModal] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [cargandoComentarios, setCargandoComentarios] = useState(false);
  const [numeroComentarios, setNumeroComentarios] = useState(0);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const resultadoLikes = await buscarLikesPorIdPublicacion(item.id);
        if (resultadoLikes.success) {
          setLikes(resultadoLikes.data);
          const existeLike = resultadoLikes.data.some(
            (like) => like.id_usuario === usuarioActual.id
          );
          setLikeYaExistente(existeLike);
        }
      } catch (error) {
        console.error("Error cargando likes:", error);
      }
    };

    cargarDatosIniciales();
    cargarNumeroComentarios();
  }, [item.id, usuarioActual]);

  const cargarNumeroComentarios = async () => {
    try {
      const resultado = await contarComentariosPublicacion(item.id);
      if (resultado.success) {
        setNumeroComentarios(resultado.data);
      }
    } catch (error) {
      console.error("Error cargando el número de comentarios:", error);
    }
  };

  const cargarComentarios = useCallback(async () => {
    try {
      setCargandoComentarios(true);
      const resultado = await obtenerComentariosPorPublicacion(item.id);
      if (resultado.success) {
        setComentarios(resultado.data);
      }
    } catch (error) {
      console.error("Error cargando comentarios:", error);
    } finally {
      setCargandoComentarios(false);
    }
  }, [item.id]);

  const toggleComentariosModal = useCallback(async () => {
    if (!comentariosModal) {
      await cargarComentarios();
    }
    setComentariosModal(!comentariosModal);
  }, [comentariosModal, cargarComentarios]);

  const manejarLike = useCallback(async () => {
    try {
      const resultado = await agregarLikePorIdPublicacion(
        item.id,
        usuarioActual.id
      );

      if (resultado.success) {
        setLikes(resultado.data);
        setLikeYaExistente(resultado.accion === "like_agregado");

        if (resultado.accion === "like_agregado") {
          await crearNotificacion({
            id_emisor: usuarioActual.id,
            id_receptor: item.id_usuario,
            titulo: "Nuevo like",
            cuerpo: `${usuarioActual.nombre} le dio like a tu publicación`,
          });
        }
      }
    } catch (error) {
      console.error("Error manejando like:", error);
    }
  }, [item.id, item.id_usuario, usuarioActual]);

  const publicarComentario = useCallback(async () => {
    if (nuevoComentario.trim() === "") return;

    try {
      const resultado = await agregarComentario(
        item.id,
        usuarioActual.id,
        nuevoComentario
      );

      if (resultado.success) {
        setNuevoComentario("");
        await cargarComentarios();
        await cargarNumeroComentarios();
        await crearNotificacion({
          id_emisor: usuarioActual.id,
          id_receptor: item.id_usuario,
          titulo: "Nuevo comentario",
          cuerpo: `${usuarioActual.nombre} comentó "${nuevoComentario}"`,
        });
      }
    } catch (error) {
      console.error("Error publicando comentario:", error);
    }
  }, [
    item.id,
    item.id_usuario,
    nuevoComentario,
    usuarioActual,
    cargarComentarios,
  ]);

  const renderComentario = useCallback(
    ({ item: comentario }) => (
      <View style={styles.comentarioItem}>
        <Image
          source={obtenerImagen(comentario.usuario?.imagen)}
          style={styles.comentarioUserImage}
        />
        <View style={styles.comentarioContent}>
          <Text style={styles.comentarioUsername}>
            {comentario.usuario?.nombre}
          </Text>
          <Text style={styles.comentarioText}>{comentario.cuerpo}</Text>
          <Text style={styles.comentarioFecha}>
            {moment(comentario.created_at).fromNow()}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const renderEtiquetado = useCallback(
    (etiquetado) => (
      <Pressable
        key={etiquetado.id}
        onPress={() =>
          router.push({
            pathname: "/perfilUsuario",
            params: { idUsuario: etiquetado.id },
          })
        }
      >
        <Text style={styles.etiquetadoNombre}>@{etiquetado.nombre}</Text>
      </Pressable>
    ),
    []
  );

  const fechaParseada = moment(item?.created_at).format("D MMM");

  return (
    <View style={styles.contendor}>
      <View style={styles.cabecera}>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Image
            source={obtenerImagen(item?.autor?.imagen)}
            transition={100}
            borderRadius={100}
            style={styles.avatar}
          />
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/perfilUsuario",
                params: { idUsuario: item.id_usuario },
              })
            }
          >
            <View style={{ gap: 0 }}>
              <Text style={styles.nombreUsuario}>{item?.autor?.nombre}</Text>
              <Text style={styles.fechaPublicacion}>{fechaParseada}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.contenido}>
        <Image
          source={obtenerImagen(item?.archivo)}
          transition={100}
          borderRadius={tema.radius.sm}
          style={styles.imagenPublicacion}
        />

        <View style={styles.interacciones}>
          <View style={styles.botonInteraccion}>
            <Pressable onPress={manejarLike}>
              <Ionicons
                name={likeYaExistente ? "heart" : "heart-outline"}
                size={23}
                color={
                  likeYaExistente ? tema.colors.iconos : tema.colors.iconosDark
                }
              />
            </Pressable>
            <Text style={styles.contadorInteraccion}>{likes?.length}</Text>
          </View>

          <TouchableOpacity
            style={styles.botonInteraccion}
            onPress={toggleComentariosModal}
          >
            <Ionicons
              name="chatbubble-outline"
              size={21}
              color={tema.colors.iconosDark}
            />
            <Text style={styles.contadorInteraccion}>{numeroComentarios}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cuerpo}>
          <Text style={styles.textoCuerpo}>
            <Text style={styles.nombreUsuarioCuerpo}>
              {item?.autor?.nombre}
            </Text>
            {": "}
            {item?.cuerpo}
          </Text>

          {item.etiquetados && item.etiquetados.length > 0 && (
            <View style={styles.etiquetadosContainer}>
              <Text style={styles.etiquetadosTitulo}>Etiquetados:</Text>
              <View style={styles.etiquetadosLista}>
                {item.etiquetados.map(renderEtiquetado)}
              </View>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={comentariosModal}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleComentariosModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContenedor}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comentarios</Text>
              <TouchableOpacity onPress={toggleComentariosModal}>
                <Ionicons name="close" size={24} color={tema.colors.text} />
              </TouchableOpacity>
            </View>

            {cargandoComentarios ? (
              <ActivityIndicator size="large" color={tema.colors.primary} />
            ) : (
              <FlatList
                data={comentarios}
                renderItem={renderComentario}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.comentariosLista}
                ListEmptyComponent={
                  <Text style={styles.noComentariosText}>
                    No hay comentarios aún
                  </Text>
                }
              />
            )}

            <View style={styles.comentarioInputContenedor}>
              <TextInput
                style={styles.comentarioInput}
                placeholder="Escribe un comentario..."
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
                multiline
              />
              <TouchableOpacity
                style={styles.comentarioButton}
                onPress={publicarComentario}
                disabled={nuevoComentario.trim() === ""}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Publicacion;

const styles = StyleSheet.create({
  contendor: {
    gap: 10,
    marginBottom: 30,
    borderRadius: tema.radius.lg,
    padding: 10,
    backgroundColor: "#F4F4F4",
  },
  contenido: {
    gap: 10,
  },
  cabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: ancho(10),
    height: ancho(10),
  },
  nombreUsuario: {
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: alto(2),
  },
  fechaPublicacion: {
    fontFamily: fuentes.Poppins,
    fontSize: alto(1.2),
  },
  imagenPublicacion: {
    width: ancho(80),
    height: ancho(80),
    alignSelf: "center",
  },
  interacciones: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  botonInteraccion: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  contadorInteraccion: {
    fontFamily: fuentes.Poppins,
    marginTop: 3,
  },
  cuerpo: {
    marginTop: 10,
  },
  textoCuerpo: {
    fontSize: ancho(4),
    color: tema.colors.text,
    fontFamily: fuentes.Poppins,
  },
  nombreUsuarioCuerpo: {
    fontWeight: tema.fonts.bold,
    color: "black",
  },
  etiquetadosContainer: {
    marginTop: 10,
  },
  etiquetadosTitulo: {
    fontFamily: fuentes.PoppinsSemiBold,
    color: tema.colors.textSecondary,
    marginBottom: 5,
  },
  etiquetadosLista: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  etiquetadoNombre: {
    fontFamily: fuentes.Poppins,
    color: tema.colors.primary,
    backgroundColor: tema.colors.fondoSecundario,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContenedor: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fuentes.PoppinsSemiBold,
  },
  comentariosLista: {
    flexGrow: 1,
    paddingBottom: 15,
  },
  comentarioItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  comentarioUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  comentarioContent: {
    flex: 1,
    backgroundColor: tema.colors.fondoInput,
    padding: 12,
    borderRadius: 12,
  },
  comentarioUsername: {
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: 14,
  },
  comentarioText: {
    fontFamily: fuentes.Poppins,
    fontSize: 14,
    marginTop: 2,
  },
  comentarioFecha: {
    fontFamily: fuentes.Poppins,
    fontSize: 12,
    color: tema.colors.textSecondary,
    marginTop: 4,
  },
  noComentariosText: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: fuentes.Poppins,
    color: tema.colors.textSecondary,
  },
  comentarioInputContenedor: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: tema.colors.border,
    paddingTop: 10,
  },
  comentarioInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: tema.colors.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontFamily: fuentes.Poppins,
    maxHeight: 100,
  },
  comentarioButton: {
    backgroundColor: tema.colors.primary,
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});
