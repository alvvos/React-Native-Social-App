import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Pantalla from "../components/Pantalla";
import { useRouter, useLocalSearchParams } from "expo-router";
import Cabecera from "../components/Cabecera";
import { ancho, alto } from "../helpers/dimensiones";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { tema } from "../constants/tema";
import { Image } from "expo-image";
import {
  buscarLikesPorIdPublicacion,
  buscarPublicacionesUsuario,
  obtenerComentariosPorPublicacion,
} from "../services/publicaciones";
import { fuentes } from "../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";
import { obtenerImagen } from "../services/imagenes";
import { obtenerUsuarioPorId } from "../services/usuarios";
import moment from "moment";

const PerfilUsuario = () => {
  const { idUsuario } = useLocalSearchParams();
  const router = useRouter();
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const resultadoUsuario = await obtenerUsuarioPorId(idUsuario);
        if (resultadoUsuario.success) {
          setUsuario(resultadoUsuario.data);
        } else {
          throw new Error("Usuario no encontrado");
        }

        const resultadoPublicaciones = await buscarPublicacionesUsuario(
          idUsuario
        );
        if (resultadoPublicaciones.success) {
          setPublicaciones(resultadoPublicaciones.data);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [idUsuario]);

  const abrirModalPublicacion = async (publicacion) => {
    try {
      setPublicacionSeleccionada(publicacion);

      const [resLikes, resComentarios] = await Promise.all([
        buscarLikesPorIdPublicacion(publicacion.id),
        obtenerComentariosPorPublicacion(publicacion.id),
      ]);

      if (resLikes.success) setLikes(resLikes.data);
      if (resComentarios.success) setComentarios(resComentarios.data);

      setModalVisible(true);
    } catch (error) {
      console.error("Error abriendo publicación:", error);
    }
  };

  const renderizarPublicacion = ({ item }) => (
    <Pressable
      onPress={() => abrirModalPublicacion(item)}
      style={styles.itemPublicacion}
    >
      <Image
        source={obtenerImagen(item.archivo)}
        style={styles.imagenPublicacion}
        contentFit="cover"
      />
    </Pressable>
  );

  if (cargando) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color={tema.colors.primary} />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTexto}>Usuario no encontrado</Text>
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.botonVolverTexto}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla bg="white">
        <View style={styles.contenedorPrincipal}>
          <Cabecera
            titulo={usuario.nombre}
            atras={true}
            estiloTitulo={styles.tituloCabecera}
          />

          <View style={styles.seccionUsuario}>
            <View style={styles.perfilHeader}>
              <Image
                source={obtenerImagen(usuario.imagen)}
                style={styles.avatar}
                transition={100}
                contentFit="cover"
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
              <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
              {usuario.biografia && (
                <Text style={styles.biografia}>{usuario.biografia}</Text>
              )}

              <View style={styles.datosContacto}>
                {usuario.email && (
                  <View style={styles.filaDato}>
                    <Ionicons
                      name="mail"
                      size={alto(2.5)}
                      color={tema.colors.iconos}
                    />
                    <Text style={styles.textoDato}>{usuario.email}</Text>
                  </View>
                )}

                {usuario.telefono && (
                  <View style={styles.filaDato}>
                    <Ionicons
                      name="call"
                      size={alto(2.5)}
                      color={tema.colors.iconos}
                    />
                    <Text style={styles.textoDato}>{usuario.telefono}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.seccionPublicaciones}>
            <Text style={styles.tituloPublicaciones}>
              {publicaciones.length > 0
                ? "Publicaciones"
                : "No hay publicaciones"}
            </Text>

            {publicaciones.length > 0 ? (
              <FlatList
                data={publicaciones}
                renderItem={renderizarPublicacion}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.filaPublicaciones}
                contentContainerStyle={styles.contenedorPublicaciones}
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
                  {usuario.nombre} no ha compartido publicaciones aún
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

                  <ScrollView
                    style={styles.modalScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.modalUserInfo}>
                      <Pressable
                        onPress={() => {
                          setModalVisible(false);
                        }}
                      >
                        <Image
                          source={obtenerImagen(usuario.imagen)}
                          style={styles.modalUserImage}
                        />
                      </Pressable>
                      <Text style={styles.modalUserName}>{usuario.nombre}</Text>
                    </View>

                    <View style={styles.modalImagenContainer}>
                      <Image
                        source={obtenerImagen(publicacionSeleccionada.archivo)}
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
                        {publicacionSeleccionada.cuerpo}
                      </Text>
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
  tituloCabecera: {
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: alto(2.2),
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
    width: ancho(22),
    height: ancho(22),
    borderRadius: ancho(11),
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
    fontSize: 14,
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
    marginBottom: 8,
  },
  biografia: {
    fontSize: 14,
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
    marginBottom: 16,
    lineHeight: 20,
  },
  datosContacto: {
    marginTop: 16,
  },
  filaDato: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
  },
  textoDato: {
    fontSize: 14,
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
    padding: 10,
    justifyContent: "flex-end",
  },
  textoOverlay: {
    color: "white",
    fontFamily: fuentes.Poppins,
    fontSize: 14,
    marginBottom: 8,
  },
  publicacionStatsContainer: {
    flexDirection: "row",
  },
  publicacionStats: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  publicacionStatText: {
    color: "white",
    marginLeft: 6,
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: 14,
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
    fontSize: 16,
    color: tema.colors.gris,
    fontFamily: fuentes.Poppins,
    paddingHorizontal: 30,
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
  cargandoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorTexto: {
    fontFamily: fuentes.Poppins,
    fontSize: 16,
    color: tema.colors.texto,
    marginBottom: 20,
    textAlign: "center",
  },
  botonVolver: {
    backgroundColor: tema.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  botonVolverTexto: {
    color: "white",
    fontFamily: fuentes.PoppinsSemiBold,
    fontSize: 16,
  },
});

export default PerfilUsuario;
