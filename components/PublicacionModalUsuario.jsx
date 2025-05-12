import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "../constants/tema";
import { fuentes } from "../constants/fuentes";
import { obtenerImagen } from "../services/imagenes";
import moment from "moment";
import { useRouter } from "expo-router";
import { obtenerEtiquetadosPorIdPublicacion } from "../services/publicaciones";

const PublicacionModalUsuario = React.memo(
  ({
    visible,
    onClose,
    publicacion,
    usuario,
    likes = [],
    comentarios = [],
  }) => {
    const [etiquetados, setEtiquetados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (!publicacion?.id) return;

      const cargarDatos = async () => {
        try {
          const resEtiquetados = await obtenerEtiquetadosPorIdPublicacion(
            publicacion.id
          );
          if (resEtiquetados.success) {
            setEtiquetados(resEtiquetados.data);
          }
        } catch (error) {
          console.error("Error cargando etiquetados:", error);
        } finally {
          setCargando(false);
        }
      };

      cargarDatos();
    }, [publicacion?.id]);

    const handlePressEtiquetado = useCallback(
      (idUsuario) => {
        onClose();
        router.push({
          pathname: "/perfilUsuario",
          params: { idUsuario },
        });
      },
      [onClose, router]
    );

    const renderEtiquetados = useCallback(
      () => (
        <View style={styles.etiquetadosContainer}>
          <View style={styles.etiquetadosLista}>
            {etiquetados?.map((etiquetado) => (
              <Pressable
                key={etiquetado.id}
                onPress={() => handlePressEtiquetado(etiquetado.id_usuario.id)}
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
      ),
      [etiquetados, handlePressEtiquetado]
    );

    if (!publicacion || !usuario) return null;

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

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalUserInfo}>
                <Image
                  source={obtenerImagen(usuario.imagen)}
                  style={styles.modalUserImage}
                />
                <Text style={styles.modalUserName}>{usuario.nombre}</Text>
              </View>

              <View style={styles.modalImagenContainer}>
                <Image
                  source={obtenerImagen(publicacion.archivo)}
                  style={styles.modalImagen}
                  contentFit="contain"
                />
              </View>

              <View style={styles.modalCuerpoContainer}>
                <Text style={styles.modalCuerpoTexto}>
                  <Text style={styles.modalCuerpoNombre}>
                    {usuario.nombre}
                    {":  "}
                  </Text>
                  {publicacion.cuerpo}
                </Text>
              </View>

              {!cargando && etiquetados?.length > 0 && renderEtiquetados()}

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
                          <Text style={styles.comentarioFecha}>
                            {moment(comentario.created_at).fromNow()}
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
          </View>
        </View>
      </Modal>
    );
  }
);

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
    paddingRight: 20,
  },
  modalCuerpoTexto: {
    fontFamily: fuentes.Poppins,
    fontSize: 15,
    lineHeight: 22,
  },
  modalCuerpoNombre: {
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
    backgroundColor: tema.colors.fondoInput,
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
    fontSize: 15,
    lineHeight: 20,
  },
  comentarioFecha: {
    fontFamily: fuentes.Poppins,
    fontSize: 12,
    color: tema.colors.gris,
    marginTop: 4,
  },
  noComentariosText: {
    textAlign: "center",
    marginVertical: 24,
    fontFamily: fuentes.Poppins,
    color: tema.colors.gris,
    fontSize: 16,
  },
});

export default PublicacionModalUsuario;
