// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Al cargar la app, revisa si hay datos de usuario en localStorage
    const usuarioGuardado = localStorage.getItem('usuarioInfo');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const login = (dataUsuario) => {
    // Al iniciar sesión, guarda en localStorage y en el estado
    localStorage.setItem('usuarioInfo', JSON.stringify(dataUsuario));
    setUsuario(dataUsuario);
  };

  const logout = () => {
    // Al cerrar sesión, limpia todo
    localStorage.removeItem('usuarioInfo');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};