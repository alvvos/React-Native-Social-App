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

const Register = () => {
  const router = useRouter(); 
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef || !passwordRef) {
      Alert.alert("register", "Porfavor completa todos los campos");
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    Alert.alert("Nombre:", name);

    const {
      data: { session },
      error,
    } = await supabase.auth.register({
      email,
      password,
      options:{
        data:{
          name,
        }
      }
    });

    setLoading(false);

    //token
    console.log("session", session);
    console.log("error", session);
    if (error) {
      Alert.alert("Sign up", error.message);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pantalla bg="white">
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Atras router={router} />
          <View>
            <Text style={styles.welcomeText}>Queremos</Text>
            <Text style={styles.welcomeText}>Saber más de tí</Text>
          </View>
          <View style={styles.form}>
            <Text style={{ fontSize: alto(2.5), color: tema.colors.text }}>
              Por favor ingresa tus detalles a continuación 
            </Text>
            <Campo
              icon={
                <Icon
                  name="user"
                  size={26}
                  strokeWidth={2}
                  color={tema.colors.text}
                />
              }
              placeholder="Nombre"
              onChangeText={(value) => {
                nameRef.current = value;
              }}
            />
            <Campo
              icon={
                <Icon
                  name="mail"
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
                  name="lock"
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

          <Boton
            titulo={"Registrar"}
            loading={loading}
            onPress={onSubmit}
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
      </Pantalla>
    </GestureHandlerRootView>
  );
};

export default Register;

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
  },
});
