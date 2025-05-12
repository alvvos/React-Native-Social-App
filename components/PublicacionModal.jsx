import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "../constants/tema";
import { fuentes } from "../constants/fuentes";
import { obtenerImagen } from "../services/imagenes";
import {
  buscarLikesPorIdPublicacion,
  obtenerComentariosPorPublicacion,
  crearOActualizarPublicacion,
  borrarPublicacionPorId,
  obtenerEtiquetadosPorIdPublicacion,
} from "../services/publicaciones";
import { useRouter } from "expo-router";

const PublicacionModal = ({
  visible,
  onClose,
  publicacion,
  usuario,
  onPublicacionActualizada,
  onPublicacionEliminada,
}) => {
  const [likes, setLikes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [editando, setEditando] = useState(false);
  const [nuevoCuerpo, setNuevoCuerpo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [etiquetados, setEtiquetados] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (publicacion && visible) {
      cargarDatosPublicacion();
    }
  }, [publicacion, visible]);

  const cargarDatosPublicacion = async () => {
    setCargando(true);
    try {
      const resLikes = await buscarLikesPorIdPublicacion(publicacion.id);
      if (resLikes.success) setLikes(resLikes.data);

      const resComentarios = await obtenerComentariosPorPublicacion(
        publicacion.id
      );
      if (resComentarios.success) setComentarios(resComentarios.data);
      const resEtiquetados = await obtenerEtiquetadosPorIdPublicacion(
        publicacion.id
      );
      if (resEtiquetados.success) setEtiquetados(resEtiquetados.data);
    } catch (error) {
      console.error("Error cargando datos de publicación:", error);
    } finally {
      setCargando(false);
    }
  };

  const renderEtiquetados = () => (
    <View style={styles.etiquetadosContainer}>
      <View style={styles.etiquetadosLista}>
        {etiquetados?.map((etiquetado) => (
          <Pressable
            key={etiquetado.id}
            onPress={() => {
              onClose();
              router.push({
                pathname: "/perfilUsuario",
                params: { idUsuario: etiquetado.id_usuario.id },
              });
            }}
            style={styles.etiquetadoItem}
          >
            <Image
              source={obtenerImagen(etiquetado.id_usuario.imagen)}
              style={styles.etiquetadoImagen}
            />
            <Text style={styles.etiquetadoNombre}>
              @{etiquetado.id_usuario.nombre}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const borrarPublicacion = async () => {
    const res = await borrarPublicacionPorId(publicacion.id);
    if (res.success) {
      onPublicacionEliminada();
      onClose();
    }
  };

  const manejarEdicion = async () => {
    if (editando) {
      const res = await crearOActualizarPublicacion({
        id: publicacion.id,
        cuerpo: nuevoCuerpo,
        id_usuario: usuario.id,
        archivo: publicacion.archivo,
      });

      if (res.success) {
        onPublicacionActualizada({
          ...publicacion,
          cuerpo: nuevoCuerpo,
        });
        setEditando(false);
      }
    } else {
      setNuevoCuerpo(publicacion.cuerpo);
      setEditando(true);
    }
  };

  if (!publicacion) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={onClose} />

        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color={tema.colors.texto} />
            </Pressable>
          </View>

          {cargando ? (
            <ActivityIndicator size="large" color={tema.colors.primary} />
          ) : (
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalUserInfo}>
                <Image
                  source={obtenerImagen(usuario?.imagen)}
                  style={styles.modalUserImage}
                />
                <Text style={styles.modalUserName}>{usuario?.nombre}</Text>
              </View>

              <View style={styles.modalImagenContainer}>
                <Image
                  source={obtenerImagen(publicacion.archivo)}
                  style={styles.modalImagen}
                  contentFit="contain"
                />
              </View>

              <View style={styles.modalCuerpoContainer}>
                {editando ? (
                  <TextInput
                    style={styles.inputEdicion}
                    value={nuevoCuerpo}
                    onChangeText={setNuevoCuerpo}
                    multiline
                  />
                ) : (
                  <Text style={styles.textoCuerpo}>
                    <Text style={styles.nombreUsuario}>{usuario?.nombre}</Text>
                    {": "}
                    {publicacion.cuerpo}
                  </Text>
                )}
              </View>
              {etiquetados?.length > 0 && renderEtiquetados()}
              <View style={styles.interaccionesContainer}>
                <View style={styles.likesContainer}>
                  <View style={styles.likesComentarios}>
                    <Ionicons
                      name="heart"
                      size={24}
                      color={tema.colors.primary}
                    />
                    <Text style={styles.interaccionTexto}>
                      {likes.length} me gusta
                      {likes.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View style={styles.botonesAccion}>
                    <Pressable
                      onPress={manejarEdicion}
                      style={[
                        styles.botonAccion,
                        editando ? styles.botonGuardar : styles.botonEditar,
                      ]}
                    >
                      <Ionicons
                        name={editando ? "checkmark" : "ellipsis-horizontal"}
                        size={20}
                        color="white"
                      />
                    </Pressable>

                    {!editando && (
                      <Pressable
                        onPress={borrarPublicacion}
                        style={[styles.botonAccion, styles.botonEliminar]}
                      >
                        <Ionicons name="trash" size={20} color="white" />
                      </Pressable>
                    )}
                  </View>
                </View>

                <View style={styles.comentariosContainer}>
                  <Text style={styles.comentariosTitulo}>
                    Comentarios ({comentarios.length})
                  </Text>
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
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 16,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalScroll: {
    paddingBottom: 24,
  },
  modalUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalUserImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  modalUserName: {
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: 16,
  },
  modalImagenContainer: {
    padding: 16,
  },
  modalImagen: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#fafafa",
    borderRadius: 12,
  },
  modalCuerpoContainer: {
    marginLeft: 20,
    marginVertical: 5,
    flex: 1,
  },
  inputEdicion: {
    fontFamily: fuentes.Poppins,
    borderWidth: 1,
    borderColor: tema.colors.grisClaro,
    borderRadius: 8,
    padding: 10,
    marginRight: 20,
  },
  etiquetadosContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  etiquetadosLista: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  etiquetadoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  etiquetadoImagen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  etiquetadoNombre: {
    fontFamily: fuentes.Poppins,
    color: "rgb(0, 0, 0)",
    fontSize: 14,
  },
  textoCuerpo: {
    fontFamily: fuentes.Poppins,
  },
  nombreUsuario: {
    fontFamily: fuentes.PoppinsBold,
  },
  interaccionesContainer: {
    padding: 16,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  likesComentarios: {
    flexDirection: "row",
    alignItems: "center",
  },
  interaccionTexto: {
    marginLeft: 12,
    fontFamily: fuentes.Poppins,
    fontSize: 16,
  },
  botonesAccion: {
    flexDirection: "row",
    gap: 10,
  },
  botonAccion: {
    padding: 8,
    borderRadius: 20,
  },
  botonEditar: {
    backgroundColor: "rgba(0, 169, 174, 0.4)",
  },
  botonEliminar: {
    backgroundColor: "#ff3b30",
  },
  botonGuardar: {
    backgroundColor: "#34C759",
  },
  comentariosContainer: {
    marginTop: 16,
  },
  comentariosTitulo: {
    fontFamily: fuentes.PoppinsBold,
    fontSize: 18,
    marginBottom: 16,
  },
  comentarioItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  comentarioUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  comentarioContent: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
  },
  comentarioUsername: {
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  comentarioText: {
    fontFamily: fuentes.Poppins,
    fontSize: 16,
  },
  noComentariosText: {
    textAlign: "center",
    marginVertical: 24,
    fontFamily: fuentes.Poppins,
    color: tema.colors.gris,
    fontSize: 16,
  },
});

export default PublicacionModal;
