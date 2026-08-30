import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If no user is logged in, redirect straight to the login page
  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};