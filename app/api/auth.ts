import { supabase } from "../../config/supabase";
import { createToken } from "./createToken";

export const loginUser = async (email: string, password: string) => {
    let { data: user, error } = await supabase
    .from('user')
    .select('password, email, role')
    .eq('email', email)
    .single();

  const token = await createToken(user.role);
  console.log(token)
  return {user, token};
}