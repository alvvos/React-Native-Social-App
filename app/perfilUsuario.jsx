import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter, useLocalSearchParams } from "expo-router";
import Pantalla from "../components/Pantalla";
import Cabecera from "../components/Cabecera";
import { ancho, alto } from "../helpers/dimensiones";
import { tema } from "../constants/tema";
import { fuentes } from "../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";
import { obtenerImagen } from "../services/imagenes";
import { obtenerUsuarioPorId } from "../services/usuarios";
import {
  buscarPublicacionesUsuario,
  buscarLikesPorIdPublicacion,
  obtenerComentariosPorPublicacion,
} from "../services/publicaciones";
import PublicacionModalUsuario from "../components/PublicacionModalUsuario";

const PerfilUsuario = () => {
  const { idUsuario } = useLocalSearchParams();
  const router = useRouter();
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [likes, setLikes] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        const [resultadoUsuario, resultadoPublicaciones] = await Promise.all([
          obtenerUsuarioPorId(idUsuario),
          buscarPublicacionesUsuario(idUsuario),
        ]);

        if (resultadoUsuario.success) {
          setUsuario(resultadoUsuario.data);
        } else {
          throw new Error("Usuario no encontrado");
        }

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

        <PublicacionModalUsuario
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          publicacion={publicacionSeleccionada}
          usuario={usuario}
          likes={likes}
          comentarios={comentarios}
        />
      </Pantalla>
    </GestureHandlerRootView>
  );
};

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
