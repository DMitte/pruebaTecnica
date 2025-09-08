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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setRole(user?.role ?? null);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-10 py-4 border-b border-b-zinc-900 bg-zinc-950 relative">
      <div>
        <h1 className="text-2xl font-bold">Next.js</h1>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex">
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

      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center px-2 py-1 rounded text-white bg-zinc-800"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Abrir menú"
      >
        <svg width={24} height={24} fill="none">
          <path
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-900 z-50 md:hidden">
          <ul className="flex flex-col gap-2 px-4 py-2">
            {siteConfig.navItems
              .filter((item) => !(item.href === "/usuarios" && role !== "admin"))
              .map((item) => (
                <li
                  key={item.href}
                  className="hover:underline underline-offset-4 transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  <NextLink href={item.href}>{item.label}</NextLink>
                </li>
              ))}
            <li className="mt-2">
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Salir
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Desktop user info and logout */}
      <div className="hidden md:flex items-center gap-4">
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