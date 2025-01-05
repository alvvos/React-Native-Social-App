import { Dimensions } from "react-native";

const { width: anchoPantalla, height: altoPantalla } = Dimensions.get("window");

export const alto = (porcentaje) => {
  if (porcentaje < 0 || porcentaje > 100) {
    throw new Error("El porcentaje debe estar entre 0 y 100");
  }
  return (porcentaje * altoPantalla) / 100;
};

export const ancho = (porcentaje) => {
  if (porcentaje < 0 || porcentaje > 100) {
    throw new Error("El porcentaje debe estar entre 0 y 100");
  }
  return (porcentaje * anchoPantalla) / 100;
};
