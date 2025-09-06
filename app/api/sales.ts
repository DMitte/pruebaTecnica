import {supabase} from "../../config/supabase";

export const getSales = async () => {
    let { data: venta, error } = await supabase
    .from('venta')
    .select('*')    

    return { venta, error };
}