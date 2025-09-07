"use client";

import React from "react";
import { useAuth } from "../context/Authcontext";
import { useRouter } from "next/navigation";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-blue-400 text-xl">Cargando...</span>
      </div>
    );
  }

  if (!isLoggedIn) return null;
  return <>{children}</>;
};