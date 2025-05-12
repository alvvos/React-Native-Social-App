import { supabase } from "../lib/supabase";

export const getUsuarioData = async (id_usuario) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select()
      .eq("id", id_usuario)
      .single();

    if (error) {
      return { success: false, msg: error?.message };
    }

    return { success: true, data };
  } catch (error) {
    console.log("error: ", error);

    return { success: false, msg: error.message };
  }
};

export const obtenerUsuarioPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUsuarioData = async (id_usuario, data) => {
  try {
    const { error } = await supabase
      .from("usuarios")
      .update(data)
      .eq("id", id_usuario);

    if (error) {
      return { success: false, msg: "Error:" + error?.message };
    }

    return { success: true, data };
  } catch (error) {
    console.log("error: ", error);

    return { success: false, msg: error.message };
  }
};

export const obtenerUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("nombre");

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
