import { supabase } from "../lib/supabase";

export const crearNotificacion = async (notificacion) => {
  try {
    const { data, error } = await supabase
      .from("notificaciones")
      .insert(notificacion)
      .select()
      .single();

    if (error) {
      console.log("Error al crear notificación: ", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Error al crear notificación: ", error);
    return { success: false, error };
  }
};
