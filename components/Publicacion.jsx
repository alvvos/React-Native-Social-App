import { Image, StyleSheet, Text, View, Modal, TextInput } from "react-native";
import React from "react";
import { ancho, alto } from "../helpers/dimensiones";
import { tema } from "../constants/tema";
import { obtenerImagen } from "../services/imagenes";
import { fuentes } from "../constants/fuentes";
import { useEffect } from "react";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable } from "react-native";
import {
  buscarLikesPorIdPublicacion,
  agregarLikePorIdPublicacion,
  agregarComentario,
  obtenerComentariosPorPublicacion,
} from "../services/publicaciones";
import { crearNotificacion } from "../services/notificaciones";
import { useAuth } from "../context/AuthContext";

const Publicacion = ({ item, usuarioActual, router }) => {
  const [likes, setLikes] = useState([]);
  const [likeYaExistente, setLikeYaExistente] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [comentariosModal, setComentariosModal] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");

  useEffect(() => {
    const cargarLikes = async () => {
      const resultado = await buscarLikesPorIdPublicacion(item.id);
      if (resultado.success) {
        setLikes(resultado.data);
      }
    };

    const verificarLike = async () => {
      {
        likes.map((like) => {
          if (like.id_usuario === usuarioActual.id) {
            setLikeYaExistente(true);
          }
        });
      }
    };
    cargarLikes();
    verificarLike();
  }, [item.id, likes, comentarios]);

  const cargarComentarios = async () => {
    const resultado = await obtenerComentariosPorPublicacion(item.id);
    if (resultado.success) {
      setComentarios(resultado.data);
    }
  };

  const verPerfilUsuario = () => {
    router.push({
      pathname: "/perfilUsuario",
      params: { idUsuario: item.id_usuario },
    });
  };

  const fechaParseada = moment(item?.created_at).format("D MMM");

  const manejarLike = async () => {
    const resultado = await agregarLikePorIdPublicacion(
      item.id,
      usuarioActual.id
    );
    if (resultado.success && resultado.accion === "like_agregado") {
      setLikes(resultado.data);

      const response = await crearNotificacion({
        id_emisor: usuarioActual.id,
        id_receptor: item.id_usuario,
        titulo: "Nuevo like",
        cuerpo: `${usuarioActual.nombre} le dio like a tu publicación`,
      });

      if (response.success) {
        console.log(response.data);
      }
    }
  };

  const verDetalles = () => {};

  const toggleComentariosModal = async () => {
    if (!comentariosModal) {
      await cargarComentarios();
    }
    setComentariosModal(!comentariosModal);
  };

  const publicarComentario = async () => {
    if (nuevoComentario.trim() === "") return;

    const resultado = await agregarComentario(
      item.id,
      usuarioActual.id,
      nuevoComentario
    );

    if (resultado.success) {
      await cargarComentarios();
      const response = await crearNotificacion({
        id_emisor: usuarioActual.id,
        id_receptor: item.id_usuario,
        titulo: "Nuevo comentario",
        cuerpo: `${usuarioActual.nombre} comentó "${nuevoComentario}"`,
      });
      if (response.success) {
        console.log(response.data);
        setNuevoComentario("");
      }
    }
  };

  return (
    <View style={[styles.contendor]}>
      <View style={styles.cabecera}>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Image
            source={obtenerImagen(item?.usuario?.imagen)}
            transition={100}
            borderRadius={100}
            style={{
              width: ancho(10),
              height: ancho(10),
            }}
          />
          <Pressable onPress={verPerfilUsuario}>
            <View style={{ gap: 0 }}>
              <Text
                style={{
                  fontFamily: fuentes.PoppinsSemiBold,
                  fontSize: alto(2),
                }}
              >
                {item?.usuario?.nombre}
              </Text>
              <Text
                style={{
                  fontFamily: fuentes.Poppins,
                  fontSize: alto(1.2),
                }}
              >
                {fechaParseada}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={styles.contenido}>
        <Image
          source={obtenerImagen(item?.archivo)}
          transition={100}
          borderRadius={tema.radius.sm}
          style={{
            width: ancho(80),
            height: ancho(80),
          }}
        />
        <View style={{ flex: 1, flexDirection: "row", marginTop: 10, gap: 15 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Pressable onPress={manejarLike}>
              {likeYaExistente ? (
                <Ionicons name="heart" size={23} color={tema.colors.iconos} />
              ) : (
                <Ionicons
                  name="heart-outline"
                  size={23}
                  color={tema.colors.iconos}
                />
              )}
            </Pressable>
            <Text style={{ fontFamily: fuentes.Poppins, marginTop: 3 }}>
              {likes?.length}
            </Text>
          </View>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            onPress={toggleComentariosModal}
          >
            <Ionicons
              name="chatbubble-outline"
              size={21}
              color={tema.colors.iconosDark}
            />
            <Text style={{ fontFamily: fuentes.Poppins, marginTop: 3 }}>
              {comentarios?.length}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cuerpo}>
          <Text style={styles.cuerpo}>
            <Text style={{ fontWeight: tema.fonts.bold, color: "black" }}>
              {item?.usuario?.nombre}
            </Text>
            {": "}
            {item?.cuerpo}
          </Text>
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

            <View style={styles.comentariosLista}>
              {comentarios.length > 0 ? (
                comentarios.map((comentario) => (
                  <View key={comentario.id} style={styles.comentarioItem}>
                    <Image
                      source={obtenerImagen(comentario.usuario?.imagen)}
                      style={styles.comentarioUserImage}
                    />
                    <View style={styles.comentarioContent}>
                      <Text style={styles.comentarioUsername}>
                        {comentario.usuario?.nombre}
                      </Text>
                      <Text style={styles.comentarioText}>
                        {comentario.cuerpo}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noComentariosText}>
                  No hay comentarios aún
                </Text>
              )}
            </View>

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
    borderCurve: "continuous",
    padding: 10,
    backgroundColor: "#F4F4F4",
    flex: 1,
    flexDirection: "col",
  },
  contenido: {
    flex: 1,
    flexDirection: "col",
  },
  cabecera: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
  },
  cuerpo: {
    fontSize: ancho(4),
    color: tema.colors.text,
    marginTop: 10,
    fontFamily: fuentes.Poppins,
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
    flex: 1,
    marginBottom: 15,
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
    paddingTop: 20,
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
