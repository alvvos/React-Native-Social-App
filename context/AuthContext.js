import { useContext, useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const setAuth = (authUsuario) => {
    setUsuario(authUsuario);
  };

  const setUsuarioData = (usuarioData, id) => {
    setUsuario({ ...usuarioData, id });
  };

  return (
    <AuthContext.Provider value={{ usuario, setAuth, setUsuarioData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
