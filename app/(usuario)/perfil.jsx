import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Pantalla from "../../components/Pantalla";
import { useRouter } from "expo-router";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { tema } from "../../constants/tema";
import { Image } from "expo-image";
import {
  buscarLikesPorIdPublicacion,
  buscarPublicacionesUsuario,
  obtenerComentariosPorPublicacion,
  crearOActualizarPublicacion,
  borrarPublicacionPorId,
} from "../../services/publicaciones";
import { fuentes } from "../../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";
import { obtenerImagen } from "../../services/imagenes";

const Perfil = () => {
  const { usuario } = useAuth();
  const router = useRouter();
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [editando, setEditando] = useState(false);
  const [nuevoCuerpo, setNuevoCuerpo] = useState("");
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    if (usuario?.id) {
      obtenerPublicacionesUsuario();
    }
  }, []);

  const obtenerPublicacionesUsuario = async () => {
    const resultado = await buscarPublicacionesUsuario(usuario.id);
    if (resultado.success) {
      setPublicaciones(resultado.data);
    }
  };

  const manejarRefrescar = () => {
    setRefrescando(true);
    obtenerPublicacionesUsuario();
  };

  const abrirModalPublicacion = async (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setEditando(false);
    const resLikes = await buscarLikesPorIdPublicacion(publicacion.id);
    if (resLikes.success) setLikes(resLikes.data);
    const resComentarios = await obtenerComentariosPorPublicacion(
      publicacion.id
    );
    if (resComentarios.success) setComentarios(resComentarios.data);
    setModalVisible(true);
  };

  const borrarPublicacion = async () => {
    const res = await borrarPublicacionPorId(publicacionSeleccionada.id);
    if (res.success) {
      setModalVisible(false);
      setPublicacionSeleccionada(null);
      setLikes([]);
      setComentarios([]);
      console.log("Publicacion borrada con éxito");
      obtenerPublicacionesUsuario();
    }
  };

  const manejarEdicion = async () => {
    if (editando) {
      const res = await crearOActualizarPublicacion({
        id: publicacionSeleccionada.id,
        cuerpo: nuevoCuerpo,
        id_usuario: usuario.id,
        archivo: publicacionSeleccionada.archivo,
      });

      if (res.success) {
        setPublicacionSeleccionada({
          ...publicacionSeleccionada,
          cuerpo: nuevoCuerpo,
        });
        setEditando(false);
        obtenerPublicacionesUsuario();
      }
    } else {
      setNuevoCuerpo(publicacionSeleccionada.cuerpo);
      setEditando(true);
    }
  };

  const renderizarPublicacion = ({ item }) => (
    <Pressable
      onPress={() => abrirModalPublicacion(item)}
      style={styles.itemPublicacion}
    >
      <Image
        source={
          obtenerImagen(item.archivo) ||
          require("../../assets/images/perfil.png")
        }
        style={styles.imagenPublicacion}
        contentFit="cover"
      />
      <View style={styles.publicacionOverlay}>
        <View>
          <Text style={styles.textoOverlay}>{item.cuerpo}</Text>
        </View>
        <View style={styles.publicacionStats}>
          <Ionicons name="heart" size={16} color="white" />
          <Text style={styles.publicacionStatText}>
            {item.likes_count || 0}
          </Text>
        </View>
        <View style={styles.publicacionStats}>
          <Ionicons name="chatbubble" size={16} color="white" />
          <Text style={styles.publicacionStatText}>
            {item.comments_count || 0}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla colorFondo="white">
        <View style={styles.contenedorPrincipal}>
          <Cabecera titulo={usuario?.nombre} atras={true} />
          <View style={styles.seccionUsuario}>
            <View style={styles.perfilHeader}>
              <Image
                source={obtenerImagen(usuario?.imagen)}
                style={styles.avatar}
                transition={100}
              />
              <View style={styles.estadisticasPerfil}>
                <View style={styles.estadisticaItem}>
                  <Text style={styles.estadisticaNumero}>
                    {publicaciones.length}
                  </Text>
                  <Text style={styles.estadisticaTexto}>Publicaciones</Text>
                </View>
              </View>
            </View>

            <View style={styles.datosUsuario}>
              <Text style={styles.nombreUsuario}>{usuario?.nombre}</Text>
              {usuario.biografia && (
                <Text style={styles.biografia}>{usuario.biografia}</Text>
              )}
              <View style={styles.datosContacto}>
                <View style={styles.filaDato}>
                  <Ionicons
                    name="mail"
                    size={alto(3)}
                    color={tema.colors.iconos}
                  />
                  <Text style={styles.textoDato}>{usuario.email}</Text>
                </View>

                <View style={styles.filaDato}>
                  <Ionicons
                    name="call"
                    size={alto(3)}
                    color={tema.colors.iconos}
                  />
                  <Text style={styles.textoDato}>{usuario?.telefono}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.seccionPublicaciones}>
            {publicaciones.length > 0 ? (
              <FlatList
                data={publicaciones}
                renderItem={renderizarPublicacion}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.filaPublicaciones}
                contentContainerStyle={styles.contenedorPublicaciones}
                refreshing={refrescando}
                onRefresh={manejarRefrescar}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.sinPublicacionesContainer}>
                <Ionicons
                  name="images"
                  size={alto(10)}
                  color={tema.colors.grisClaro}
                />
                <Text style={styles.sinPublicaciones}>
                  No hay publicaciones aún
                </Text>
              </View>
            )}
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            />

            <View style={styles.modalContent}>
              {publicacionSeleccionada && (
                <>
                  <View style={styles.modalHeader}>
                    <Pressable
                      onPress={() => setModalVisible(false)}
                      style={styles.modalCloseButton}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={tema.colors.texto}
                      />
                    </Pressable>
                  </View>

                  <ScrollView style={styles.modalScroll}>
                    <View style={styles.modalUserInfo}>
                      <Image
                        source={obtenerImagen(usuario?.imagen)}
                        style={styles.modalUserImage}
                      />
                      <Text style={styles.modalUserName}>
                        {usuario?.nombre}
                      </Text>
                    </View>

                    <View style={styles.modalImagenContainer}>
                      <Image
                        source={obtenerImagen(publicacionSeleccionada.archivo)}
                        style={styles.modalImagen}
                        contentFit="contain"
                      />
                    </View>
                    <View
                      style={{ marginLeft: 20, marginVertical: 5, flex: 1 }}
                    >
                      {editando ? (
                        <TextInput
                          style={{
                            fontFamily: fuentes.Poppins,
                            borderWidth: 1,
                            borderColor: tema.colors.grisClaro,
                            borderRadius: 8,
                            padding: 10,
                            marginRight: 20,
                          }}
                          value={nuevoCuerpo}
                          onChangeText={setNuevoCuerpo}
                          multiline
                        />
                      ) : (
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontFamily: fuentes.PoppinsBold }}>
                            {usuario?.nombre}
                            {":  "}
                          </Text>
                          <Text style={{ fontFamily: fuentes.Poppins }}>
                            {publicacionSeleccionada.cuerpo}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.interaccionesContainer}>
                      <View style={styles.likesContainer}>
                        <View style={styles.likesComentarios}>
                          <Ionicons
                            name="heart"
                            size={24}
                            color={tema.colors.primary}
                          />
                          <Text style={styles.interaccionTexto}>
                            {likes.length || 0} me gusta
                          </Text>
                        </View>
                        <View style={styles.botonesAccion}>
                          <Pressable
                            onPress={manejarEdicion}
                            style={[
                              styles.botonAccion,
                              editando
                                ? styles.botonGuardar
                                : styles.botonEditar,
                            ]}
                          >
                            <Ionicons
                              name={
                                editando ? "checkmark" : "ellipsis-horizontal"
                              }
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
                          Comentarios
                        </Text>
                        {comentarios.length > 0 ? (
                          comentarios.map((comentario) => (
                            <View
                              key={comentario.id}
                              style={styles.comentarioItem}
                            >
                              <Image
                                source={obtenerImagen(
                                  comentario.usuario?.imagen
                                )}
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
                </>
              )}
            </View>
          </View>
        </Modal>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  seccionUsuario: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  perfilHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  estadisticasPerfil: {
    flexDirection: "row",
    alignItems: "center",
  },
  estadisticaItem: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  estadisticaNumero: {
    fontSize: 20,
    fontFamily: fuentes.PoppinsBold,
    color: tema.colors.texto,
    marginBottom: 4,
  },
  estadisticaTexto: {
    fontSize: 16,
    fontFamily: fuentes.Poppins,
    color: tema.colors.gris,
  },
  datosUsuario: {
    marginTop: 16,
  },
  nombreUsuario: {
    fontSize: 20,
    fontFamily: fuentes.PoppinsBold,
    color: tema.colors.texto,
    marginBottom: 16,
  },
  datosContacto: {
    marginTop: 16,
  },
  filaDato: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
  },
  textoDato: {
    fontSize: 16,
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
    marginLeft: 12,
  },
  seccionPublicaciones: {
    flex: 1,
    paddingTop: 24,
  },
  tituloPublicaciones: {
    fontSize: 18,
    fontFamily: fuentes.PoppinsSemiBold,
    color: tema.colors.texto,
    marginBottom: 20,
  },
  contenedorPublicaciones: {
    paddingBottom: 24,
  },
  filaPublicaciones: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemPublicacion: {
    width: (windowWidth - 60) / 2,
    height: (windowWidth - 60) / 2,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  imagenPublicacion: {
    width: "100%",
    height: "100%",
  },
  publicacionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    opacity: 0,
  },
  textoOverlay: {
    color: "white",
    fontFamily: fuentes.Poppins,
    fontSize: 14,
  },
  publicacionStats: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  publicacionStatText: {
    color: "white",
    marginLeft: 6,
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: 16,
  },
  sinPublicacionesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
    marginTop: 40,
  },
  sinPublicaciones: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 18,
    color: tema.colors.gris,
    fontFamily: fuentes.Poppins,
  },
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
    maxHeight: windowHeight * 0.85,
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
    height: windowWidth * 0.9 - 32,
    backgroundColor: "#fafafa",
    borderRadius: 12,
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
  biografia: {
    fontSize: 14,
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
    marginBottom: 16,
    lineHeight: 20,
  },
});

export default Perfil;
