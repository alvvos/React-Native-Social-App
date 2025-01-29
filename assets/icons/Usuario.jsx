import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { tema } from "../../constants/tema";

const Usuario = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 32 32"
      width={24}
      height={24}
      color={tema.colors.text}
      {...props}
    >
      <Circle fill={tema.colors.text} cx="16" cy="10" r="6" />
      <Path
        fill={tema.colors.text}
        d="M16 18c-6.627 0-12 3.582-12 8v2h24v-2c0-4.418-5.373-8-12-8z"
      />
    </Svg>
  );
};

export default Usuario;
