import { subirImagen } from "./imagenes";
import { supabase } from "../lib/supabase";

export const crearOActualizarPublicacion = async (publicacion) => {
  try {
    if (publicacion.archivo && typeof publicacion.archivo === "object") {
      let esImagen = publicacion?.archivo?.type == "image";
      let nombreCarpeta = esImagen ? "imagenes" : "videos";
      let resultado = await subirImagen(
        nombreCarpeta,
        publicacion.archivo.uri,
        esImagen
      );
      if (resultado.success) publicacion.archivo = resultado.data;
      else {
        return resultado;
      }
    }

    const { data, error } = await supabase
      .from("publicaciones")
      .upsert(publicacion)
      .select()
      .single();

    if (error) {
      console.log("Error al crear o actualizar publicacion: ", error);
      return { success: false, error: error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error al crear o actualizar publicacion: ", error);
    return { success: false, error: error };
  }
};
