import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import Pantalla from "../components/Pantalla";
import { tema } from "../constants/tema";
import { StatusBar } from "expo-status-bar";
import Atras from "../components/Atras";
import { useRouter } from "expo-router";
import { ancho, alto } from "../helpers/dimensiones";
import Campo from "../components/Campo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Boton from "../components/Boton";
import { supabase } from "../lib/supabase";
import { fuentes } from "../constants/fuentes";
import { ScrollView } from "react-native-gesture-handler";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const darseAlta = async () => {
    if (!emailRef || !passwordRef) {
      Alert.alert("Aviso", "Completa todos los campos");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error.message) {
      switch (error.message) {
        case "Invalid login credentials":
          Alert.alert("Error", "Correo o contraseña incorrectos");
          break;
        case "missing email or phone":
          Alert.alert("Error", "Email o contraseña sin completar");
          break;
        default:
          Alert.alert("Error", "Ha ocurrido un error inesperado");
          break;
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, marginTop: 30 }}>
      <ScrollView style={{ padding: ancho(3), paddingVertical: ancho(4) }}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Atras router={router} />
          <View>
            <Text style={styles.welcomeText}>Bienvenido/a!</Text>
          </View>
          <View style={styles.form}>
            <Text
              style={{
                fontSize: alto(2),
                color: tema.colors.text,
                fontFamily: fuentes.Poppins,
              }}
            >
              Ingresa tus datos a continuación.
            </Text>
            <Campo
              icon={"mail-outline"}
              placeholder="Email"
              onChangeText={(value) => {
                emailRef.current = value;
              }}
            />
            <Campo
              icon={"lock-closed-outline"}
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={(value) => {
                passwordRef.current = value;
              }}
            />
          </View>
          <Pressable onPress={() => router.push("recuperacion")}>
            <Text style={styles.forgotPassword}>
              Has olvidado tu contraseña?
            </Text>
          </Pressable>
          <Boton titulo={"Entrar"} alPresionar={darseAlta} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <Pressable
              onPress={() => {
                router.push("registrar");
              }}
            >
              <Text
                style={[
                  styles.footerText,
                  {
                    color: tema.colors.primary,
                    fontWeight: tema.fonts.semibold,
                  },
                ]}
              >
                Registrarme
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Login;

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
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "left",
    fontWeight: tema.fonts.semibold,
    color: tema.colors.text,
    marginHorizontal: ancho(1),
    fontSize: alto(2),
    fontFamily: fuentes.PoppinsSemiBold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: tema.colors.text,
    fontSize: alto(2),
    fontFamily: fuentes.Poppins,
  },
});
