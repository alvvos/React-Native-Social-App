import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Pantalla from "../../components/Pantalla";
import { useRouter } from "expo-router";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { tema } from "../../constants/tema";
import { Image } from "expo-image";
import { buscarPublicacionesUsuario } from "../../services/publicaciones";
import { fuentes } from "../../constants/fuentes";
import { Ionicons } from "@expo/vector-icons";
import { obtenerImagen } from "../../services/imagenes";

const Perfil = () => {
  const { usuario } = useAuth();
  const router = useRouter();
  const [publicaciones, setPublicaciones] = useState([]);
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

  const renderizarPublicacion = ({ item }) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: "publicacion", params: { id: item.id } })
      }
      style={estilos.itemPublicacion}
    >
      <Image
        source={obtenerImagen(item.archivo)}
        style={estilos.imagenPublicacion}
        contentFit="cover"
      />
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla colorFondo="white">
        <View style={estilos.contenedorPrincipal}>
          <Cabecera titulo={usuario?.nombre} atras={true} />

          <View style={estilos.seccionUsuario}>
            <Image
              source={obtenerImagen(usuario?.imagen)}
              style={estilos.avatar}
              transition={100}
            />

            <View style={estilos.datosContacto}>
              <View style={estilos.filaDato}>
                <Ionicons
                  name="mail"
                  size={alto(3)}
                  color={tema.colors.iconos}
                />
                <Text style={estilos.textoDato}>{usuario?.email}</Text>
              </View>

              <View style={estilos.filaDato}>
                <Ionicons
                  name="call"
                  size={alto(3)}
                  color={tema.colors.iconos}
                />
                <Text style={estilos.textoDato}>{usuario?.telefono}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: alto(0) }}>
            <Text style={estilos.tituloPublicaciones}>Mis Publicaciones</Text>

            {publicaciones.length > 0 ? (
              <FlatList
                data={publicaciones}
                renderItem={renderizarPublicacion}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={estilos.filaPublicaciones}
                contentContainerStyle={estilos.contenedorPublicaciones}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={estilos.sinPublicaciones}>
                No hay publicaciones aún
              </Text>
            )}
          </View>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    padding: ancho(4),
    justifyContent: "center",
    flexDirection: "col",
  },

  seccionUsuario: {
    flex: 1,
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: ancho(30),
    height: ancho(30),
    borderRadius: tema.radius.doublexxl,
    marginVertical: alto(2),
  },
  datosContacto: {
    marginTop: 10,
    paddingHorizontal: ancho(5),
  },
  filaDato: {
    flexDirection: "row",
    alignItems: "center",
    gap: ancho(2),
    marginBottom: alto(1),
  },
  textoDato: {
    fontSize: ancho(4),
    fontFamily: fuentes.Poppins,
    color: tema.colors.texto,
  },

  tituloPublicaciones: {
    fontSize: alto(2.5),
    fontFamily: fuentes.PoppinsBold,
    color: tema.colors.texto,
    marginVertical: alto(2),
    paddingHorizontal: ancho(2),
    marginLeft: ancho(2),
  },

  contenedorPublicaciones: {
    paddingBottom: alto(10),
    paddingHorizontal: ancho(1),
  },
  filaPublicaciones: {
    justifyContent: "space-between",
    marginBottom: ancho(1.5),
    gap: ancho(1),
  },
  itemPublicacion: {
    width: ancho(48) - 4,
    height: ancho(48) - 4,
    margin: ancho(0.2),
  },
  imagenPublicacion: {
    width: "9%",
    height: "90%",
    borderRadius: tema.radius.md,
    aspectRatio: 1,
  },
  sinPublicaciones: {
    textAlign: "center",
    marginTop: alto(3),
    fontSize: alto(2.2),
    color: tema.colors.gris,
    fontFamily: fuentes.Poppins,
  },
});

export default Perfil;
