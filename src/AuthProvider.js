import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        firstName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],
        lastName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        exp: decoded.exp,
      };
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      setUser(decoded);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      const currentTime = Date.now() / 1000; 
      if (decoded.exp < currentTime) {
        logout(); 
      } else {
        setUser(decoded); 
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeToken(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout(); 
        }
      }
    }, 1000 * 60); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
