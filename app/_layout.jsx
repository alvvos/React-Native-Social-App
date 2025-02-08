import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getUsuarioData } from "../services/usuarios";
import { updateUsuarioData } from "../services/usuarios";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUsuarioData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("usuario: ", session?.user?.id);
      if (session) {
        setAuth(session?.user);
        actualizarUsuario(session?.user);
        router.replace("/inicio");
      } else {
        setAuth(null);
        router.replace("/bienvenida");
      }
    });
  }, []);

  const actualizarUsuario = async (usuario) => {
    let res = await getUsuarioData(usuario?.id);
    if (res.success) setUsuarioData(res.data);
    console.log("usuario actualizado: ", res.data);
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
