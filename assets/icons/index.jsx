import { View, Text } from "react-native";
import Perfil from "./Perfil";
import Campana from "./Campana";
import { tema } from "../../constants/tema";
import Subir from "./Subir";
import Email from "./Email";
import Telefono from "./Telefono";
import Usuario from "./Usuario";

const icons = {
  perfil: Perfil,
  campana: Campana,
  subir: Subir,
  email: Email,
  telefono: Telefono,
  usuario: Usuario,
};

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={tema.colors.textLight}
      {...props}
    />
  );
};

export default Icon;
