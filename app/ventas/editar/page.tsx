"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../../components/navbar";
import { useAuth } from "../../../context/Authcontext";
import { actualizarVenta, buscarVentaPorId } from "../../api/sales";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { Link } from "@heroui/link";

export default function EditarVenta() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ventaId = searchParams.get("id");
  const { user } = useAuth();
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (user === undefined || user === null) return;
    if (
      user === null ||
      (user.role !== "supervisor" && user.role !== "admin")
    ) {
      setDenied(true);
      setTimeout(() => {
        router.replace("/ventas");
      }, 1500);
    }
  }, [user, router]);

  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<any[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    cantidad: 1,
    precio: 0,
  });
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(Number(venta?.inv_total || 0));

  useEffect(() => {
    async function fetchVenta() {
      if (ventaId) {
        const data = await buscarVentaPorId(ventaId);
        setVenta(data);
        setProductos(data.productos || []);
        setSubtotal(Number(data.inv_precio || 0));
        setLoading(false);
      }
    }
    fetchVenta();
  }, [ventaId]);

  // Formulario controlado para cliente y producto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  // Agregar producto
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

  // Eliminar producto
  const handleEliminarProducto = (idx: number) => {
    setProductos(productos.filter((_, i) => i !== idx));
  };
  // Calcular precios

useEffect(() => {
  if (venta) {
    let nuevoSubtotal = Number(venta.inv_precio || 0);
    productos.forEach((prod) => {
      nuevoSubtotal += prod.precio * prod.cantidad;
    });
    setSubtotal(nuevoSubtotal);
    const descuento = Number(venta.inv_descuento || 0);
    const descuentoExtra = Number(venta.inv_desc_extra || 0);    
    setTotal(Math.max(nuevoSubtotal - descuento - descuentoExtra, 0));
  }
}, [productos, venta?.inv_descuento, venta?.inv_desc_extra, venta?.inv_total]);


  // Guardar venta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ventaActualizada = {
      ...venta,      
      inv_precio: subtotal,
      inv_descuento: Number(venta.inv_descuento || 0),
      inv_desc_extra: Number(venta.inv_desc_extra || 0),
      inv_total: total,
    };
    const { error } = await actualizarVenta(ventaId, ventaActualizada);
    if (error) {
      alert("Error al editar la venta");
    } else {
      alert("Venta editada correctamente");
      router.replace("/ventas");
    }
  };

  if (loading || !venta) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#18181b] to-[#0a0a0a]">
          <span className="text-blue-400 text-xl">Cargando venta...</span>
        </div>
      </>
    );
  }

  if (denied) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#18181b] to-[#0a0a0a]">
          <span className="text-red-400 text-xl font-bold">
            Acceso denegado: solo supervisores y administradores pueden editar
            ventas.
          </span>
        </div>
      </>
    );
  }

  return (
    <>
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-br">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-500 pt-8">
          Editar Venta
        </h2>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex-1">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cliente */}
              <section className="bg-[#0a0a0a] rounded-xl p-6 flex flex-col gap-4 shadow-lg">
                <h3 className="font-semibold text-blue-400 mb-2 text-lg">
                  Cliente
                </h3>
                <input
                  type="text"
                  name="cli_nombre"
                  placeholder="Nombre"
                  className=" rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={venta.cli_nombre || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cli_id"
                  placeholder="Cédula"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={venta.cli_id || ""}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="cli_fec_nac"
                  placeholder="Fecha de nacimiento"
                  className=" rounded p-2 bg-[#232336] text-blue-100 focus:ring-2 focus:ring-blue-500"
                  value={venta.cli_fec_nac || ""}
                  onChange={handleChange}
                />
              </section>
              {/* Producto */}
              <section className="bg-[#0a0a0a] rounded-xl p-6 flex flex-col gap-4 shadow-lg">
                <h3 className="font-semibold text-purple-400 mb-2 text-lg">
                  Productos
                </h3>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Producto"
                    className=" rounded p-2 flex-1 min-w-[120px] bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                    value={nuevoProducto.nombre}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        nombre: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Cantidad"
                    className=" rounded p-2 w-24 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
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
                    className=" rounded p-2 w-24 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
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
                {/* Descuentos editables debajo de la tabla */}
                <div className="flex flex-col gap-2 mt-4">
                  <label className="font-medium text-blue-200">Descuento</label>
                  <input
                    type="number"
                    name="inv_descuento"
                    min={0}
                    step={0.01}
                    className=" rounded p-2 w-full bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                    value={venta.inv_descuento || 0}
                    onChange={handleChange}
                  />
                  <label className="font-medium text-blue-200">
                    Descuento Extra
                  </label>
                  <input
                    type="number"
                    name="inv_desc_extra"
                    min={0}
                    step={0.01}
                    className=" rounded p-2 w-full bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                    value={venta.inv_desc_extra || 0}
                    onChange={handleChange}
                  />
                </div>
              </section>
              {/* Vendedor y Resumen */}
              <section className="bg-[#0a0a0a] rounded-xl p-6 flex flex-col gap-4 shadow-lg">
                <h3 className="font-semibold text-green-400 mb-2 text-lg">
                  Vendedor
                </h3>
                <input
                  type="text"
                  name="cli_asesor"
                  placeholder="Nombre asesor"
                  className=" rounded p-2 bg-[#232336] text-blue-100 focus:ring-2 focus:ring-blue-500"
                  value={venta.cli_asesor || ""}
                  disabled
                />
                <input
                  type="text"
                  name="inv_code"
                  placeholder="Código de venta"
                  className=" rounded p-2 bg-[#232336] text-blue-100 focus:ring-2 focus:ring-blue-500"
                  value={venta.inv_code || ""}
                  disabled
                />
                <div className="mt-4 p-4 bg-[#232336] rounded">
                  <h3 className="font-semibold text-blue-100 mb-2">Resumen</h3>
                  <p>
                    <span className="font-medium">Subtotal:</span> $
                    {subtotal.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Descuento:</span> $
                    {Number(venta.inv_descuento || 0).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Descuento Extra:</span> $
                    {Number(venta.inv_desc_extra || 0).toFixed(2)}
                  </p>
                  <p className="text-lg font-bold">
                    <span className="font-medium">Total:</span> $
                    {Number(total).toFixed(2)}
                  </p>
                </div>
                
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
              >
                Guardar Cambios
              </button>
            
              </section>
            </div>
            
          </form>
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
