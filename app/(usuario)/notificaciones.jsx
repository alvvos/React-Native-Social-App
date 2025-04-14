import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
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

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      if (!usuario?.id) return;

      try {
        setCargando(true);
        const { data, error } = await supabase
          .from("notificaciones")
          .select("*")
          .eq("id_receptor", usuario.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setNotificaciones(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerNotificaciones();
  }, [usuario?.id]);

  const renderizarNotificacion = ({ item }) => (
    <View style={estilos.itemNotificacion}>
      <View style={estilos.iconoNotificacion}>
        <Ionicons
          name={obtenerIconoPorTipo(item.titulo)}
          size={alto(3.5)}
          color={tema.colors.primary}
        />
      </View>
      <View style={estilos.contenidoNotificacion}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={estilos.tituloNotificacion}>{item.titulo}</Text>
          <Text style={estilos.mensajeNotificacion}>{item.cuerpo}</Text>
        </View>
      </View>
    </View>
  );

  const obtenerIconoPorTipo = (titulo) => {
    switch (titulo) {
      case "Nuevo comentario":
        return "chatbox";
      case "Nuevo like":
        return "heart";
      default:
        return "notifications";
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla colorFondo="white">
        <View style={estilos.contenedorPrincipal}>
          <Cabecera titulo="Notificaciones" atras={true} />

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
              />
            ) : (
              <View style={estilos.centrado}>
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
    padding: ancho(4),
  },
  contenedorLista: {
    flex: 1,
    marginTop: alto(4),
    backgroundColor: "rgba(238, 238, 238, 0.5)",
    borderRadius: 20,
    paddingHorizontal: ancho(2),
    paddingTop: alto(1),
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listaContenedor: {
    paddingBottom: alto(10),
  },
  itemNotificacion: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    padding: ancho(3),
    marginBottom: alto(1.5),
    alignItems: "center",
  },
  iconoNotificacion: {
    backgroundColor: tema.colors.fondoIcono,
    borderRadius: 50,
    width: ancho(10),
    height: ancho(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: ancho(3),
  },
  contenidoNotificacion: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  tituloNotificacion: {
    fontSize: alto(2),
    fontFamily: fuentes.PoppinsBold,
    color: tema.colors.texto,
    marginBottom: alto(0.5),
  },
  mensajeNotificacion: {
    fontSize: alto(1.8),
    fontFamily: fuentes.Poppins,
    color: tema.colors.gris,
    marginBottom: alto(0.5),
    lineHeight: alto(2.2),
  },
  fechaNotificacion: {
    fontSize: alto(1.6),
    fontFamily: fuentes.Poppins,
    color: tema.colors.grisClaro,
    textAlign: "right",
  },
  sinNotificaciones: {
    fontSize: alto(2.2),
    color: tema.colors.gris,
    fontFamily: fuentes.Poppins,
  },
});

export default Notificaciones;
