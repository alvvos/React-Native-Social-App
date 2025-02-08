import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';


export const subirImagen = async (nombre_carpeta, uri, esImagen=true) => {
    try {
        let nombre_archivo = getPwd(nombre_carpeta, esImagen);        
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        let imagenData = decode(base64);
        
        let { data, error } = await supabase
            .storage
            .from('subidas')
            .upload(nombre_archivo, imagenData, {
                cacheControl: '3600',
                upsert: false,
                contentType: esImagen ? 'image/*' : 'video/*'
            });
        
        if (error) {
            console.log("Error subiendo imagen", error);
            return { success: false, error: error };
        }

        console.log('data: ', data);
        return { success: true, data: data.path };

    } catch (error) {
        console.log("Error subiendo imagen", error);
        return { success: false, error: error };
    }
}

export const getPwd = (nombre_carpeta, esImagen) => {
    return `/${nombre_carpeta}/${(new Date()).getTime()}${esImagen ? '.png' : '.mp4'}`;
}