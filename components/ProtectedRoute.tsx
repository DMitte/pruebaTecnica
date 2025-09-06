"use client";

import React from "react";
import { useAuth } from "../context/Authcontext";
import { useRouter } from "next/navigation";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;
  return <>{children}</>;
};