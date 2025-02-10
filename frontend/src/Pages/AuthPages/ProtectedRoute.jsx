/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Wait for auth check to complete

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && auth.role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
