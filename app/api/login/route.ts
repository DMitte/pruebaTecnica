import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../config/supabase";
import { createToken } from "../createToken";

export async function POST (req: NextRequest){
    const { email, password } = await req.json();

    let { data: user, error} = await supabase
    .from('user')
    .select('name,password, email, role')
    .eq('email', email)
    .single();

    if(!user) {
        return NextResponse.json({ error: "Usuario no encontrado"})
    }

    if(user.password !== password){
        return NextResponse.json({ error: "Contraseña incorrecta"})
    }

    const token = await createToken(user.role);    

    return NextResponse.json({ user, token });
}