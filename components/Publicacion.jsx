import { Image, StyleSheet, Text, Touchable, View } from "react-native";
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
} from "../services/publicaciones";
import { use } from "react";

const Publicacion = ({ item, usuarioActual, router }) => {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const cargarLikes = async () => {
      const resultado = await buscarLikesPorIdPublicacion(item.id);
      if (resultado.success) {
        setLikes(resultado.data);
      }
    };
    cargarLikes();
  }, [item.id]);

  useEffect(() => {
    console.log("likes: ", likes.length);
  }, [likes]);

  const fechaParseada = moment(item?.created_at).format("D MMM");

  const manejarLike = async () => {
    const resultado = await agregarLikePorIdPublicacion(
      item.id,
      usuarioActual.id
    );
    if (resultado.success && resultado.accion === "like_agregado") {
      setLikes(resultado.data);
    }
  };

  const verDetalles = () => {};

  return (
    <View style={[styles.contendor]}>
      <View style={styles.cabecera}>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Image
            source={obtenerImagen(item?.usuario?.imagen)}
            transition={100}
            borderRadius={tema.radius.sm}
            style={{
              width: ancho(10),
              height: ancho(10),
            }}
          />
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
        </View>
        <View style={{ margin: 4 }}>
          <TouchableOpacity onPress={verDetalles}>
            <Ionicons name="ellipsis-horizontal" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contenido}>
        <Image
          source={obtenerImagen(item?.archivo)}
          transition={100}
          borderRadius={tema.radius.sm}
          style={{
            width: ancho(80),
            height: ancho(50),
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
              <Ionicons
                name="heart-outline"
                size={23}
                color={tema.colors.iconos}
              />
            </Pressable>
            <Text style={{ fontFamily: fuentes.Poppins, marginTop: 3 }}>
              {likes?.length}
            </Text>
          </View>
          <Ionicons
            name="chatbubble-outline"
            size={21}
            color={tema.colors.iconosDark}
          />
          <Ionicons
            name="cloud-upload-outline"
            size={23}
            color={tema.colors.iconosDark}
          />
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
});
