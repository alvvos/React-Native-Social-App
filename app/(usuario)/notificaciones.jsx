import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Pantalla from "../../components/Pantalla";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { tema } from "../../constants/tema";
import { fuentes } from "../../constants/fuentes";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

const Notificaciones = () => {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    obtenerNotificaciones();
  }, [usuario?.id]);

  const obtenerNotificaciones = async () => {
    if (!usuario?.id) return;

    try {
      const { data, error } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("id_receptor", usuario.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setNotificaciones(data || []);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  const manejarRefrescar = () => {
    setRefrescando(true);
    obtenerNotificaciones();
  };

  const renderizarNotificacion = ({ item }) => (
    <Pressable
      style={estilos.itemNotificacion}
      onPress={() => manejarClickNotificacion(item)}
    >
      <View style={estilos.contenidoNotificacion}>
        <View style={estilos.iconoContainer}>
          <Ionicons
            name={obtenerIconoPorTipo(item.titulo)}
            size={alto(3.2)}
            color={tema.colors.primary}
          />
        </View>

        <View style={estilos.textoContainer}>
          <Text style={estilos.tituloNotificacion}>{item.titulo}</Text>
          <Text style={estilos.mensajeNotificacion}>{item.cuerpo}</Text>
          <Text style={estilos.fechaNotificacion}>
            {formatearFecha(item.created_at)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const obtenerIconoPorTipo = (titulo) => {
    const iconos = {
      "Nuevo comentario": "chatbubble-outline",
      "Nuevo like": "heart-outline",
      "Nuevo etiquetado": "person-add-outline",
    };
    return iconos[titulo] || "notifications-outline";
  };

  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diffMinutos = Math.floor((ahora - fechaNotif) / (1000 * 60));

    if (diffMinutos < 1) return "Ahora mismo";
    if (diffMinutos < 60) return `Hace ${diffMinutos} min`;
    if (diffMinutos < 1440) return `Hace ${Math.floor(diffMinutos / 60)} h`;

    return fechaNotif.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const manejarClickNotificacion = (notificacion) => {
    console.log("Notificación clickeada:", notificacion);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla colorFondo="white">
        <View style={estilos.contenedorPrincipal}>
          <Cabecera
            titulo="Notificaciones"
            atras={true}
            accionExtra={
              <Pressable onPress={manejarRefrescar}>
                <Ionicons
                  name="refresh"
                  size={24}
                  color={tema.colors.primary}
                />
              </Pressable>
            }
          />

          <View style={estilos.contenedorLista}>
            {cargando ? (
              <View style={estilos.centrado}>
                <ActivityIndicator size="large" color={tema.colors.primary} />
              </View>
            ) : notificaciones.length > 0 ? (
              <FlatList
                data={notificaciones}
                renderItem={renderizarNotificacion}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={estilos.listaContenedor}
                showsVerticalScrollIndicator={false}
                refreshing={refrescando}
                onRefresh={manejarRefrescar}
                ListEmptyComponent={
                  <View style={estilos.centrado}>
                    <Text style={estilos.sinNotificaciones}>
                      No tienes notificaciones
                    </Text>
                  </View>
                }
              />
            ) : (
              <View style={estilos.centrado}>
                <Ionicons
                  name="notifications-off-outline"
                  size={alto(8)}
                  color={tema.colors.grisClaro}
                />
                <Text style={estilos.sinNotificaciones}>
                  No tienes notificaciones
                </Text>
              </View>
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
    paddingHorizontal: ancho(4),
  },
  contenedorLista: {
    flex: 1,
    marginTop: alto(2),
    backgroundColor: tema.colors.fondo,
    borderRadius: 16,
    overflow: "hidden",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: ancho(4),
  },
  listaContenedor: {
    paddingVertical: alto(1),
  },
  itemNotificacion: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginHorizontal: ancho(2),
    marginVertical: alto(1),
    padding: ancho(3),
  },
  contenidoNotificacion: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconoContainer: {
    backgroundColor: tema.colors.fondoIcono,
    width: ancho(12),
    height: ancho(12),
    borderRadius: ancho(6),
    justifyContent: "center",
    alignItems: "center",
    marginRight: ancho(3),
  },
  textoContainer: {
    flex: 1,
  },
  tituloNotificacion: {
    fontSize: alto(2),
    fontFamily: fuentes.PoppinsSemiBold,
    color: tema.colors.texto,
    marginBottom: alto(0.5),
  },
  mensajeNotificacion: {
    fontSize: alto(1.8),
    fontFamily: fuentes.Poppins,
    color: tema.colors.gris,
    marginBottom: alto(0.5),
    lineHeight: alto(2.4),
  },
  fechaNotificacion: {
    fontSize: alto(1.6),
    fontFamily: fuentes.Poppins,
    color: tema.colors.grisClaro,
  },
  sinNotificaciones: {
    fontSize: alto(2),
    color: tema.colors.gris,
    fontFamily: fuentes.Poppins,
    marginTop: alto(2),
    textAlign: "center",
  },
});

export default Notificaciones;
