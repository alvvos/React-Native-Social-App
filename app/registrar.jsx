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

const Registrar = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef || !passwordRef) {
      Alert.alert("Aviso", "Por favor completa todos los campos");
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    if (!email.endsWith("@eep-igroup.com")) {
      Alert.alert(
        "Error",
        "El email debe pertenecer al dominio @eep-igroup.com"
      );
      return;
    }

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          email,
        },
      },
    });

    setLoading(false);
    console.log("session", session);

    if (error) {
      switch (error.message) {
        case "Anonymous sign-ins are disabled":
          Alert.alert("Error", "Rellena todos los campos");
          break;
        case "Signup requires a valid password":
          Alert.alert("Error", "Completa el campo de contraseña");
          break;
        case "Unable to validate email address: invalid format":
          Alert.alert("Error", "El formato del email es incorrecto");
          break;
        case "Password should be at least 6 characters.":
          Alert.alert(
            "Error",
            "La contraseña debe tener al menos 6 caracteres"
          );
          break;
        default:
          Alert.alert("Error", "Ha ocurrido un error inesperado");
          console.log(error.message);
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
            <Text style={styles.welcomeText}>Regístrate</Text>
          </View>
          <View style={styles.form}>
            <Text
              style={{
                fontSize: alto(2.5),
                color: tema.colors.text,
                fontFamily: fuentes.Poppins,
              }}
            >
              Por favor ingresa tus detalles a continuación
            </Text>
            <Campo
              icon={"person-outline"}
              placeholder="Nombre"
              onChangeText={(value) => {
                nameRef.current = value;
              }}
            />
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

          <Boton
            titulo={"Registrar"}
            loading={loading}
            alPresionar={onSubmit}
          ></Boton>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Ya tengo cuenta </Text>
            <Pressable
              onPress={() => {
                router.push("login");
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
                Acceder
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Registrar;

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
    fontSize: alto(3.5),
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
