import { supabase } from "../../config/supabase";


export const getUsers = async () => {
    let { data: users, error } = await supabase
        .from('user')
        .select('*')        
        .order("created_at", { ascending: false });

    return { users, error };
}

export async function buscarUsuarioPorCedula(cedula: string) {
    const { data, error } = await supabase
        .from("customers")
        .select("cedula, nombres, email, celular")
        .eq("cedula", cedula)
        .single();

    if (error || !data) return null;
    return data;
}

export async function getUsuariosCount() {
  const { count, error } = await supabase
    .from("user") 
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count || 0;
}

export async function getCustomersCount() {
  const { count, error } = await supabase
    .from("customers") 
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count || 0;
}

export async function getVentasPorAsesor() {
  const { data, error } = await supabase
    .from("venta")
    .select("cli_asesor, id");

  if (error || !data) return [];
  // Agrupa los datos por cli_asesor y cuenta las ventas
  const ventasPorAsesor: { [key: string]: number } = {};
  data.forEach((item: any) => {
    ventasPorAsesor[item.cli_asesor] = (ventasPorAsesor[item.cli_asesor] || 0) + 1;
  });
  // Formatea los datos para el chart
  return Object.entries(ventasPorAsesor).map(([key, value]) => ({
    key,
    value,
  }))};

  export async function agregarUsuario(user: {
  nombre: string;
  username: string;
  email: string;
  role: string;
}) {
  const { data, error } = await supabase
    .from("user")
    .insert([user])
    .select()
    .single();

  if (error) return { error };
  return { data };
}

export async function editarUsuario(id: string | number, user: {
  nombre?: string;
  username?: string;
  email?: string;
  role?: string;
  password?: string;
}) {
  if (!id) return { error: "ID de usuario inválido" };

  const { data, error } = await supabase
    .from("user")
    .update(user)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error };
  return { data };
}

export async function eliminarUsuario(id: string | number) {
  if (!id) return { error: "ID de usuario inválido" };

  const { data, error } = await supabase
    .from("user")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return { error };
  return { data };
}