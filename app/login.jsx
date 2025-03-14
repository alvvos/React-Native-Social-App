import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import Pantalla from "../components/Pantalla";
import Icon from "../assets/icons";
import { tema } from "../constants/tema";
import { StatusBar } from "expo-status-bar";
import Atras from "../components/Atras";
import { useRouter } from "expo-router";
import { ancho, alto } from "../helpers/dimensiones";
import Campo from "../components/Campo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Boton from "../components/Boton";
import { supabase } from "../lib/supabase";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef || !passwordRef) {
      Alert.alert("Aviso", "Completa todos los campos");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    console.log("error", error);
    if (error) {
      Alert.alert("Aviso", error.message);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla bg="white">
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Atras router={router} />
          <View>
            <Text style={styles.welcomeText}>Bienvenido/a de vuelta</Text>
          </View>
          <View style={styles.form}>
            <Text style={{ fontSize: alto(2.5), color: tema.colors.text }}>
              Ingresa tus detalles a continuación.
            </Text>
            <Campo
              icon={
                <Icon
                  name="usuario"
                  size={26}
                  strokeWidth={2}
                  color={tema.colors.text}
                />
              }
              placeholder="Email"
              onChangeText={(value) => {
                emailRef.current = value;
              }}
            />
            <Campo
              icon={
                <Icon
                  name="perfil"
                  size={26}
                  strokeWidth={2}
                  color={tema.colors.text}
                />
              }
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={(value) => {
                passwordRef.current = value;
              }}
            />
          </View>
          <Text style={styles.forgotPassword}>Has olvidado tu contraseña?</Text>
          <Boton titulo={"Entrar"} loading={loading} onPress={onSubmit}></Boton>
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <Pressable
              onPress={() => {
                router.push("register");
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
      </Pantalla>
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
  },
});
