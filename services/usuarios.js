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
