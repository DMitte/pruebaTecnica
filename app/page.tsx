"use client";
import { useEffect, useState } from "react";
import { Link } from "@heroui/link";
import { Navbar } from "../components/navbar";
import { BarChartThinHorizontal } from "@/components/charts/BarChart";
import { PieChartLabels } from "@/components/charts/LineChart";
import { AreaChartSemiFilled } from "@/components/charts/AreaChart";
import { getUsuariosCount, getCustomersCount, getVentasPorAsesor } from "./api/users";
import { getVentasCount, getVentasPorFecha, getVentasPorEstado } from "./api/sales";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Simulación de datos, reemplaza con tus fetch reales
const fetchDashboardData = async () => {
  const usuarios = await getUsuariosCount();
  const customers = await getCustomersCount();
  const totalVentasRango = await getVentasCount(); 
  const ventasPorAsesor = await getVentasPorAsesor();
  const ventasPorFecha = await getVentasPorFecha();
  const ventasPorEstado = await getVentasPorEstado();
  return {
    usuarios,
    customers,
    totalVentasRango,
    ventasPorAsesor,
    ventasPorFecha,
    ventasPorEstado
  };
};

export default function Home() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData().then(setDashboard);
  }, []);

  if (!dashboard) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <span className="text-blue-400 text-xl">Cargando dashboard...</span>
        </section>
      </>
    );
  }

  return (
    <>
    <ProtectedRoute>
      <Navbar />
      <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
        <h2 className="text-3xl font-bold mb-4 text-blue-500">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
          <div className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col items-center">
            <h3 className="font-semibold text-lg text-blue-400">Usuarios registrados</h3>
            <p className="text-2xl mt-2 text-blue-100">{dashboard.usuarios}</p>
          </div>
          <div className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col items-center">
            <h3 className="font-semibold text-lg text-purple-400">Customers registrados</h3>
            <p className="text-2xl mt-2 text-blue-100">{dashboard.customers}</p>
          </div>
          <div className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col items-center">
            <h3 className="font-semibold text-lg text-green-400">Ventas totales</h3>
            <p className="text-2xl mt-2 text-blue-100">{dashboard.totalVentasRango}</p>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mt-8">
        <div className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="font-semibold text-lg text-blue-400 mb-4">Ventas por asesor</h3>
          <BarChartThinHorizontal data={dashboard.ventasPorAsesor}/>
        </div>
        <div className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="font-semibold text-lg text-purple-400 mb-4">Ventas por estado</h3>
          <PieChartLabels data={dashboard.ventasPorEstado} />
        </div>
        <div className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="font-semibold text-lg text-purple-400 mb-4">Ventas en el tiempo</h3>
          <AreaChartSemiFilled data={dashboard.ventasPorFecha} />
        </div>
        
      </section>
      <footer className="w-full flex items-center justify-center py-3">
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
      </ProtectedRoute>
    </>
  );
}