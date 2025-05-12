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
import { useRouter } from "expo-router";
import Pantalla from "../../components/Pantalla";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import { tema } from "../../constants/tema";
import { fuentes } from "../../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";
import { obtenerImagen } from "../../services/imagenes";
import { buscarPublicacionesUsuario } from "../../services/publicaciones";
import PublicacionModal from "../../components/PublicacionModal";

const Perfil = () => {
  const { usuario } = useAuth();
  const router = useRouter();
  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    if (usuario?.id) {
      obtenerPublicacionesUsuario();
    }
  }, [usuario]);

  const obtenerPublicacionesUsuario = async () => {
    setRefrescando(true);
    const resultado = await buscarPublicacionesUsuario(usuario.id);
    if (resultado.success) {
      setPublicaciones(resultado.data);
    }
    setRefrescando(false);
  };

  const abrirModalPublicacion = (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setModalVisible(true);
  };

  const handlePublicacionActualizada = (publicacionActualizada) => {
    setPublicaciones(
      publicaciones.map((p) =>
        p.id === publicacionActualizada.id ? publicacionActualizada : p
      )
    );
  };

  const handlePublicacionEliminada = () => {
    setPublicaciones(
      publicaciones.filter((p) => p.id !== publicacionSeleccionada.id)
    );
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
                onRefresh={obtenerPublicacionesUsuario}
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

        <PublicacionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          publicacion={publicacionSeleccionada}
          usuario={usuario}
          onPublicacionActualizada={handlePublicacionActualizada}
          onPublicacionEliminada={handlePublicacionEliminada}
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
});

export default Perfil;
