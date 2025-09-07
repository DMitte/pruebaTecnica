"use client";
import React, { useState } from "react";
import { Link } from "@heroui/link";
import { Navbar } from "../../../components/navbar";
import { buscarUsuarioPorCedula } from "../../api/users";
import { useAuth } from "../../../context/Authcontext";
import { guardarVenta } from "../../api/sales";
import { ProtectedRoute } from "../../../components/ProtectedRoute";


const generarCodigoVenta = () => {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, "0");
    const mes = String(now.getMonth() + 1).padStart(2, "0");
    const año = now.getFullYear();
    const hora = String(now.getHours()).padStart(2, "0");
    const minutos = String(now.getMinutes()).padStart(2, "0");
    const segundos = String(now.getSeconds()).padStart(2, "0");
    return `F-${año}${mes}${dia}-${hora}${minutos}${segundos}`;
};

type Producto = {
    nombre: string;
    cantidad: number;
    precio: number;
};

export default function AgregarVenta() {
    const { user } = useAuth(); 

    console.log(user)
    const vendedorLogeado = {
        nombre: user?.name || "",
        email: user?.email || "",
        id: user?.id || "",
    };
    const [usuario, setUsuario] = useState({
        cedula: "",
        nombre: "",
        email: "",
        telefono: "",
    });
    const [productos, setProductos] = useState<Producto[]>([]);
    const [nuevoProducto, setNuevoProducto] = useState<Producto>({
        nombre: "",
        cantidad: 1,
        precio: 0,
    });
    const [descuento, setDescuento] = useState(0);
    const [descuentoExtra, setDescuentoExtra] = useState(0);
    const [contadorVenta, setContadorVenta] = useState(1);

    const subtotal = productos.reduce(
        (acc, prod) => acc + prod.precio * prod.cantidad,
        0
    );
    const totalDescuento = descuento + descuentoExtra;
    const total = Math.max(subtotal - totalDescuento, 0);

    const codigoVenta = generarCodigoVenta();
    
    const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cedula = e.target.value;
    setUsuario((prev) => ({ ...prev, cedula }));

    if (cedula.length >= 8) {
        const encontrado = await buscarUsuarioPorCedula(cedula);
        if (encontrado) {
            setUsuario({
                cedula: encontrado.cedula,
                nombre: encontrado.nombres,
                email: encontrado.email,
                telefono: encontrado.celular,
            });
        }
    }
};

    const handleAgregarProducto = () => {
        if (
            nuevoProducto.nombre &&
            nuevoProducto.cantidad > 0 &&
            nuevoProducto.precio > 0
        ) {
            setProductos([...productos, nuevoProducto]);
            setNuevoProducto({ nombre: "", cantidad: 1, precio: 0 });
        }
    };

    const handleEliminarProducto = (idx: number) => {
        setProductos(productos.filter((_, i) => i !== idx));
    };

    const handleGuardarVenta = async () => {
        const venta = {
            cli_nombre: usuario.nombre,
            cli_id: usuario.cedula,
            cli_asesor: vendedorLogeado.nombre,
            inv_code: codigoVenta,
            inv_precio: subtotal,
            inv_descuento: descuento,
            inv_desc_extra: descuentoExtra,
            inv_total: total,
        };

        const { data, error } = await guardarVenta(venta);
        if (error) {
            alert("Error al guardar la venta");
        } else {
            alert("Venta guardada correctamente");
            setContadorVenta(contadorVenta + 1);
            
        setUsuario({
            cedula: "",
            nombre: "",
            email: "",
            telefono: "",            
        });
        setProductos([]);
        setNuevoProducto({ nombre: "", cantidad: 1, precio: 0 });
        setDescuento(0);
        setDescuentoExtra(0);
        setContadorVenta(contadorVenta + 1);
        }
    };

    return (
        <>
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen w-full flex flex-col bg-gradient-to-br">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-500 pt-8">
                    Agregar Nueva Venta
                </h2>
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Cliente */}
                        <section className="bg-[#0a0a0a] rounded-xl p-6 flex flex-col gap-4 shadow-lg">
                            <h3 className="font-semibold text-blue-400 mb-2 text-lg">Cliente</h3>
                            <input
                                type="text"
                                placeholder="Cédula"
                                className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                value={usuario.cedula}
                                onChange={handleCedulaChange}
                            />
                            <input
                                type="text"
                                placeholder="Nombre"
                                className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                value={usuario.nombre}
                                onChange={(e) =>
                                    setUsuario({ ...usuario, nombre: e.target.value })
                                }
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                value={usuario.email}
                                onChange={(e) =>
                                    setUsuario({ ...usuario, email: e.target.value })
                                }
                            />
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                value={usuario.telefono}
                                onChange={(e) =>
                                    setUsuario({ ...usuario, telefono: e.target.value })
                                }
                            />
                        </section>

                        {/* Producto */}
                        <section className="bg-[#0a0a0a] rounded-xl p-6 flex flex-col gap-4 shadow-lg">
                            <h3 className="font-semibold text-purple-400 mb-2 text-lg">Producto</h3>
                            <div className="flex flex-wrap gap-2">
                                <input
                                    type="text"
                                    placeholder="Producto"
                                    className=" rounded p-2 flex-1 min-w-[120px] bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                    value={nuevoProducto.nombre}
                                    onChange={(e) =>
                                        setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                                    }
                                />
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="Cantidad"
                                    className="rounded p-2 w-24 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                    value={nuevoProducto.cantidad}
                                    onChange={(e) =>
                                        setNuevoProducto({
                                            ...nuevoProducto,
                                            cantidad: Number(e.target.value),
                                        })
                                    }
                                />
                                <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    placeholder="Precio"
                                    className="rounded p-2 w-24 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                    value={nuevoProducto.precio}
                                    onChange={(e) =>
                                        setNuevoProducto({
                                            ...nuevoProducto,
                                            precio: Number(e.target.value),
                                        })
                                    }
                                />
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold transition"
                                    onClick={handleAgregarProducto}
                                    type="button"
                                >
                                    Agregar
                                </button>
                            </div>
                            {/* Lista de productos */}
                            {productos.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full border mt-2 text-blue-100">
                                        <thead>
                                            <tr className="bg-[#232336]">
                                                <th className="p-2">Producto</th>
                                                <th className="p-2">Cantidad</th>
                                                <th className="p-2">Precio</th>
                                                <th className="p-2">Total</th>
                                                <th className="p-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productos.map((prod, idx) => (
                                                <tr key={idx} className="border-t border-blue-900">
                                                    <td className="p-2">{prod.nombre}</td>
                                                    <td className="p-2">{prod.cantidad}</td>
                                                    <td className="p-2">${prod.precio.toFixed(2)}</td>
                                                    <td className="p-2">
                                                        ${(prod.precio * prod.cantidad).toFixed(2)}
                                                    </td>
                                                    <td className="p-2">
                                                        <button
                                                            className="text-red-400 hover:underline"
                                                            onClick={() => handleEliminarProducto(idx)}
                                                            type="button"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="block font-medium text-blue-200">Descuento</label>
                                <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className=" rounded p-2 w-full bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                    value={descuento}
                                    onChange={(e) => setDescuento(Number(e.target.value))}
                                />
                                <label className="block font-medium text-blue-200">Descuento Extra</label>
                                <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className=" rounded p-2 w-full bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                                    value={descuentoExtra}
                                    onChange={(e) => setDescuentoExtra(Number(e.target.value))}
                                />
                            </div>
                        </section>

                        {/* Vendedor y Resumen */}
                        <section className="bg-[#0a0a0a] rounded-xl p-6 flex flex-col gap-4 shadow-lg">
                            <h3 className="font-semibold text-green-400 mb-2 text-lg">Vendedor</h3>
                            <p>
                                <span className="font-medium text-blue-200">Nombre:</span> {vendedorLogeado.nombre}
                            </p>
                            <p>
                                <span className="font-medium text-blue-200">Email:</span> {vendedorLogeado.email}
                            </p>
                            <p>
                                <span className="font-medium text-blue-200">Código de venta:</span> {codigoVenta}
                            </p>
                            <div className="mt-4 p-4 bg-[#232336] rounded">
                                <h3 className="font-semibold text-blue-100 mb-2">Resumen</h3>
                                <p>
                                    <span className="font-medium">Subtotal:</span> ${subtotal.toFixed(2)}
                                </p>
                                <p>
                                    <span className="font-medium">Descuentos:</span> ${totalDescuento.toFixed(2)}
                                </p>
                                <p className="text-lg font-bold">
                                    <span className="font-medium">Total:</span> ${total.toFixed(2)}
                                </p>
                            </div>
                            <button
                                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 w-full mt-auto transition"
                                onClick={handleGuardarVenta}
                                type="button"
                            >
                                Guardar Venta
                            </button>
                        </section>
                    </div>
                </div>
                <footer className="w-full flex items-center justify-center py-3 mt-8">
                    <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://danymitte.vercel.app"
                        title="danymitte.vercel.app"
                    >
                        <span className="text-default-600">Creado por</span>
                        <p className="text-primary">Dany Mitte</p>
                    </Link>
                </footer>
            </div>
            </ProtectedRoute>
        </>
    );
}