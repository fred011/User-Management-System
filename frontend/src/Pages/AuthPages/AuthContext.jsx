import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { baseAPI } from "../../environment";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(
        `${baseAPI}/auth/verify-token`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.valid) {
        setAuth(response.data.user);
        localStorage.setItem("auth", JSON.stringify(response.data.user));
        localStorage.setItem("token", token);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    const savedUser = localStorage.getItem("auth");
    const savedToken = localStorage.getItem("token");
    if (mode) {
      setDark(JSON.parse(mode));
    }
    if (savedUser && savedToken) {
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (user) => {
    setAuth(user);
    localStorage.setItem("auth", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
  };

  const modeChange = () => {
    localStorage.setItem("mode", `${!dark}`);
    setDark(!dark);
  };

  return (
    <AuthContext.Provider
      value={{ auth, dark, login, logout, loading, modeChange }}
    >
      {children}
    </AuthContext.Provider>
  );
};
