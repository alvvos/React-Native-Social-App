import * as Font from "expo-font";

export const cargarFuentes = async () => {
  await Font.loadAsync({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });
};

export const fuentes = {
  Poppins: "Poppins-Regular",
  PoppinsSemiBold: "Poppins-SemiBold",
  PoppinsBold: "Poppins-Bold",
};
