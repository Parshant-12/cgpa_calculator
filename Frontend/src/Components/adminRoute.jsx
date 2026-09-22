import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../Context/authContext";
import toast from "react-hot-toast";

export default function adminRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  // If not logged in, or logged in but NOT an admin, redirect to home
  if (!isAuthenticated || user?.role !== 'admin') {
    toast.error("Access denied. Admins only.");
    return <Navigate to="/" replace />;
  }

  return children;
}