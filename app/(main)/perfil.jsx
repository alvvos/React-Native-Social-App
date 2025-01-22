import { StyleSheet, View, Alert, Text } from "react-native";
import React from "react";
import Pantalla from "../../components/Pantalla";
import { useRouter } from "expo-router";
import Cabecera from "../../components/Cabecera";
import { useAuth } from "../../context/AuthContext";
import { ancho, alto } from "../../helpers/dimensiones";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Icon from "../../assets/icons";
import { tema } from "../../constants/tema";
import Desplegable from "../../components/Desplegable";
import { supabase } from "../../lib/supabase";

const Perfil = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  return (
    <GestureHandlerRootView>
      <Pantalla colorFondo="white">
        <View
          style={{
            flex: 1,
            paddingHorizontal: ancho(7),
          }}
        >
          <Cabecera
            titulo={user?.email ? user.email.split("@")[0] : ""}
            atras={true}
            style={{ borderColor: tema.colors.primary, borderWidth: 1 }}
          ></Cabecera>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contenedorCabecera: {
    marginHorizontal: ancho(4),
    marginBottom: 20,
  },
  formaCabecera: {
    width: ancho(100),
    height: alto(20),
  },
  contenedorAvatar: {
    height: alto(12),
    width: ancho(12),
    alignSelf: "center",
  },
  iconoEditar: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
  },
  info: {
    flex: "row",
    alignItems: "center",
    gap: 10,
  },
  usuario: {
    fontSize: alto(3),
    fontWeight: "500",
    color: tema.colors.primaryDark,
  },
  cerrarSesion: {
    position: "absolute",
    right: 0,
    padding: 10,
    borderRadius: tema.radius.sm,
    backgroundColor: "#fee2e2",
  },
});
