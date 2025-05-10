import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useEffect } from "react";
import Pantalla from "../../components/Pantalla";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import { tema } from "../../constants/tema";
import { useRouter } from "expo-router";
import { useState } from "react";
import { buscarPublicacion } from "../../services/publicaciones";
import { FlatList } from "react-native";
import Publicacion from "../../components/Publicacion";
import { Ionicons } from "@expo/vector-icons";

const Inicio = () => {
  const { usuario, setAuth } = useAuth();
  const router = useRouter();
  const [publicaciones, setPublicaciones] = useState([]);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    getPublicaciones();
  }, [publicaciones]);

  const getPublicaciones = async () => {
    let res = await buscarPublicacion();
    if (res.success) {
      setPublicaciones(res.data);
    }
    setRefrescando(false);
  };

  const manejarRefrescar = () => {
    setRefrescando(true);
    getPublicaciones();
  };

  return (
    <Pantalla>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/eep.png")}
            style={{ width: 80, height: 80 }}
          />
        </View>
        <View style={styles.iconos}>
          <Pressable onPress={() => router.push("notificaciones")}>
            <Ionicons
              name="notifications-outline"
              size={alto(4)}
              color={tema.colors.iconos}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("nuevaPublicacion");
            }}
          >
            <Ionicons
              name="camera-outline"
              size={alto(4)}
              color={tema.colors.iconos}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("perfil");
            }}
          >
            <Ionicons
              name="person-outline"
              size={alto(4)}
              color={tema.colors.iconos}
            />
          </Pressable>
        </View>
        <FlatList
          data={publicaciones}
          showVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refrescando}
          onRefresh={manejarRefrescar}
          renderItem={({ item }) => (
            <Publicacion item={item} usuarioActual={usuario} router={router} />
          )}
        />
      </View>
    </Pantalla>
  );
};

export default Inicio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ancho(7),
  },
  welcomeImage: {
    height: alto(60),
    width: ancho(100),
    alignSelf: "center",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: ancho(4),
    marginBottom: 10,
  },
  iconos: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    gap: ancho(30),
    padding: 20,
    zIndex: 10,
    backgroundColor: "#fff",
  },
  listStyle: {
    paddingTop: 20,
    paddingBottom: ancho(4),
    paddingBottom: 20,
  },
  noPosts: {
    fontSize: alto(2),
    textAlign: "center",
    color: tema.colors.text,
  },
  avatarImage: {
    height: alto(40),
    width: ancho(40),
    borderRadius: tema.radius.sm,
    borderCurve: "continuous",
    borderColor: tema.colors.gray,
    borderWidth: 3,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
  },
  titulo: {
    color: tema.colors.text,
    fontSize: alto(5),
    fontWeight: tema.fonts.bold,
  },
  punchLine: {
    textAlign: "center",
    paddingHorizontal: ancho(8),
    fontSize: alto(3),
    color: tema.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loginText: {
    textAlign: "center",
    color: tema.colors.text,
    fontSize: alto(4),
  },
});
