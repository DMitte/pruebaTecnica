"use client";
import NextLink from "next/link";
import { siteConfig } from "../config/site";
import { useAuth } from "../context/Authcontext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [role, setRole] = useState<string | null>(null);
  const { logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setRole(user?.role ?? null);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-10 py-4 border-b border-b-zinc-900">
      <div>
        <h1 className="text-2xl font-bold">Next.js</h1>
      </div>

      <div>
        <ul className="flex gap-4 lg:gap-6">
          {siteConfig.navItems
            .filter((item) => !(item.href === "/usuarios" && role !== "admin"))
            .map((item) => (
              <li
                key={item.href}
                className="hover:underline underline-offset-4 transition-all duration-200"
              >
                <NextLink href={item.href}>{item.label}</NextLink>
              </li>
            ))}
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <p>{role ? role : "Sin rol"}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Salir
        </button>
      </div>
    </nav>
  );
};
