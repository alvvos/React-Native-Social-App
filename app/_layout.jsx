import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getUsuarioData } from "../services/usuarios";
import { updateUsuarioData } from "../services/usuarios";
import { cargarFuentes } from "../constants/fuentes";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { usuario, setAuth, setUsuarioData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("usuario_sesion: ", session?.user || "");
      if (session) {
        setAuth(session.user);
        await actualizarUsuario(session.user);
        router.replace("/inicio");
      } else {
        setAuth(null);
        router.replace("/");
      }
    });
  }, []);

  const actualizarUsuario = async (usuario) => {
    let res = await getUsuarioData(usuario?.id);
    if (res.success) setUsuarioData(res.data, usuario?.id);
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
