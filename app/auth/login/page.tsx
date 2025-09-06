"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            router.replace("/");
        }
    }, [isLoggedIn, router]);

    if (isLoggedIn) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");        

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error);
            }
            const data = await res.json();
             
            if(data.error){
                setError(data.error);
                return;
            }        
            
            login(data.token, data.user);
            router.replace("/");
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-gray-950 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Iniciar sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                Correo electrónico
                </label>
                <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                Contraseña
                </label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="current-password"
                />
            </div>
            {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150"
            >
                Entrar
            </button>
            </form>
        </div>
    );
};

export default LoginPage;