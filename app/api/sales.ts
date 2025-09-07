import {supabase} from "../../config/supabase";
const estadoColors: Record<string, { colorFrom: string; colorTo: string }> = {
  Aprobada: { colorFrom: "text-green-400", colorTo: "text-green-400" },
  Pendiente: { colorFrom: "text-yellow-400", colorTo: "text-yellow-400" },
  Rechazada: { colorFrom: "text-red-400", colorTo: "text-red-400" },  
};

export const getSales = async () => {
    let { data: venta, error } = await supabase
        .from('venta')
        .select('*')        
        .order("created_at", { ascending: false });

    return { venta, error };
}

export async function guardarVenta(venta: {
  cli_nombre: string;
  cli_id: string;  
  cli_asesor: string;
  inv_code: string;
  inv_precio: number;
  inv_descuento: number;
  inv_desc_extra: number;
  inv_total: number;
}) {
  const { data, error } = await supabase
    .from("venta")
    .insert([venta]);
  return { data, error };
}

export async function aprobarVenta(id: string) {
  const { error } = await supabase
    .from("venta")
    .update({ venta_estado: "Aprobada" })
    .eq("id", id);

  if (error) {
    alert("Error al aprobar la venta");
  } else {
    alert("Venta aprobada correctamente");
    window.location.reload(); // O actualiza el estado local si usas SWR/React Query
  }
}

export async function buscarVentaPorId(id: string) {
  const { data, error } = await supabase
    .from("venta")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function actualizarVenta(id: string, ventaActualizada: {
  cli_nombre?: string;
  cli_id?: string;
  cli_asesor?: string;
  inv_code?: string;
  inv_precio?: number;
  inv_descuento?: number;
  inv_desc_extra?: number;
  inv_total?: number;
  productos?: any[];
  cli_fec_nac?: string;
  // Agrega otros campos si tu tabla los tiene
}) {
  const { data, error } = await supabase
    .from("venta")
    .update(ventaActualizada)
    .eq("id", id);

  return { data, error };
}

export async function getVentasCount() {
  const { count, error } = await supabase
    .from("venta")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count || 0;
}

export async function getVentasPorFecha() {
  const { data, error } = await supabase
    .from("venta")
    .select("created_at, id", { count: "exact" })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  // Agrupa por fecha (yyyy-mm-dd) y cuenta ventas por fecha
  const grouped = data.reduce((acc: Record<string, number>, item: any) => {
    const date = item.created_at?.slice(0, 10); // yyyy-mm-dd
    if (date) {
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});
  return Object.entries(grouped).map(([date, value]) => ({
    date,
    value,
  }));
}

export async function getVentasPorEstado() {
  const { data, error } = await supabase
    .from("venta")
    .select("venta_estado, id");

  if (error || !data) return [];

  // Agrupa por estado y cuenta las ventas
  const grouped: Record<string, number> = {};
  data.forEach((item: any) => {
    if (item.venta_estado) {
      grouped[item.venta_estado] = (grouped[item.venta_estado] || 0) + 1;
    }
  });

  return Object.entries(grouped).map(([estado, count]) => ({
    name: estado,
    value: count,
    colorFrom: estadoColors[estado]?.colorFrom || "text-blue-400",
    colorTo: estadoColors[estado]?.colorTo || "text-blue-400",
  }));
}

export async function eliminarVentaSoft(id: string) {
  const { data, error } = await supabase
    .from("venta")
    .update({ deleted: true })
    .eq("id", id);

  return { data, error };
}

export async function eliminarVentaHard(id: string) {
  // Primero verifica si la venta tiene deleted en true
  const { data, error } = await supabase
    .from("venta")
    .select("deleted")
    .eq("id", id)
    .single();

  if (error || !data) return { error: error || "Venta no encontrada" };
  if (!data.deleted) return { error: "La venta no está marcada como eliminada" };

  // Si deleted es true, elimina completamente
  const res = await supabase
    .from("venta")
    .delete()
    .eq("id", id);

  return { data: res.data, error: res.error };
}