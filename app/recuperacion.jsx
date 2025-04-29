import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Pantalla from "../components/Pantalla";
import { tema } from "../constants/tema";
import { StatusBar } from "expo-status-bar";
import Atras from "../components/Atras";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { ancho, alto } from "../helpers/dimensiones";
import Campo from "../components/Campo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Boton from "../components/Boton";
import { supabase } from "../lib/supabase";
import { fuentes } from "../constants/fuentes";
import { Linking } from "react-native";

const Recuperacion = () => {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarEnlace = async () => {
    console.log("enviarEnlace");
    if (!email) {
      Alert.alert("Error", "Ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    const redirectTo = Linking.createURL("/recuperacion");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error.message) {
      Alert.alert("Error", error.message);
    }
    Alert.alert("Éxito", "Revisa tu correo para el enlace de recuperación");
    router.replace("/login");
    setLoading(false);
  };

  const cambiarContraseña = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Completa ambos campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Éxito", "Contraseña actualizada");
      router.replace("/login");
    }
    setLoading(false);
  };

  const tieneToken = params?.token_hash && params?.type === "recovery";

  return (
    <GestureHandlerRootView style={{ flex: 1, marginTop: 30 }}>
      <Pantalla bg="white">
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Atras router={router} />
          <View>
            <Text style={styles.welcomeText}>
              {tieneToken ? "Nueva Contraseña" : "Recuperar Contraseña"}
            </Text>
          </View>

          <View style={styles.form}>
            {!tieneToken ? (
              <>
                <Text style={styles.subtitle}>
                  Ingresa tu correo para recibir el enlace de recuperación.
                </Text>
                <Campo
                  icon="mail-outline"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                <Boton
                  titulo="Enviar enlace"
                  alPresionar={enviarEnlace}
                  loading={loading}
                />
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Crea una nueva contraseña segura.
                </Text>
                <Campo
                  icon="lock-closed-outline"
                  placeholder="Nueva Contraseña"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <Campo
                  icon="lock-closed-outline"
                  placeholder="Confirmar Contraseña"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Boton
                  titulo="Cambiar Contraseña"
                  alPresionar={cambiarContraseña}
                  loading={loading}
                />
              </>
            )}
          </View>
        </View>
      </Pantalla>
    </GestureHandlerRootView>
  );
};

export default Recuperacion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: ancho(7),
  },
  welcomeText: {
    fontSize: alto(5),
    fontWeight: tema.fonts.bold,
    color: tema.colors.text,
    fontFamily: fuentes.PoppinsBold,
  },
  subtitle: {
    fontSize: alto(2),
    color: tema.colors.text,
    fontFamily: fuentes.Poppins,
    marginBottom: alto(1),
  },
  form: {
    gap: 25,
  },
});
