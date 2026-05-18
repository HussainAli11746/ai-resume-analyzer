import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import LoadingPage from "../features/pages/loading";

export const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage mode="login" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
