import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export default function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
   let token =localStorage.getItem("token")
   
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return user ? children : null; 
}
