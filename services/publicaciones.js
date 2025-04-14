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

export const buscarPublicacion = async (limite = 10) => {
  try {
    const { data, error } = await supabase
      .from("publicaciones")
      .select(
        `*,
        usuario: usuarios (id, nombre, imagen)
        `
      )
      .limit(limite)
      .order("created_at", { ascending: false });
    if (error) {
      console.log("Error al obtener publicaciones: ", error);
      return { success: false, error: error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error al obtener publicaciones: ", error);
    return { success: false, error: error };
  }
};

export const buscarPublicacionesUsuario = async (usuarioId, limite = 10) => {
  try {
    const { data, error } = await supabase
      .from("publicaciones")
      .select(
        `*,
        usuario: usuarios (id, nombre, imagen)
        `
      )
      .eq("id_usuario", usuarioId)
      .limit(limite)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error al obtener publicaciones del usuario: ", error);
      return { success: false, error: error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error al obtener publicaciones del usuario: ", error);
    return { success: false, error: error };
  }
};

export const buscarLikesPorIdPublicacion = async (idPublicacion) => {
  try {
    const { data, error } = await supabase
      .from("me_gustas")
      .select(`*`)
      .eq("id_publicacion", idPublicacion)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error al obtener likes de la publicacion: ", error);
      return { success: false, error: error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error al obtener likes de la publicacion: ", error);
    return { success: false, error: error };
  }
};

export const agregarLikePorIdPublicacion = async (idPublicacion, idUsuario) => {
  try {
    const { data: likeExistente, error: errorVerificacion } = await supabase
      .from("me_gustas")
      .select("id")
      .eq("id_publicacion", idPublicacion)
      .eq("id_usuario", idUsuario)
      .maybeSingle();

    if (errorVerificacion) {
      console.error("Error al verificar like:", errorVerificacion);
      return {
        success: false,
        error: errorVerificacion,
      };
    }

    if (likeExistente) {
      return {
        success: true,
        data: null,
        accion: "like_ya_existente",
      };
    }

    const { error: errorInsercion } = await supabase.from("me_gustas").insert({
      id_publicacion: idPublicacion,
      id_usuario: idUsuario,
    });

    if (errorInsercion) {
      console.error("Error al agregar like:", errorInsercion);
      return {
        success: false,
        error: errorInsercion,
      };
    }

    const { data: todosLosLikes, error: errorConsulta } = await supabase
      .from("me_gustas")
      .select(
        `
        *,
        usuario:usuarios(id, nombre)
      `
      )
      .eq("id_publicacion", idPublicacion);

    if (errorConsulta) {
      console.error("Error al obtener likes:", errorConsulta);
      return {
        success: false,
        error: errorConsulta,
      };
    }

    return {
      success: true,
      data: todosLosLikes,
      accion: "like_agregado",
    };
  } catch (error) {
    console.error("Error inesperado:", error);
    return {
      success: false,
      error,
    };
  }
};

export const obtenerComentariosPorPublicacion = async (idPublicacion) => {
  try {
    const { data, error } = await supabase
      .from("comentarios")
      .select(
        `*,
        usuario:usuarios(id, nombre, imagen)
        `
      )
      .eq("id_publicacion", idPublicacion)
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Error al obtener comentarios de la publicación: ", error);
      return { success: false, error: error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error al obtener comentarios de la publicación: ", error);
    return { success: false, error: error };
  }
};

export const agregarComentario = async (idPublicacion, idUsuario, cuerpo) => {
  try {
    const { data, error } = await supabase
      .from("comentarios")
      .insert({
        id_publicacion: idPublicacion,
        id_usuario: idUsuario,
        cuerpo: cuerpo,
      })
      .select(
        `*,
        usuario:usuarios(id, nombre, imagen)
        `
      )
      .single();

    if (error) {
      console.log("Error al agregar comentario: ", error);
      return { success: false, error: error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error al agregar comentario: ", error);
    return { success: false, error: error };
  }
};
